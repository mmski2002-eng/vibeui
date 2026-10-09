import type postgres from "postgres";
import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { loadPolicy, type Policy } from "./policy.js";
import { enqueue } from "./queue.js";
import { discoverYouTube } from "./discovery/youtube.js";
import { discoverTelegram } from "./discovery/telegram.js";
import { discoverVk } from "./discovery/vk.js";
import { discoverHabr } from "./discovery/habr.js";
import { discoverRutube } from "./discovery/rutube.js";
import { discoverDevto } from "./discovery/devto.js";
import { searchTelegramChannels, telegramSearchConfigured } from "./discovery/telegram-search.js";
import { braveConfigured, braveTelegramChannels, isMoscowNight, yandexConfigured, yandexTelegramChannels } from "./discovery/web-search.js";
import { maintain } from "./maintenance.js";
import { prepareDrafts } from "./prepare-drafts.js";
import { billedUsage } from "./openrouter-usage.js";

export interface DiscoveryTask { source: string; query: string }
export interface SchedulerState { emergencyStop: boolean; modelsPaused: boolean; spentToday: number; dailyBudget: number; spentTotal: number; totalBudget: number; pendingScoring: number; stock: number; dailyContactLimit: number; drafts?: number }
export type Gate = { run: true } | { run: false; reason: "emergency_stop" | "models_paused" | "total_budget_spent" | "budget_spent" | "scoring_in_progress" | "enough_candidates" };

// Stock that covers this many days of sending stops new searches: found creators get scored and contacted first.
const STOCK_DAYS = 3;
// The same query is not repeated sooner than this: feeds and search results change slowly.
const REPEAT_AFTER_HOURS = 20;
const UNSCORED_BATCH = 20;

export function gate(state: SchedulerState): Gate {
  if (state.emergencyStop) return { run: false, reason: "emergency_stop" };
  if (state.modelsPaused) return { run: false, reason: "models_paused" };
  if (state.spentTotal >= state.totalBudget) return { run: false, reason: "total_budget_spent" };
  if (state.spentToday >= state.dailyBudget) return { run: false, reason: "budget_spent" };
  if (state.pendingScoring > 0) return { run: false, reason: "scoring_in_progress" };
  if (state.stock >= state.dailyContactLimit * STOCK_DAYS) return { run: false, reason: "enough_candidates" };
  return { run: true };
}

// Two days of sending stay drafted ahead, so the owner always has letters to approve without paying for a big backlog.
export function draftsNeeded(state: SchedulerState): number {
  if (state.emergencyStop || state.modelsPaused) return 0;
  if (state.spentToday >= state.dailyBudget || state.spentTotal >= state.totalBudget) return 0;
  return Math.max(0, state.dailyContactLimit * 2 - (state.drafts ?? 0));
}

export function discoveryTasks(policy: Policy, config: Pick<Config, "youtubeApiKey" | "vkServiceToken"> & { telegramSearch: boolean; yandex?: boolean; brave?: boolean; night?: boolean }): DiscoveryTask[] {
  const plan = policy.discovery;
  return [
    ...(config.youtubeApiKey ? [...plan.youtube.ru.map((query) => ({ source: "youtube:ru", query })), ...plan.youtube.en.map((query) => ({ source: "youtube:en", query }))] : []),
    ...plan.rutube.map((query) => ({ source: "rutube", query })),
    ...plan.habrHubs.map((query) => ({ source: "habr", query })),
    ...plan.devtoTags.map((query) => ({ source: "devto", query })),
    ...(config.telegramSearch ? plan.telegramQueries.map((query) => ({ source: "telegram-search", query })) : []),
    ...(config.yandex && config.night ? plan.telegramQueries.map((query) => ({ source: "yandex-tg", query })) : []),
    ...(config.brave ? plan.telegramQueries.map((query) => ({ source: "brave-tg", query })) : []),
    { source: "telegram", query: "links" },
    ...(config.vkServiceToken ? [{ source: "vk", query: "links" }] : []),
    { source: "maintenance", query: "contacts" },
  ];
}

// Platforms take turns: the one idle longest goes next, so a long query list on one platform cannot starve the rest.
// Inside it the oldest query runs; nothing repeats within REPEAT_AFTER_HOURS.
export function pickTask(tasks: DiscoveryTask[], lastRuns: Map<string, Date>, now: Date): DiscoveryTask | null {
  const last = (task: DiscoveryTask) => lastRuns.get(`${task.source}|${task.query}`)?.getTime() ?? 0;
  const sourceLast = new Map<string, number>();
  for (const task of tasks) sourceLast.set(task.source, Math.max(sourceLast.get(task.source) ?? 0, last(task)));
  const due = tasks
    .filter((task) => now.getTime() - last(task) >= REPEAT_AFTER_HOURS * 3_600_000)
    .sort((a, b) => (sourceLast.get(a.source)! - sourceLast.get(b.source)!) || (last(a) - last(b)));
  return due[0] ?? null;
}

// Keeps eligible/scored in line with the current threshold by each creator's latest score; contacted creators are untouched.
export async function resortCreators(database: Database): Promise<{ promoted: number; demoted: number }> {
  return database.begin(async (transaction) => {
    const [{ value }] = await transaction<{ value: number }[]>`SELECT minimum_score AS value FROM agent_control WHERE singleton = true`;
    const promoted = await transaction`
      UPDATE creators c SET status = 'eligible', updated_at = now()
      WHERE c.status = 'scored' AND c.do_not_contact = false
        AND (SELECT s.valid AND s.total >= ${value} FROM candidate_scores s WHERE s.creator_id = c.id ORDER BY s.created_at DESC LIMIT 1)
    `;
    const demoted = await transaction`
      UPDATE creators c SET status = 'scored', updated_at = now()
      WHERE c.status = 'eligible'
        AND NOT COALESCE((SELECT s.valid AND s.total >= ${value} FROM candidate_scores s WHERE s.creator_id = c.id ORDER BY s.created_at DESC LIMIT 1), false)
    `;
    return { promoted: promoted.count, demoted: demoted.count };
  });
}

export async function runScheduler(database: Database, config: Config): Promise<Record<string, unknown>> {
  const policy = await loadPolicy(config.policyPath);
  const resorted = await resortCreators(database);
  const queuedScoring = await queueUnscored(database);
  const state = await readState(database, policy);
  state.spentTotal = Math.max(state.spentTotal, (await billedUsage(config)) ?? 0);
  const draftsQueued = draftsNeeded(state) > 0 ? await prepareDrafts(database, draftsNeeded(state)) : 0;
  const decision = gate(state);
  let outcome: Record<string, unknown> = { ...state, resorted, queuedScoring, draftsQueued, decision: decision.run ? "run" : decision.reason };
  if (decision.run) {
    const lastRuns = new Map((await database<{ key: string; last: Date }[]>`
      SELECT source || '|' || query AS key, max(started_at) AS last FROM discovery_runs GROUP BY source, query
    `).map((row) => [row.key, row.last]));
    const task = pickTask(discoveryTasks(policy, {
      ...config, telegramSearch: telegramSearchConfigured(config), yandex: yandexConfigured(config), brave: braveConfigured(config), night: isMoscowNight(new Date()),
    }), lastRuns, new Date());
    outcome = { ...outcome, task: task ?? null, ...(task ? { result: await runTask(database, config, task) } : { decision: "nothing_due" }) };
  }
  await database`UPDATE agent_control SET scheduler_state = ${database.json({ ...outcome, at: new Date().toISOString() } as postgres.JSONValue)} WHERE singleton = true`;
  return outcome;
}

async function runTask(database: Database, config: Config, task: DiscoveryTask): Promise<unknown> {
  const [run] = await database<{ id: string }[]>`INSERT INTO discovery_runs (source, query) VALUES (${task.source}, ${task.query}) RETURNING id::text`;
  try {
    const result = await executeTask(database, config, task);
    await database`UPDATE discovery_runs SET finished_at = now(), result = ${database.json(result as postgres.JSONValue)} WHERE id = ${run!.id}`;
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await database`UPDATE discovery_runs SET finished_at = now(), error = ${message.slice(0, 1_000)} WHERE id = ${run!.id}`;
    return { error: message };
  }
}

async function executeTask(database: Database, config: Config, task: DiscoveryTask): Promise<unknown> {
  if (task.source === "youtube:ru" || task.source === "youtube:en") return discoverYouTube(database, config.youtubeApiKey, task.source === "youtube:ru" ? "ru" : "en", task.query, 25);
  if (task.source === "rutube") return discoverRutube(database, task.query, { maxChannels: 15 });
  if (task.source === "habr") return discoverHabr(database, task.query, { maxAuthors: 15 });
  if (task.source === "devto") return discoverDevto(database, task.query, { maxAuthors: 15 });
  if (task.source === "telegram-search") return discoverTelegram(database, await searchTelegramChannels(config, task.query), { maxChannels: 30, maxDepth: 1 });
  if (task.source === "yandex-tg") return discoverTelegram(database, await yandexTelegramChannels(config, task.query), { maxChannels: 30, maxDepth: 1 });
  if (task.source === "brave-tg") return discoverTelegram(database, await braveTelegramChannels(config, task.query), { maxChannels: 30, maxDepth: 1 });
  if (task.source === "telegram") return discoverTelegram(database, [], { maxChannels: 30, maxDepth: 2 });
  if (task.source === "vk") return discoverVk(database, config.vkServiceToken, [], { maxGroups: 30, maxDepth: 2 });
  if (task.source === "maintenance") return maintain(database, { websites: true, rescore: false });
  throw new Error(`Unknown discovery source ${task.source}`);
}

// Creators found earlier but never scored are scored before anything new is searched.
// A creator whose job already ran today (even failed) waits for tomorrow's key, so a broken record cannot loop.
async function queueUnscored(database: Database): Promise<number> {
  const day = new Date().toISOString().slice(0, 10);
  const rows = await database<{ id: string }[]>`
    SELECT c.id FROM creators c
    WHERE c.status = 'researched' AND c.do_not_contact = false
      AND NOT EXISTS (SELECT 1 FROM candidate_scores s WHERE s.creator_id = c.id)
      AND NOT EXISTS (SELECT 1 FROM agent_jobs j WHERE j.idempotency_key = 'score_creator:' || c.id || ':' || ${day})
      AND NOT EXISTS (SELECT 1 FROM agent_jobs j WHERE j.kind = 'score_creator' AND j.status IN ('queued', 'running') AND j.payload->>'creatorId' = c.id::text)
    ORDER BY c.created_at LIMIT ${UNSCORED_BATCH}
  `;
  for (const row of rows) await enqueue(database, "score_creator", { creatorId: row.id }, `score_creator:${row.id}:${day}`);
  return rows.length;
}

async function readState(database: Database, policy: Policy): Promise<SchedulerState> {
  const [row] = await database<{ emergency_stop: boolean; models_paused: boolean; spent: number; total: number; budget: number | null; total_budget: number; pending: number; stock: number; drafts: number }[]>`
    SELECT emergency_stop, model_operations_paused AS models_paused, search_budget_usd::float AS budget, total_budget_usd::float AS total_budget,
      COALESCE((SELECT sum(cost_usd) FROM model_usage), 0)::float AS total,
      COALESCE((SELECT sum(cost_usd) FROM model_usage WHERE created_at >= date_trunc('day', now())), 0)::float AS spent,
      (SELECT count(*) FROM agent_jobs WHERE kind IN ('score_creator', 'personalize_thread') AND status IN ('queued', 'running'))::int AS pending,
      ((SELECT count(*) FROM creators c WHERE c.status = 'eligible' AND c.do_not_contact = false
          AND EXISTS (SELECT 1 FROM creator_contacts cc WHERE cc.creator_id = c.id AND cc.is_public_business AND cc.verified_at IS NOT NULL)
          AND NOT EXISTS (SELECT 1 FROM conversation_threads t WHERE t.creator_id = c.id))
        + (SELECT count(*) FROM outreach_messages WHERE direction = 'outbound' AND kind = 'first_contact' AND status IN ('draft', 'approved')))::int AS stock,
      ((SELECT count(*) FROM outreach_messages WHERE direction = 'outbound' AND kind = 'first_contact' AND status IN ('draft', 'approved'))
        + (SELECT count(*) FROM agent_jobs WHERE kind = 'personalize_thread' AND status IN ('queued', 'running')))::int AS drafts
    FROM agent_control WHERE singleton = true
  `;
  return {
    emergencyStop: row?.emergency_stop ?? true, modelsPaused: row?.models_paused ?? true,
    spentToday: row?.spent ?? 0, dailyBudget: row?.budget ?? 0.5, spentTotal: row?.total ?? 0, totalBudget: row?.total_budget ?? 3, pendingScoring: row?.pending ?? 0,
    stock: row?.stock ?? 0, dailyContactLimit: policy.dailyContactLimit, drafts: row?.drafts ?? 0,
  };
}
