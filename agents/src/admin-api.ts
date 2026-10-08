import { readFile } from "node:fs/promises";
import type { Config } from "./config.js";
import type { Database } from "./database.js";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const knownAgents = [
  { name: "discovery", title: "Discovery Agent", description: "Поиск кандидатов через YouTube API и импорт", runNames: [] as string[], actor: "discovery" },
  { name: "creator_scorer", title: "Scoring Agent", description: "Оценка блогера по шкале плана", runNames: ["creator_scorer", "candidate_scorer"], actor: "creator_scorer" },
  { name: "personalization_agent", title: "Personalization Agent", description: "Черновик первого письма по подтверждённой публикации", runNames: ["personalization_agent"], actor: "personalization_agent" },
  { name: "outreach_agent", title: "Outreach Agent", description: "Отправка одобренных писем через Resend", runNames: ["outreach_agent"], actor: "outreach_agent" },
  { name: "reply_agent", title: "Reply Agent", description: "Классификация входящих ответов, отписки", runNames: ["reply_agent"], actor: "reply_agent" },
  { name: "partner_agent", title: "Partner Agent", description: "Создание партнёра, промокода и доступа в VibeUI", runNames: ["partner_agent"], actor: "partner_agent" },
  { name: "publication_monitor", title: "Publication Monitor", description: "Проверка ссылки, disclosure и erid", runNames: ["publication_monitor"], actor: "publication_monitor" },
];

const jobAgent: Record<string, string> = {
  score_creator: "creator_scorer", score_candidate: "creator_scorer", personalize_thread: "personalization_agent",
  send_message: "outreach_agent", classify_reply: "reply_agent", create_partner: "partner_agent",
  monitor_publication: "publication_monitor", sync_partner_stats: "partner_agent",
};

type Handler = (database: Database, config: Config, url: URL, id: string | null) => Promise<unknown>;

export async function handleAdminApi(database: Database, config: Config, url: URL): Promise<{ status: number; body: unknown } | null> {
  const match = /^\/api\/([a-z-]+(?:\/[a-z-]+)?)(?:\/([^/]+))?$/.exec(url.pathname);
  if (!match) return null;
  const [, route, rawId] = match;
  const handler = routes[route ?? ""];
  if (!handler) return null;
  const id = rawId ?? null;
  if (id !== null && !uuidPattern.test(id)) return { status: 404, body: { error: "not_found" } };
  const body = await handler(database, config, url, id);
  return body === null ? { status: 404, body: { error: "not_found" } } : { status: 200, body };
}

function text(url: URL, key: string): string | null {
  const value = url.searchParams.get(key)?.trim();
  return value ? value.slice(0, 200) : null;
}
function limit(url: URL, fallback = 100): number {
  const value = Number.parseInt(url.searchParams.get("limit") ?? "", 10);
  return Number.isFinite(value) && value > 0 ? Math.min(value, 500) : fallback;
}

const routes: Record<string, Handler> = {
  overview: async (database, config) => {
    const [control, counts, jobs, recentRuns, notifications, spend, funnel] = await Promise.all([
      database`SELECT emergency_stop, outreach_paused, partnerships_paused, payouts_paused, safe_tasks_only, model_operations_paused, reason, updated_at FROM agent_control WHERE singleton = true`,
      database`SELECT
        (SELECT count(*)::int FROM creators) AS creators,
        (SELECT count(*)::int FROM creators WHERE created_at >= date_trunc('day', now())) AS creators_today,
        (SELECT count(*)::int FROM creators WHERE status = 'eligible') AS eligible,
        (SELECT count(*)::int FROM outreach_messages WHERE direction = 'outbound' AND status = 'draft') AS drafts,
        (SELECT count(*)::int FROM outreach_messages WHERE direction = 'outbound' AND sent_at IS NOT NULL) AS sent,
        (SELECT count(*)::int FROM outreach_messages WHERE direction = 'outbound' AND sent_at >= date_trunc('day', now())) AS sent_today,
        (SELECT count(DISTINCT thread_id)::int FROM outreach_messages WHERE direction = 'inbound') AS replied_threads,
        (SELECT count(*)::int FROM conversation_threads WHERE state NOT IN ('queued', 'declined', 'unsubscribe', 'do_not_contact')) AS active_threads,
        (SELECT count(*)::int FROM partners) AS partners,
        (SELECT count(*)::int FROM publications WHERE created_at >= now() - interval '7 days') AS publications_week,
        (SELECT count(*)::int FROM agent_runs WHERE status = 'failed' AND started_at >= now() - interval '24 hours') AS errors_24h,
        (SELECT count(*)::int FROM agent_actions WHERE decision = 'blocked' AND created_at >= now() - interval '24 hours') AS blocked_24h,
        (SELECT count(*)::int FROM notifications WHERE severity = 'critical' AND created_at >= now() - interval '24 hours') AS critical_24h`,
      database<{ status: string; count: number }[]>`SELECT status, count(*)::int AS count FROM agent_jobs GROUP BY status`,
      database`SELECT r.id, r.agent_name, r.status, r.model, r.output_summary, r.error, r.started_at, r.finished_at,
        (SELECT sum(cost_usd)::float FROM model_usage u WHERE u.run_id = r.id) AS cost_usd FROM agent_runs r ORDER BY r.started_at DESC LIMIT 8`,
      database`SELECT id, severity, kind, title, created_at FROM notifications ORDER BY created_at DESC LIMIT 8`,
      spending(database, config),
      partnerFunnel(config),
    ]);
    const state = control[0] ?? {};
    const c = counts[0] ?? {};
    const status = state.emergency_stop ? "emergency_stop"
      : state.model_operations_paused || Number(c.errors_24h) > 0 || Number(c.critical_24h) > 0 ? "degraded"
      : state.outreach_paused ? "paused" : "normal";
    return {
      status, control: state, counts: c,
      jobs: Object.fromEntries(jobs.map((row) => [row.status, row.count])),
      recentRuns, notifications, spending: spend, funnel,
    };
  },

  agents: async (database) => {
    const [runs, usage, jobs, actions] = await Promise.all([
      database<{ agent_name: string; running: number; completed_24h: number; failed_24h: number; last_started: string | null; last_status: string | null; last_error: string | null }[]>`
        SELECT agent_name,
          count(*) FILTER (WHERE status = 'running')::int AS running,
          count(*) FILTER (WHERE status = 'completed' AND started_at >= now() - interval '24 hours')::int AS completed_24h,
          count(*) FILTER (WHERE status = 'failed' AND started_at >= now() - interval '24 hours')::int AS failed_24h,
          max(started_at) AS last_started,
          (array_agg(status ORDER BY started_at DESC))[1] AS last_status,
          (array_agg(error ORDER BY started_at DESC))[1] AS last_error
        FROM agent_runs GROUP BY agent_name`,
      database<{ agent_name: string; calls: number; cost_usd: number }[]>`SELECT agent_name, count(*)::int AS calls, sum(cost_usd)::float AS cost_usd FROM model_usage GROUP BY agent_name`,
      database<{ kind: string; status: string; count: number }[]>`SELECT kind, status, count(*)::int AS count FROM agent_jobs WHERE status IN ('queued', 'running', 'failed') GROUP BY kind, status`,
      database<{ actor: string; last_action: string; decision: string; created_at: string }[]>`
        SELECT DISTINCT ON (actor) actor, action AS last_action, decision, created_at FROM agent_actions ORDER BY actor, created_at DESC`,
    ]);
    return knownAgents.map((agent) => {
      const ownRuns = runs.filter((row) => agent.runNames.includes(row.agent_name));
      const ownJobs = jobs.filter((row) => jobAgent[row.kind] === agent.name);
      const sumJobs = (status: string) => ownJobs.filter((row) => row.status === status).reduce((sum, row) => sum + row.count, 0);
      const lastAction = actions.find((row) => row.actor === agent.actor) ?? null;
      const lastRun = ownRuns.sort((a, b) => String(b.last_started).localeCompare(String(a.last_started)))[0] ?? null;
      const running = ownRuns.reduce((sum, row) => sum + row.running, 0) + sumJobs("running");
      return {
        ...agent,
        state: running > 0 ? "running" : sumJobs("queued") > 0 ? "queued" : "idle",
        running, queued: sumJobs("queued"), failedJobs: sumJobs("failed"),
        completed24h: ownRuns.reduce((sum, row) => sum + row.completed_24h, 0),
        failed24h: ownRuns.reduce((sum, row) => sum + row.failed_24h, 0),
        lastRun, lastAction,
        modelCalls: usage.filter((row) => row.agent_name.startsWith(agent.name) || agent.runNames.some((name) => row.agent_name.startsWith(name))).reduce((sum, row) => sum + row.calls, 0),
        costUsd: usage.filter((row) => row.agent_name.startsWith(agent.name) || agent.runNames.some((name) => row.agent_name.startsWith(name))).reduce((sum, row) => sum + row.cost_usd, 0),
      };
    });
  },

  runs: async (database, _config, url, id) => {
    if (id) {
      const run = (await database`SELECT * FROM agent_runs WHERE id = ${id}`)[0];
      if (!run) return null;
      const [job, usage] = await Promise.all([
        run.job_id ? database`SELECT id, kind, payload, status, attempts, max_attempts, last_error, created_at FROM agent_jobs WHERE id = ${run.job_id}` : Promise.resolve([]),
        database`SELECT model, input_tokens, cached_input_tokens, output_tokens, cost_usd::float, created_at FROM model_usage WHERE run_id = ${id}`,
      ]);
      return { run, job: job[0] ?? null, usage };
    }
    const agent = text(url, "agent");
    const status = text(url, "status");
    return database`
      SELECT r.id, r.agent_name, r.job_id, r.status, r.model, r.input_summary, r.output_summary, r.error, r.started_at, r.finished_at,
        (SELECT sum(cost_usd)::float FROM model_usage u WHERE u.run_id = r.id) AS cost_usd
      FROM agent_runs r
      WHERE true ${agent ? database`AND r.agent_name = ${agent}` : database``} ${status ? database`AND r.status = ${status}` : database``}
      ORDER BY r.started_at DESC LIMIT ${limit(url)}`;
  },

  queue: async (database, _config, url) => {
    const status = text(url, "status");
    const kind = text(url, "kind");
    return database`
      SELECT id, kind, payload, status, attempts, max_attempts, available_at, locked_by, last_error, created_at, updated_at
      FROM agent_jobs
      WHERE true ${status ? database`AND status = ${status}` : database``} ${kind ? database`AND kind = ${kind}` : database``}
      ORDER BY CASE status WHEN 'running' THEN 0 WHEN 'queued' THEN 1 WHEN 'failed' THEN 2 ELSE 3 END, created_at DESC
      LIMIT ${limit(url)}`;
  },

  creators: async (database, _config, url, id) => {
    if (id) return creatorCard(database, id);
    const q = text(url, "q");
    const market = text(url, "market");
    const status = text(url, "status");
    const platform = text(url, "platform");
    return database`
      SELECT c.id, c.display_name, c.market, c.language, c.country, c.status, c.do_not_contact, c.updated_at,
        p.platform, p.profile_url, p.followers, p.median_views,
        s.total AS score, s.valid AS score_valid, s.details->'redFlags' AS red_flags,
        (SELECT source_url FROM creator_contacts cc WHERE cc.creator_id = c.id ORDER BY verified_at DESC NULLS LAST LIMIT 1) AS contact_source,
        (SELECT max(m.sent_at) FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id WHERE t.creator_id = c.id) AS last_contact_at
      FROM creators c
      LEFT JOIN LATERAL (SELECT * FROM creator_profiles cp WHERE cp.creator_id = c.id ORDER BY followers DESC NULLS LAST LIMIT 1) p ON true
      LEFT JOIN LATERAL (SELECT * FROM candidate_scores cs WHERE cs.creator_id = c.id ORDER BY created_at DESC LIMIT 1) s ON true
      WHERE true
        ${q ? database`AND (c.display_name ILIKE ${"%" + q + "%"} OR p.profile_url ILIKE ${"%" + q + "%"})` : database``}
        ${market ? database`AND c.market = ${market}` : database``}
        ${status ? database`AND c.status = ${status}` : database``}
        ${platform ? database`AND p.platform = ${platform}` : database``}
      ORDER BY s.total DESC NULLS LAST, c.updated_at DESC LIMIT ${limit(url, 200)}`;
  },

  conversations: async (database, _config, url, id) => {
    if (id) {
      const thread = (await database`
        SELECT t.*, c.display_name, c.market, c.do_not_contact, cc.value AS contact, cc.source_url AS contact_source, oc.name AS campaign
        FROM conversation_threads t JOIN creators c ON c.id = t.creator_id
        JOIN creator_contacts cc ON cc.id = t.contact_id JOIN outreach_campaigns oc ON oc.id = t.campaign_id
        WHERE t.id = ${id}`)[0];
      if (!thread) return null;
      const messages = await database`SELECT id, direction, kind, status, subject, body, facts, source_urls, model, approved_by, approved_at, reviewed_at, edited_at, sent_at, received_at, created_at FROM outreach_messages WHERE thread_id = ${id} ORDER BY created_at`;
      return { thread, messages };
    }
    const state = text(url, "state");
    return database`
      SELECT t.id, t.state, t.channel, t.follow_up_count, t.next_action_at, t.updated_at, c.id AS creator_id, c.display_name, c.market,
        last.subject, last.status AS last_status, last.direction AS last_direction, last.created_at AS last_at,
        (SELECT count(*)::int FROM outreach_messages m WHERE m.thread_id = t.id) AS messages
      FROM conversation_threads t JOIN creators c ON c.id = t.creator_id
      LEFT JOIN LATERAL (SELECT subject, status, direction, created_at FROM outreach_messages m WHERE m.thread_id = t.id ORDER BY created_at DESC LIMIT 1) last ON true
      WHERE true ${state ? database`AND t.state = ${state}` : database``}
      ORDER BY COALESCE(last.created_at, t.updated_at) DESC LIMIT ${limit(url)}`;
  },

  campaigns: async (database) => database`
    SELECT oc.*, oc.model_budget_usd::float AS model_budget_usd,
      (SELECT count(*)::int FROM creators c WHERE c.market = oc.market) AS creators,
      (SELECT count(*)::int FROM creators c WHERE c.market = oc.market AND c.status = 'eligible') AS eligible,
      (SELECT count(*)::int FROM conversation_threads t WHERE t.campaign_id = oc.id) AS threads,
      (SELECT count(*)::int FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id WHERE t.campaign_id = oc.id AND m.sent_at IS NOT NULL) AS sent,
      (SELECT COALESCE(sum(cost_usd), 0)::float FROM model_usage u WHERE u.campaign_id = oc.id AND u.created_at >= date_trunc('month', now())) AS spent_month
    FROM outreach_campaigns oc ORDER BY oc.created_at`,

  partners: async (database) => database`
    SELECT p.id, p.status, p.referral_code, p.referral_url, p.promo_code, p.created_at, c.id AS creator_id, c.display_name, c.market,
      m.visits, m.registrations, m.installations, m.payments, m.revenue::float, m.commission::float, m.measured_at,
      (SELECT count(*)::int FROM publications pub WHERE pub.partner_id = p.id) AS publications,
      (SELECT COALESCE(sum(amount), 0)::float FROM payout_requests pr WHERE pr.partner_id = p.id) AS payouts_requested
    FROM partners p JOIN creators c ON c.id = p.creator_id
    LEFT JOIN LATERAL (SELECT * FROM referral_metrics rm WHERE rm.partner_id = p.id ORDER BY measured_at DESC LIMIT 1) m ON true
    ORDER BY p.created_at DESC`,

  publications: async (database) => database`
    SELECT pub.id, pub.platform, pub.url, pub.status, pub.erid, pub.erid_required, pub.disclosure_required, pub.published_at, pub.last_checked_at,
      c.display_name, c.market, ch.reachable, ch.referral_present, ch.disclosure_present, ch.erid_present, ch.created_at AS checked_at
    FROM publications pub JOIN partners p ON p.id = pub.partner_id JOIN creators c ON c.id = p.creator_id
    LEFT JOIN LATERAL (SELECT * FROM publication_checks pc WHERE pc.publication_id = pub.id ORDER BY created_at DESC LIMIT 1) ch ON true
    ORDER BY pub.created_at DESC`,

  finance: async (database, config, url) => {
    const days = Math.min(Math.max(Number.parseInt(url.searchParams.get("days") ?? "30", 10) || 30, 1), 365);
    const [byDay, byModel, byAgent, byCampaign, payouts, revenue, spend] = await Promise.all([
      database`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, count(*)::int AS calls, sum(cost_usd)::float AS cost_usd
        FROM model_usage WHERE created_at >= now() - make_interval(days => ${days}) GROUP BY 1 ORDER BY 1`,
      database`SELECT model, count(*)::int AS calls, sum(input_tokens)::int AS input_tokens, sum(cached_input_tokens)::int AS cached_input_tokens,
        sum(output_tokens)::int AS output_tokens, sum(cost_usd)::float AS cost_usd FROM model_usage
        WHERE created_at >= now() - make_interval(days => ${days}) GROUP BY model ORDER BY cost_usd DESC`,
      database`SELECT agent_name, model, count(*)::int AS calls, sum(input_tokens)::int AS input_tokens, sum(cached_input_tokens)::int AS cached_input_tokens,
        sum(output_tokens)::int AS output_tokens, sum(cost_usd)::float AS cost_usd FROM model_usage
        WHERE created_at >= now() - make_interval(days => ${days}) GROUP BY agent_name, model ORDER BY cost_usd DESC`,
      database`SELECT oc.name, oc.market, oc.model_budget_usd::float AS budget, COALESCE(sum(u.cost_usd), 0)::float AS cost_usd
        FROM outreach_campaigns oc LEFT JOIN model_usage u ON u.campaign_id = oc.id AND u.created_at >= now() - make_interval(days => ${days})
        GROUP BY oc.id ORDER BY oc.created_at`,
      database`SELECT status, currency, count(*)::int AS count, COALESCE(sum(amount), 0)::float AS amount FROM payout_requests GROUP BY status, currency`,
      database`SELECT COALESCE(sum(revenue), 0)::float AS revenue, COALESCE(sum(commission), 0)::float AS commission
        FROM (SELECT DISTINCT ON (partner_id) * FROM referral_metrics ORDER BY partner_id, measured_at DESC) latest`,
      spending(database, config),
    ]);
    const policy = await readPolicy(config);
    return { days, byDay, byModel, byAgent, byCampaign, payouts, revenue: revenue[0] ?? {}, spending: spend, monthlyModelBudgetUsd: policy?.monthlyModelBudgetUsd ?? null };
  },

  compliance: async (database) => {
    const [failedPublications, checks, blocked, doNotContact, critical] = await Promise.all([
      database`SELECT pub.id, pub.url, pub.status, pub.erid, c.display_name, c.market, pub.last_checked_at FROM publications pub
        JOIN partners p ON p.id = pub.partner_id JOIN creators c ON c.id = p.creator_id WHERE pub.status IN ('failed', 'pending') ORDER BY pub.last_checked_at DESC NULLS FIRST`,
      database`SELECT id, object_type, object_id, rule, result, evidence, created_at FROM compliance_checks WHERE resolved_at IS NULL AND result <> 'passed' ORDER BY created_at DESC LIMIT 100`,
      database`SELECT id, actor, action, target_type, target_id, reason, created_at FROM agent_actions WHERE decision = 'blocked' ORDER BY created_at DESC LIMIT 100`,
      database`SELECT d.reason, d.source, d.created_at, c.display_name FROM do_not_contact d LEFT JOIN creators c ON c.id = d.creator_id ORDER BY d.created_at DESC LIMIT 100`,
      database`SELECT id, kind, title, details, created_at FROM notifications WHERE severity = 'critical' ORDER BY created_at DESC LIMIT 50`,
    ]);
    return { failedPublications, checks, blocked, doNotContact, critical };
  },

  audit: async (database, _config, url) => {
    const actor = text(url, "actor");
    const decision = text(url, "decision");
    const q = text(url, "q");
    const before = Number.parseInt(url.searchParams.get("before") ?? "", 10);
    return database`
      SELECT id::text, actor, action, target_type, target_id, decision, reason, details, created_at FROM agent_actions
      WHERE true
        ${actor ? database`AND actor = ${actor}` : database``}
        ${decision ? database`AND decision = ${decision}` : database``}
        ${q ? database`AND (action ILIKE ${"%" + q + "%"} OR target_id ILIKE ${"%" + q + "%"} OR reason ILIKE ${"%" + q + "%"})` : database``}
        ${Number.isFinite(before) ? database`AND id < ${before}` : database``}
      ORDER BY id DESC LIMIT ${limit(url)}`;
  },

  "settings/policies": async (_database, config) => ({ path: config.policyPath, policy: await readPolicy(config) }),

  "settings/integrations": async (_database, config) => ({
    models: { scoring: config.scoringModel, generation: config.generationModel, hardBudgetUsd: config.hardModelBudgetUsd },
    integrations: [
      { name: "OpenRouter", configured: Boolean(config.openRouterApiKey), purpose: "LLM для scoring, черновиков и ответов" },
      { name: "YouTube Data API", configured: Boolean(config.youtubeApiKey), purpose: "Discovery на YouTube" },
      { name: "Gmail (SMTP + IMAP)", configured: Boolean(config.gmailUser && config.gmailAppPassword), purpose: "Отправка писем и чтение ответов" },
      { name: "Имя отправителя", configured: Boolean(config.outreachSenderName), purpose: "Подпись и поле From" },
      { name: "Resend API", configured: Boolean(config.resendApiKey), purpose: "Резервная отправка писем" },
      { name: "Resend webhook secret", configured: Boolean(config.resendWebhookSecret), purpose: "Проверка подписи событий доставки" },
      { name: "Адрес отправителя", configured: Boolean(config.outreachEmailFrom), purpose: "From для outreach-писем" },
      { name: "VibeUI internal API", configured: Boolean(config.vibeuiInternalApiUrl && config.vibeuiInternalApiKey), purpose: "Партнёры, промокоды, статистика" },
    ],
  }),
};

async function creatorCard(database: Database, id: string) {
  const creator = (await database`SELECT * FROM creators WHERE id = ${id}`)[0];
  if (!creator) return null;
  const [profiles, posts, contacts, scores, threads, offers, partner, actions] = await Promise.all([
    database`SELECT platform, profile_url, handle, followers, median_views, engagement_rate, verified_at FROM creator_profiles WHERE creator_id = ${id}`,
    database`SELECT url, title, summary, published_at, views, likes, comments FROM creator_posts WHERE creator_id = ${id} ORDER BY published_at DESC NULLS LAST LIMIT 20`,
    database`SELECT kind, value, source_url, is_public_business, verified_at FROM creator_contacts WHERE creator_id = ${id}`,
    database`SELECT total, valid, model, details, evidence_urls, created_at FROM candidate_scores WHERE creator_id = ${id} ORDER BY created_at DESC LIMIT 10`,
    database`SELECT t.id, t.state, t.channel, oc.name AS campaign,
        COALESCE((SELECT json_agg(json_build_object('id', m.id, 'direction', m.direction, 'kind', m.kind, 'status', m.status, 'subject', m.subject, 'body', m.body, 'facts', m.facts, 'model', m.model, 'reviewed_at', m.reviewed_at, 'edited_at', m.edited_at, 'sent_at', m.sent_at, 'created_at', m.created_at) ORDER BY m.created_at)
          FROM outreach_messages m WHERE m.thread_id = t.id), '[]'::json) AS messages
      FROM conversation_threads t JOIN outreach_campaigns oc ON oc.id = t.campaign_id WHERE t.creator_id = ${id}`,
    database`SELECT status, terms, approved_by, approved_at, created_at FROM partner_offers WHERE creator_id = ${id}`,
    database`SELECT id, status, referral_code, referral_url, promo_code, created_at FROM partners WHERE creator_id = ${id}`,
    database`SELECT id::text, actor, action, decision, reason, created_at FROM agent_actions WHERE target_id = ${id} ORDER BY created_at DESC LIMIT 50`,
  ]);
  return { creator, profiles, posts, contacts, scores, threads, offers, partner: partner[0] ?? null, actions };
}

export async function spending(database: Database, config: Config) {
  const [rows, byAgent, openRouter] = await Promise.all([
    database<{ total: number; today: number; month: number }[]>`
      SELECT COALESCE(sum(cost_usd), 0)::float AS total,
        COALESCE(sum(cost_usd) FILTER (WHERE created_at >= date_trunc('day', now())), 0)::float AS today,
        COALESCE(sum(cost_usd) FILTER (WHERE created_at >= date_trunc('month', now())), 0)::float AS month
      FROM model_usage`,
    database`SELECT agent_name, model, count(*)::int AS calls, sum(input_tokens)::int AS input_tokens,
      sum(output_tokens)::int AS output_tokens, sum(cost_usd)::float AS cost_usd
      FROM model_usage GROUP BY agent_name, model ORDER BY cost_usd DESC`,
    openRouterBalance(config),
  ]);
  const spent = rows[0] ?? { total: 0, today: 0, month: 0 };
  return {
    ...spent,
    hardBudget: config.hardModelBudgetUsd,
    hardBudgetRemaining: Math.max(0, config.hardModelBudgetUsd - spent.total),
    byAgent,
    openRouter,
  };
}

interface OpenRouterBalance { usage: number | null; limit: number | null; remaining: number | null; error?: string }
let openRouterCache: { at: number; value: OpenRouterBalance } | null = null;

// Shows real provider-side spend, including calls made outside the worker that model_usage never sees.
async function openRouterBalance(config: Config): Promise<OpenRouterBalance | null> {
  if (!config.openRouterApiKey) return null;
  if (openRouterCache && Date.now() - openRouterCache.at < 60_000) return openRouterCache.value;
  let value: OpenRouterBalance;
  try {
    const response = await fetch(`${config.openRouterBaseUrl}/key`, {
      headers: { authorization: `Bearer ${config.openRouterApiKey}` }, signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const { data } = await response.json() as { data: { usage?: number; limit?: number | null; limit_remaining?: number | null } };
    value = { usage: data.usage ?? null, limit: data.limit ?? null, remaining: data.limit_remaining ?? null };
  } catch (error) {
    value = { usage: null, limit: null, remaining: null, error: error instanceof Error ? error.message : String(error) };
  }
  openRouterCache = { at: Date.now(), value };
  return value;
}

async function readPolicy(config: Config): Promise<Record<string, unknown> | null> {
  try { return JSON.parse(await readFile(config.policyPath, "utf8")) as Record<string, unknown>; } catch { return null; }
}

type PartnerFunnel = {
  invites?: number; claimed?: number; visits?: number; registrations?: number; payments?: number;
  commissionPercent?: number; revenue?: Array<{ currency: string; amount: number; commission: number }>; error?: string;
};
let funnelCache: { at: number; value: PartnerFunnel } | null = null;

// Both domains share one VibeUI database, so a single call returns the whole funnel of agent invites.
async function partnerFunnel(config: Config): Promise<PartnerFunnel> {
  if (funnelCache && Date.now() - funnelCache.at < 60_000) return funnelCache.value;
  let value: PartnerFunnel;
  try {
    if (!config.vibeuiInternalApiKey) throw new Error("VIBEUI_INTERNAL_API_KEY is not configured");
    const response = await fetch("https://vibeui.club/api/internal/invites", {
      headers: { authorization: `Bearer ${config.vibeuiInternalApiKey}`, accept: "application/json" }, signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    value = await response.json() as PartnerFunnel;
  } catch (error) {
    value = { error: error instanceof Error ? error.message : String(error) };
  }
  funnelCache = { at: Date.now(), value };
  return value;
}
