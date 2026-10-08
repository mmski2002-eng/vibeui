import { timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { writeAudit } from "./audit.js";
import { handleAdminApi } from "./admin-api.js";
import { handleResendWebhook } from "./email/webhook.js";

const adminDirectory = new URL("../admin/", import.meta.url);
const staticFiles: Record<string, string> = {
  "/": "index.html",
  "/assets/app.css": "app.css",
  "/assets/app.js": "app.js",
  "/assets/views.js": "views.js",
};
const contentTypes: Record<string, string> = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
};

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
      const staticFile = staticFiles[url.pathname];
      if (request.method === "GET" && staticFile) return serveStatic(response, staticFile);
      if (request.method === "POST" && url.pathname === "/api/control") {
        if (!sameOrigin(request)) return json(response, 403, { error: "origin_not_allowed" });
        return updateControl(database, request, response);
      }
      if (request.method === "POST" && url.pathname === "/api/contact") {
        if (!sameOrigin(request)) return json(response, 403, { error: "origin_not_allowed" });
        return addContact(database, request, response);
      }
      if (request.method === "POST" && url.pathname === "/api/message") {
        if (!sameOrigin(request)) return json(response, 403, { error: "origin_not_allowed" });
        return editMessage(database, request, response);
      }
      if (request.method === "POST" && url.pathname === "/api/action") {
        if (!sameOrigin(request)) return json(response, 403, { error: "origin_not_allowed" });
        return adminAction(database, request, response);
      }
      if (request.method === "GET") {
        const result = await handleAdminApi(database, config, url);
        if (result) return json(response, result.status, result.body);
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

async function serveStatic(response: ServerResponse, file: string): Promise<void> {
  const body = await readFile(new URL(file, adminDirectory));
  response.writeHead(200, {
    "content-type": contentTypes[file.split(".").pop() ?? ""] ?? "application/octet-stream",
    "cache-control": "no-store",
    "content-security-policy": "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    "x-frame-options": "DENY",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
  });
  response.end(body);
}

async function adminAction(database: Database, request: IncomingMessage, response: ServerResponse) {
  const body = await readJson(request);
  const action = body.action;
  const id = body.id;
  const reason = typeof body.reason === "string" && body.reason.trim() ? body.reason.trim().slice(0, 500) : null;
  if (typeof action !== "string" || typeof id !== "string") return json(response, 400, { error: "invalid_action" });
  let targetType = "job";
  if (action === "approve_message") {
    targetType = "message";
    const rows = await database<{ id: string }[]>`
      UPDATE outreach_messages SET status = 'approved', approved_by = 'administrator', approved_at = now()
      WHERE id = ${id} AND status = 'draft' RETURNING id
    `;
    if (!rows[0]) return json(response, 409, { error: "message_not_draft" });
    const { enqueue } = await import("./queue.js");
    await enqueue(database, "send_message", { messageId: id }, `send_message:${id}`);
  } else if (action === "mark_sent_manually") {
    targetType = "message";
    const sent = await database.begin(async (transaction) => {
      const rows = await transaction<{ thread_id: string }[]>`
        UPDATE outreach_messages SET status = 'sent', sent_at = now(), external_message_id = ${`manual:${id}`},
          approved_by = COALESCE(approved_by, 'administrator'), approved_at = COALESCE(approved_at, now())
        WHERE id = ${id} AND direction = 'outbound' AND status IN ('draft', 'approved') RETURNING thread_id
      `;
      const threadId = rows[0]?.thread_id;
      if (!threadId) return false;
      // A queued automatic send for the same message would deliver it a second time.
      await transaction`UPDATE agent_jobs SET status = 'cancelled', last_error = 'sent manually', updated_at = now() WHERE status = 'queued' AND kind = 'send_message' AND payload->>'messageId' = ${id}`;
      await transaction`UPDATE conversation_threads SET state = 'sent', updated_at = now() WHERE id = ${threadId}`;
      await transaction`UPDATE creators SET status = 'sent', updated_at = now() WHERE id = (SELECT creator_id FROM conversation_threads WHERE id = ${threadId})`;
      return true;
    });
    if (!sent) return json(response, 409, { error: "message_not_sendable" });
  } else if (action === "review_message") {
    targetType = "message";
    const rows = await database`UPDATE outreach_messages SET reviewed_at = now() WHERE id = ${id} AND status = 'draft' RETURNING id`;
    if (!rows[0]) return json(response, 409, { error: "message_not_draft" });
  } else if (action === "do_not_contact") {
    targetType = "creator";
    const { randomUUID } = await import("node:crypto");
    await database.begin(async (transaction) => {
      const rows = await transaction`UPDATE creators SET do_not_contact = true, status = 'do_not_contact', blocked_reason = ${reason}, updated_at = now() WHERE id = ${id} RETURNING id`;
      if (!rows[0]) return;
      await transaction`
        INSERT INTO do_not_contact (id, creator_id, reason, source) VALUES (${randomUUID()}, ${id}, ${reason ?? "administrator"}, 'administrator')
        ON CONFLICT DO NOTHING
      `;
      // Every queued job tied to this creator, directly or through a thread or message, is cancelled at once.
      await transaction`
        UPDATE agent_jobs SET status = 'cancelled', last_error = 'do_not_contact', updated_at = now()
        WHERE status = 'queued' AND (
          payload->>'creatorId' = ${id}
          OR payload->>'threadId' IN (SELECT id::text FROM conversation_threads WHERE creator_id = ${id})
          OR payload->>'messageId' IN (SELECT m.id::text FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id WHERE t.creator_id = ${id})
        )
      `;
      await transaction`UPDATE conversation_threads SET state = 'do_not_contact', updated_at = now() WHERE creator_id = ${id}`;
    });
  } else if (action === "cancel_job") {
    const rows = await database`UPDATE agent_jobs SET status = 'cancelled', updated_at = now() WHERE id = ${id} AND status = 'queued' RETURNING id`;
    if (!rows[0]) return json(response, 409, { error: "job_not_queued" });
  } else if (action === "retry_job") {
    // A failed job has exhausted its attempts, so one extra attempt is granted. External effects stay guarded by
    // idempotency keys and status checks (a sent message or created partner is refused on re-run).
    const rows = await database`
      UPDATE agent_jobs SET status = 'queued', available_at = now(), max_attempts = attempts + 1, updated_at = now()
      WHERE id = ${id} AND status = 'failed' RETURNING id
    `;
    if (!rows[0]) return json(response, 409, { error: "job_not_failed" });
  } else {
    return json(response, 400, { error: "unknown_action" });
  }
  await writeAudit(database, { actor: "administrator", action, targetType, targetId: id, decision: "completed", reason: reason ?? undefined });
  return json(response, 200, { ok: true });
}

// A contact typed in by the administrator is trusted as a public business contact; a draft is then
// prepared at once if the creator already qualifies.
async function addContact(database: Database, request: IncomingMessage, response: ServerResponse) {
  const body = await readJson(request);
  const creatorId = body.creatorId;
  const kind = body.kind;
  const raw = typeof body.value === "string" ? body.value.trim() : "";
  const sourceUrl = typeof body.sourceUrl === "string" && /^https?:\/\//.test(body.sourceUrl.trim()) ? body.sourceUrl.trim() : "manual:administrator";
  if (typeof creatorId !== "string" || (kind !== "email" && kind !== "telegram")) return json(response, 400, { error: "invalid_contact" });
  const value = kind === "telegram" ? `@${raw.replace(/^(https?:\/\/)?(t\.me\/)?@?/i, "")}` : raw;
  const valid = kind === "email" ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) : /^@[A-Za-z0-9_]{4,32}$/.test(value);
  if (!valid) return json(response, 400, { error: "invalid_contact" });
  const { randomUUID } = await import("node:crypto");
  const rows = await database`
    INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at)
    SELECT ${randomUUID()}, id, ${kind}, ${value}, ${value.toLowerCase()}, ${sourceUrl}, true, now() FROM creators WHERE id = ${creatorId}
    ON CONFLICT (kind, normalized_value) DO NOTHING RETURNING id
  `;
  if (!rows[0]) return json(response, 409, { error: "contact_exists_or_creator_missing" });
  await writeAudit(database, { actor: "administrator", action: "add_contact", targetType: "creator", targetId: creatorId, decision: "completed", details: { kind } });
  const { prepareDrafts } = await import("./prepare-drafts.js");
  return json(response, 200, { ok: true, draftsQueued: await prepareDrafts(database) });
}

// Only a draft can be edited; an edit resets the review mark so the new text is checked again before approval.
async function editMessage(database: Database, request: IncomingMessage, response: ServerResponse) {
  const body = await readJson(request);
  const id = body.id;
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const text = typeof body.body === "string" ? body.body.replace(/\r\n/g, "\n").trim() : "";
  if (typeof id !== "string" || !subject || subject.length > 160 || text.length < 20 || text.length > 5000) {
    return json(response, 400, { error: "invalid_message" });
  }
  const rows = await database`
    UPDATE outreach_messages SET subject = ${subject}, body = ${text}, edited_at = now(), reviewed_at = NULL
    WHERE id = ${id} AND direction = 'outbound' AND status = 'draft' RETURNING id
  `;
  if (!rows[0]) return json(response, 409, { error: "message_not_draft" });
  await writeAudit(database, { actor: "administrator", action: "edit_message", targetType: "message", targetId: id, decision: "completed" });
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
  const toggles: Record<string, string> = { partnerships: "partnerships_paused", payouts: "payouts_paused", models: "model_operations_paused" };
  const toggle = typeof action === "string" ? /^(pause|resume)-(partnerships|payouts|models)$/.exec(action) : null;
  if (toggle) {
    const column = toggles[toggle[2] ?? ""] ?? "";
    const value = toggle[1] === "pause";
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
