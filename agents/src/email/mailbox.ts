import { randomUUID } from "node:crypto";
import { Resend } from "resend";

export type MailBox = "inbox" | "sent";

function client(apiKey: string): Resend {
  if (!apiKey) throw new Error("RESEND_API_KEY is required");
  return new Resend(apiKey);
}

export async function listMail(apiKey: string, box: MailBox) {
  const resend = client(apiKey);
  const result = box === "inbox" ? await resend.emails.receiving.list({ limit: 100 }) : await resend.emails.list({ limit: 100 });
  if (result.error) throw new Error(`Resend: ${result.error.message}`);
  return result.data.data.map((email) => ({
    id: email.id, from: email.from, to: email.to, subject: email.subject, created_at: email.created_at,
    status: "last_event" in email ? email.last_event : null,
  }));
}

export async function getMail(apiKey: string, box: MailBox, id: string) {
  const resend = client(apiKey);
  const result = box === "inbox" ? await resend.emails.receiving.get(id) : await resend.emails.get(id);
  if (result.error) throw new Error(`Resend: ${result.error.message}`);
  const email = result.data;
  return {
    id: email.id, from: email.from, to: email.to, subject: email.subject, created_at: email.created_at,
    text: email.text, html: email.html, reply_to: email.reply_to,
    attachments: "attachments" in email ? email.attachments.map((file) => file.filename) : [],
  };
}

export async function sendMail(apiKey: string, from: string, input: { to: string; subject: string; text: string }): Promise<string> {
  const result = await client(apiKey).emails.send({ from, to: [input.to], subject: input.subject, text: input.text }, { idempotencyKey: randomUUID() });
  if (result.error) throw new Error(`Resend: ${result.error.message}`);
  return result.data?.id ?? "";
}
