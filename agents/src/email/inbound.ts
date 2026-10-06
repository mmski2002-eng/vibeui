import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Database } from "../database.js";
import { enqueue } from "../queue.js";

export interface InboundEmail { sender: string; subject: string | null; body: string; externalId: string; references: string[] }

// Matches a reply to its thread by our Message-ID first (exact), then by the sender's known contact address.
export async function recordInboundReply(database: Database, email: InboundEmail): Promise<"recorded" | "duplicate" | "unmatched"> {
  const sender = extractEmail(email.sender);
  const byReference = email.references.length > 0 ? await database<{ thread_id: string }[]>`
    SELECT thread_id FROM outreach_messages WHERE direction = 'outbound' AND external_message_id = ANY(${email.references}) LIMIT 1
  ` : [];
  const bySender = byReference[0] ? [] : await database<{ thread_id: string }[]>`
    SELECT t.id AS thread_id FROM creator_contacts cc JOIN conversation_threads t ON t.contact_id = cc.id
    WHERE cc.normalized_value = ${sender} ORDER BY t.updated_at DESC LIMIT 1
  `;
  const threadId = byReference[0]?.thread_id ?? bySender[0]?.thread_id;
  if (!threadId) {
    await notify(database, "warning", "unmatched_reply", `Не найден диалог для ${sender}`, { sender, subject: email.subject });
    return "unmatched";
  }
  const messageId = randomUUID();
  const inserted = await database<{ id: string }[]>`
    INSERT INTO outreach_messages (id, thread_id, direction, kind, status, subject, body, external_message_id, received_at)
    VALUES (${messageId}, ${threadId}, 'inbound', 'reply', 'received', ${email.subject}, ${email.body.slice(0, 20_000)}, ${email.externalId}, now())
    ON CONFLICT (external_message_id) DO NOTHING RETURNING id
  `;
  if (!inserted[0]) return "duplicate";
  await database`UPDATE conversation_threads SET state = 'replied', updated_at = now() WHERE id = ${threadId}`;
  await enqueue(database, "classify_reply", { messageId }, `classify_reply:${messageId}`);
  return "recorded";
}

export async function notify(database: Database, severity: string, kind: string, title: string, details: Record<string, unknown>): Promise<void> {
  await database`INSERT INTO notifications (id, severity, kind, title, details) VALUES (${randomUUID()}, ${severity}, ${kind}, ${title}, ${database.json(details as postgres.JSONValue)})`;
}

export function extractEmail(value: string): string { return (value.match(/<([^>]+)>/)?.[1] ?? value).trim().toLowerCase(); }
export function stripHtml(value: string): string { return value.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }

// Drops the quoted original so the classifier sees only what the creator wrote.
export function stripQuotedReply(text: string): string {
  const lines = text.split(/\r?\n/);
  const cut = lines.findIndex((line) => /^\s*>/.test(line) || /^On .+ wrote:\s*$/.test(line) || /^.{0,80}\d{4}.{0,40}(?:написал|пишет)[^:]*:\s*$/.test(line) || /^-{2,}\s*Original Message/i.test(line));
  return (cut === -1 ? lines : lines.slice(0, cut)).join("\n").trim();
}
