import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Config } from "../config.js";
import type { Database } from "../database.js";
import { writeAudit } from "../audit.js";
import { getReceivedEmail, verifyResendWebhook } from "./resend.js";
import { recordInboundReply, stripHtml, stripQuotedReply } from "./inbound.js";

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
        await transaction`INSERT INTO do_not_contact (id, creator_id, reason, source) VALUES (${randomUUID()}, ${rows[0].creator_id}, 'spam_complaint', 'resend_webhook') ON CONFLICT DO NOTHING`;
      }
      await transaction`UPDATE agent_control SET emergency_stop = true, outreach_paused = true, safe_tasks_only = true, reason = 'Spam complaint', updated_at = now() WHERE singleton = true`;
    });
    await createNotification(database, "critical", "spam_complaint", "Рассылка остановлена из-за жалобы", { emailId });
  }
  await writeAudit(database, { actor: "resend_webhook", action: event.type, targetType: "email", targetId: emailId, decision: "completed" });
}

async function receiveEmail(database: Database, config: Config, emailId: string): Promise<void> {
  const email = await getReceivedEmail(config.resendApiKey, emailId);
  await recordInboundReply(database, {
    sender: email.from, subject: email.subject ?? null, externalId: emailId, references: [],
    body: stripQuotedReply(email.text ?? stripHtml(email.html ?? "")),
  });
}

async function createNotification(database: Database, severity: string, kind: string, title: string, details: Record<string, unknown>): Promise<void> {
  await database`INSERT INTO notifications (id, severity, kind, title, details) VALUES (${randomUUID()}, ${severity}, ${kind}, ${title}, ${database.json(details as postgres.JSONValue)})`;
}
