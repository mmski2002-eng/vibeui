import { timingSafeEqual } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { writeAudit } from "./audit.js";
import { adminHtml } from "./admin-ui.js";
import { handleResendWebhook } from "./email/webhook.js";

export function startAdminServer(database: Database, config: Config): void {
  if (!config.adminPassword || config.adminPassword.length < 16) {
    throw new Error("ADMIN_PASSWORD must contain at least 16 characters");
  }
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
      if (request.method === "POST" && url.pathname === "/webhooks/resend") {
        const payload = await readText(request);
        const id = request.headers["svix-id"];
        const timestamp = request.headers["svix-timestamp"];
        const signature = request.headers["svix-signature"];
        if (typeof id !== "string" || typeof timestamp !== "string" || typeof signature !== "string") return json(response, 400, { error: "missing_signature" });
        await handleResendWebhook(database, config, payload, { id, timestamp, signature });
        return json(response, 200, { ok: true });
      }
      if (!authenticate(request, config)) return unauthorized(response);
      if (request.method === "GET" && url.pathname === "/") return html(response, adminHtml);
      if (request.method === "GET" && url.pathname === "/api/dashboard") {
        return json(response, 200, await dashboard(database, config));
      }
      if (request.method === "POST" && url.pathname === "/api/control") {
        if (!sameOrigin(request)) return json(response, 403, { error: "origin_not_allowed" });
        return updateControl(database, request, response);
      }
      if (request.method === "POST" && url.pathname === "/api/action") {
        if (!sameOrigin(request)) return json(response, 403, { error: "origin_not_allowed" });
        return adminAction(database, request, response);
      }
      return json(response, 404, { error: "not_found" });
    } catch (error) {
      console.error(error);
      return json(response, 500, { error: "internal_error" });
    }
  });
  server.listen(config.adminPort, config.adminHost, () => {
    console.log(`Admin: http://${config.adminHost}:${config.adminPort}`);
  });
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

async function dashboard(database: Database, config: Config) {
  const [candidateRows, jobRows, controlRows, runs, actions, creators, messages, campaigns, notifications, jobs] = await Promise.all([
    database<{ count: number }[]>`SELECT count(*)::int AS count FROM creators`,
    database<{ status: string; count: number }[]>`SELECT status, count(*)::int AS count FROM agent_jobs GROUP BY status`,
    database`SELECT emergency_stop, outreach_paused, partnerships_paused, payouts_paused, safe_tasks_only, model_operations_paused, reason, updated_at FROM agent_control WHERE singleton = true`,
    database`SELECT agent_name, status, started_at FROM agent_runs ORDER BY started_at DESC LIMIT 20`,
    database`SELECT action, decision, created_at FROM agent_actions ORDER BY created_at DESC LIMIT 20`,
    database`SELECT c.id, c.display_name, c.market, c.status, c.do_not_contact, p.platform, p.followers,
      (SELECT total FROM candidate_scores s WHERE s.creator_id = c.id ORDER BY s.created_at DESC LIMIT 1) AS score
      FROM creators c LEFT JOIN creator_profiles p ON p.creator_id = c.id ORDER BY c.updated_at DESC LIMIT 50`,
    database`SELECT m.id, m.direction, m.kind, m.status, m.subject, m.created_at, c.display_name
      FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id JOIN creators c ON c.id = t.creator_id
      ORDER BY m.created_at DESC LIMIT 50`,
    database`SELECT id, name, market, status, daily_limit, minimum_score FROM outreach_campaigns ORDER BY created_at`,
    database`SELECT id, severity, kind, title, created_at FROM notifications ORDER BY created_at DESC LIMIT 30`,
    database`SELECT id, kind, status, attempts, max_attempts, last_error, created_at FROM agent_jobs ORDER BY created_at DESC LIMIT 50`,
  ]);
  const [spendRows, spendByAgent, openRouter] = await Promise.all([
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
  const spent = spendRows[0] ?? { total: 0, today: 0, month: 0 };
  const jobCounts = Object.fromEntries(jobRows.map((row) => [row.status, row.count]));
  return {
    spending: {
      ...spent,
      hardBudget: config.hardModelBudgetUsd,
      hardBudgetRemaining: Math.max(0, config.hardModelBudgetUsd - spent.total),
      byAgent: spendByAgent,
      openRouter,
    },
    counts: { candidates: candidateRows[0]?.count ?? 0, queued: jobCounts.queued ?? 0, failed: jobCounts.failed ?? 0 },
    control: controlRows[0] ?? { emergency_stop: false, outreach_paused: true },
    runs,
    actions,
    creators, messages, campaigns, notifications, jobs,
  };
}

async function adminAction(database: Database, request: IncomingMessage, response: ServerResponse) {
  const body = await readJson(request);
  const action = body.action;
  const id = body.id;
  if (typeof action !== "string" || typeof id !== "string") return json(response, 400, { error: "invalid_action" });
  if (action === "approve_message") {
    const rows = await database<{ id: string }[]>`
      UPDATE outreach_messages SET status = 'approved', approved_by = 'administrator', approved_at = now()
      WHERE id = ${id} AND status = 'draft' RETURNING id
    `;
    if (!rows[0]) return json(response, 409, { error: "message_not_draft" });
    const { enqueue } = await import("./queue.js");
    await enqueue(database, "send_message", { messageId: id }, `send_message:${id}`);
  } else if (action === "do_not_contact") {
    await database.begin(async (transaction) => {
      await transaction`UPDATE creators SET do_not_contact = true, status = 'do_not_contact', updated_at = now() WHERE id = ${id}`;
      await transaction`UPDATE agent_jobs SET status = 'cancelled', updated_at = now() WHERE status = 'queued' AND payload->>'creatorId' = ${id}`;
    });
  } else if (action === "cancel_job") {
    await database`UPDATE agent_jobs SET status = 'cancelled', updated_at = now() WHERE id = ${id} AND status = 'queued'`;
  } else if (action === "retry_job") {
    await database`UPDATE agent_jobs SET status = 'queued', available_at = now(), last_error = null, updated_at = now() WHERE id = ${id} AND status = 'failed' AND attempts < max_attempts`;
  } else {
    return json(response, 400, { error: "unknown_action" });
  }
  await writeAudit(database, { actor: "administrator", action, targetType: "admin_object", targetId: id, decision: "completed" });
  return json(response, 200, { ok: true });
}

async function updateControl(database: Database, request: IncomingMessage, response: ServerResponse) {
  const body = await readJson(request);
  const action = body.action;
  const changes: Record<string, { emergency: boolean; paused: boolean; reason: string }> = {
    pause: { emergency: false, paused: true, reason: "Paused by administrator" },
    resume: { emergency: false, paused: false, reason: "Enabled by administrator" },
    stop: { emergency: true, paused: true, reason: "Emergency stop by administrator" },
    "clear-stop": { emergency: false, paused: true, reason: "Emergency stop cleared; outreach remains paused" },
  };
  if (action === "pause-partnerships" || action === "resume-partnerships" || action === "pause-payouts" || action === "resume-payouts") {
    const column = action.includes("partnerships") ? "partnerships_paused" : "payouts_paused";
    const value = action.startsWith("pause");
    await database.unsafe(`UPDATE agent_control SET ${column} = $1, updated_at = now() WHERE singleton = true`, [value]);
    await writeAudit(database, { actor: "administrator", action: `control_${action}`, targetType: "system", decision: "completed" });
    return json(response, 200, { ok: true });
  }
  if (typeof action !== "string" || !changes[action]) return json(response, 400, { error: "invalid_action" });
  const change = changes[action];
  await database`
    UPDATE agent_control SET emergency_stop = ${change.emergency}, outreach_paused = ${change.paused},
      reason = ${change.reason}, updated_at = now() WHERE singleton = true
  `;
  await writeAudit(database, {
    actor: "administrator", action: `control_${action}`, targetType: "system",
    decision: "completed", reason: change.reason,
  });
  return json(response, 200, { ok: true });
}

function authenticate(request: IncomingMessage, config: Config): boolean {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Basic ")) return false;
  let decoded = "";
  try { decoded = Buffer.from(authorization.slice(6), "base64").toString("utf8"); } catch { return false; }
  return safeEqual(decoded, `${config.adminUsername}:${config.adminPassword}`);
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left); const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers.origin;
  if (!origin) return false;
  try { return new URL(origin).host === request.headers.host; } catch { return false; }
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  return JSON.parse(await readText(request)) as Record<string, unknown>;
}
async function readText(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 16_384) throw new Error("Request body too large");
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function unauthorized(response: ServerResponse): void {
  response.setHeader("WWW-Authenticate", 'Basic realm="VibeUI Agents"');
  json(response, 401, { error: "unauthorized" });
}
function json(response: ServerResponse, status: number, value: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" });
  response.end(JSON.stringify(value));
}
function html(response: ServerResponse, value: string): void {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; frame-ancestors 'none'", "x-frame-options": "DENY", "x-content-type-options": "nosniff" });
  response.end(value);
}
