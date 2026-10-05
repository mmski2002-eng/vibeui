import { Resend } from "resend";

export interface SendEmailInput { from: string; to: string; subject: string; text: string; idempotencyKey: string }
export async function sendResendEmail(apiKey: string, input: SendEmailInput): Promise<string> {
  if (!apiKey) throw new Error("RESEND_API_KEY is required");
  if (!input.from) throw new Error("OUTREACH_EMAIL_FROM is required");
  const result = await new Resend(apiKey).emails.send({ from: input.from, to: [input.to], subject: input.subject, text: input.text }, { idempotencyKey: input.idempotencyKey });
  if (result.error) throw new Error(`Resend: ${result.error.message}`);
  if (!result.data?.id) throw new Error("Resend returned no message id");
  return result.data.id;
}
export function verifyResendWebhook(apiKey: string, secret: string, payload: string, headers: { id: string; timestamp: string; signature: string }) {
  if (!secret) throw new Error("RESEND_WEBHOOK_SECRET is required");
  return new Resend(apiKey || "re_not_used_for_verification").webhooks.verify({ payload, headers, webhookSecret: secret });
}
export async function getReceivedEmail(apiKey: string, id: string) {
  if (!apiKey) throw new Error("RESEND_API_KEY is required");
  const result = await new Resend(apiKey).emails.receiving.get(id);
  if (result.error) throw new Error(`Resend inbound: ${result.error.message}`);
  if (!result.data) throw new Error("Resend returned no inbound email");
  return result.data;
}
