import nodemailer from "nodemailer";
import { ImapFlow, type FetchMessageObject } from "imapflow";
import type { Config } from "../config.js";
import type { Database } from "../database.js";
import { notify, recordInboundReply, stripHtml, stripQuotedReply } from "./inbound.js";

export interface GmailMessage { to: string; subject: string; text: string; messageId: string; inReplyTo?: string }

export function gmailConfigured(config: Config): boolean {
  return Boolean(config.gmailUser && config.gmailAppPassword);
}

// Deterministic Message-ID lets a retried send find the copy already in Sent instead of mailing twice.
export function outboundMessageId(internalId: string, gmailUser: string): string {
  return `<${internalId}.vibeui@${gmailUser.split("@")[1] ?? "gmail.com"}>`;
}

export async function sendGmail(config: Config, message: GmailMessage): Promise<string> {
  if (!gmailConfigured(config)) throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD are required");
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true,
    auth: { user: config.gmailUser, pass: config.gmailAppPassword },
  });
  const info = await transport.sendMail({
    from: config.outreachSenderName ? { name: config.outreachSenderName, address: config.gmailUser } : config.gmailUser,
    to: message.to, subject: message.subject, text: message.text, messageId: message.messageId,
    ...(message.inReplyTo ? { inReplyTo: message.inReplyTo, references: [message.inReplyTo] } : {}),
  });
  if (!info.accepted?.length) throw new Error(`Gmail rejected the recipient: ${JSON.stringify(info.rejected)}`);
  return message.messageId;
}

function imapClient(config: Config): ImapFlow {
  return new ImapFlow({
    host: "imap.gmail.com", port: 993, secure: true, logger: false,
    auth: { user: config.gmailUser, pass: config.gmailAppPassword },
  });
}

export async function alreadySent(config: Config, messageId: string): Promise<boolean> {
  const client = imapClient(config);
  await client.connect();
  try {
    // Gmail localizes folder names, so the Sent folder is found by its special-use flag.
    const sent = (await client.list()).find((mailbox) => mailbox.specialUse === "\\Sent");
    if (!sent) throw new Error("Gmail Sent mailbox not found");
    const lock = await client.getMailboxLock(sent.path);
    try {
      const found = await client.search({ header: { "message-id": messageId } });
      return Array.isArray(found) && found.length > 0;
    } finally { lock.release(); }
  } finally { await client.logout().catch(() => undefined); }
}

// Reads recent inbox mail without touching read flags; processed Message-IDs are remembered in webhook_events.
export async function pollGmailInbox(database: Database, config: Config): Promise<{ recorded: number; unmatched: number }> {
  if (!gmailConfigured(config)) return { recorded: 0, unmatched: 0 };
  const client = imapClient(config);
  await client.connect();
  let recorded = 0;
  let unmatched = 0;
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const uids = await client.search({ since: new Date(Date.now() - 7 * 86_400_000) }, { uid: true });
      for (const uid of Array.isArray(uids) ? uids.slice(-100) : []) {
        const message = await client.fetchOne(String(uid), { envelope: true, source: true, headers: ["in-reply-to", "references"] }, { uid: true });
        if (!message) continue;
        const parsed = parseMessage(message);
        if (parsed.sender.toLowerCase() === config.gmailUser.toLowerCase()) continue;
        const fresh = await database`
          INSERT INTO webhook_events (id, provider, event_type, payload) VALUES (${`gmail:${parsed.externalId}`}, 'gmail', 'inbound', '{}'::jsonb)
          ON CONFLICT (id) DO NOTHING RETURNING id
        `;
        if (fresh.length === 0) continue;
        if (/mailer-daemon|postmaster/i.test(parsed.sender)) {
          await notify(database, "critical", "email_bounced", "Письмо не доставлено (bounce)", { subject: parsed.subject });
          continue;
        }
        // Automated senders (Google security alerts, newsletters) never belong to a creator conversation.
        if (/(?:^|[.+-])no-?reply@|notifications?@|@accounts\.google\.com$/i.test(parsed.sender)) continue;
        const result = await recordInboundReply(database, parsed);
        if (result === "unmatched") unmatched++;
        if (result === "recorded") recorded++;
      }
    } finally { lock.release(); }
  } finally { await client.logout().catch(() => undefined); }
  return { recorded, unmatched };
}

export function parseMessage(message: Pick<FetchMessageObject, "envelope" | "source" | "headers">) {
  const headers = message.headers?.toString("utf8") ?? "";
  const references = [...headers.matchAll(/<[^>\s]+>/g)].map((match) => match[0]);
  const raw = message.source?.toString("utf8") ?? "";
  return {
    sender: message.envelope?.from?.[0]?.address ?? "",
    subject: message.envelope?.subject ?? null,
    externalId: message.envelope?.messageId ?? `gmail-noid:${message.envelope?.date?.toISOString() ?? ""}:${message.envelope?.from?.[0]?.address ?? ""}`,
    references,
    body: stripQuotedReply(plainTextBody(raw)),
  };
}

// Minimal MIME reader: prefers text/plain, decodes quoted-printable and base64, falls back to stripped HTML.
export function plainTextBody(raw: string): string {
  const parts = raw.split(/\r?\n--[^\r\n]+\r?\n/);
  const pick = (type: string) => parts.find((part) => new RegExp(`content-type:\\s*${type}`, "i").test(part));
  const part = pick("text/plain") ?? pick("text/html") ?? raw;
  const [head = "", ...rest] = part.split(/\r?\n\r?\n/);
  let body = rest.join("\n\n");
  if (/content-transfer-encoding:\s*base64/i.test(head)) body = Buffer.from(body.replace(/\s+/g, ""), "base64").toString("utf8");
  else if (/content-transfer-encoding:\s*quoted-printable/i.test(head)) {
    body = Buffer.from(body.replace(/=\r?\n/g, "").replace(/=([0-9A-F]{2})/gi, (_, hex: string) => String.fromCharCode(Number.parseInt(hex, 16))), "latin1").toString("utf8");
  }
  return /text\/html/i.test(head) ? stripHtml(body) : body.trim();
}
