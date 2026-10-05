import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Config } from "../config.js";
import type { Database } from "../database.js";
import { enqueue } from "../queue.js";
import { writeAudit } from "../audit.js";
import { getReceivedEmail, verifyResendWebhook } from "./resend.js";

export async function handleResendWebhook(database: Database, config: Config, payload: string, headers: { id: string; timestamp: string; signature: string }): Promise<void> {
  const event = verifyResendWebhook(config.resendApiKey, config.resendWebhookSecret, payload, headers);
  const inserted = await database<{ id: string }[]>`
    INSERT INTO webhook_events (id, provider, event_type, payload)
    VALUES (${headers.id}, 'resend', ${event.type}, ${database.json(event as unknown as postgres.JSONValue)})
    ON CONFLICT (id) DO NOTHING RETURNING id
  `;
  if (!inserted[0]) return;
  if (event.type === "email.received") return receiveEmail(database, config, event.data.email_id);
  const emailId = "email_id" in event.data ? event.data.email_id : null;
  if (!emailId) return;
  if (event.type === "email.delivered") {
    await database`UPDATE outreach_messages SET status = 'delivered' WHERE external_message_id = ${emailId}`;
  } else if (event.type === "email.bounced" || event.type === "email.failed" || event.type === "email.suppressed") {
    await database`UPDATE outreach_messages SET status = ${event.type.slice(6)} WHERE external_message_id = ${emailId}`;
    await createNotification(database, "warning", event.type, `Проблема доставки ${emailId}`, { emailId });
  } else if (event.type === "email.complained") {
    await database.begin(async (transaction) => {
      const rows = await transaction<{ creator_id: string }[]>`
        SELECT t.creator_id FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id
        WHERE m.external_message_id = ${emailId}
      `;
      if (rows[0]) {
        await transaction`UPDATE creators SET do_not_contact = true, status = 'do_not_contact', updated_at = now() WHERE id = ${rows[0].creator_id}`;
        await transaction`INSERT INTO do_not_contact (id, creator_id, reason, source) VALUES (${randomUUID()}, ${rows[0].creator_id}, 'spam_complaint', 'resend_webhook') ON CONFLICT (creator_id, normalized_contact) DO NOTHING`;
      }
      await transaction`UPDATE agent_control SET emergency_stop = true, outreach_paused = true, safe_tasks_only = true, reason = 'Spam complaint', updated_at = now() WHERE singleton = true`;
    });
    await createNotification(database, "critical", "spam_complaint", "Рассылка остановлена из-за жалобы", { emailId });
  }
  await writeAudit(database, { actor: "resend_webhook", action: event.type, targetType: "email", targetId: emailId, decision: "completed" });
}

async function receiveEmail(database: Database, config: Config, emailId: string): Promise<void> {
  const email = await getReceivedEmail(config.resendApiKey, emailId);
  const sender = extractEmail(email.from);
  const contacts = await database<{ creator_id: string; thread_id: string }[]>`
    SELECT cc.creator_id, t.id AS thread_id FROM creator_contacts cc
    JOIN conversation_threads t ON t.creator_id = cc.creator_id
    WHERE lower(cc.normalized_value) = ${sender} OR lower(cc.value) = ${sender}
    ORDER BY t.updated_at DESC LIMIT 1
  `;
  const match = contacts[0];
  if (!match) { await createNotification(database, "warning", "unmatched_reply", `Не найден диалог для ${sender}`, { emailId, sender }); return; }
  const messageId = randomUUID();
  const body = email.text ?? stripHtml(email.html ?? "");
  const inserted = await database<{ id: string }[]>`
    INSERT INTO outreach_messages (id, thread_id, direction, kind, status, subject, body, external_message_id, received_at)
    VALUES (${messageId}, ${match.thread_id}, 'inbound', 'reply', 'received', ${email.subject}, ${body}, ${emailId}, now())
    ON CONFLICT (external_message_id) DO NOTHING RETURNING id
  `;
  if (!inserted[0]) return;
  await database`UPDATE conversation_threads SET state = 'replied', updated_at = now() WHERE id = ${match.thread_id}`;
  await enqueue(database, "classify_reply", { messageId }, `classify_reply:${messageId}`);
}

async function createNotification(database: Database, severity: string, kind: string, title: string, details: Record<string, unknown>): Promise<void> {
  await database`INSERT INTO notifications (id, severity, kind, title, details) VALUES (${randomUUID()}, ${severity}, ${kind}, ${title}, ${database.json(details as postgres.JSONValue)})`;
}
function extractEmail(value: string): string { return (value.match(/<([^>]+)>/)?.[1] ?? value).trim().toLowerCase(); }
function stripHtml(value: string): string { return value.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
