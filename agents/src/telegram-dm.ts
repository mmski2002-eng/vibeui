import { randomUUID } from "node:crypto";
import { Api, errors, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { enqueue } from "./queue.js";
import { notify } from "./email/inbound.js";

// Cold DMs come from a separate user account: a ban must not take channel search down with it.
export function telegramOutreachConfigured(config: Config): boolean {
  return Boolean(config.telegramApiId && config.telegramApiHash && config.telegramOutreachSession);
}

// The worker reports this instead of failing: the job waits without spending an attempt.
export class SendDeferred extends Error {
  constructor(readonly until: Date, readonly reason: string) {
    super(`Send deferred: ${reason}`);
  }
}

let client: TelegramClient | null = null;

async function connected(config: Config): Promise<TelegramClient> {
  if (client?.connected) return client;
  client = new TelegramClient(new StringSession(config.telegramOutreachSession), config.telegramApiId, config.telegramApiHash, { connectionRetries: 3 });
  client.setLogLevel("error" as never);
  await client.connect();
  return client;
}

export function nextFirstContactAt(lastSentAt: Date | null, gapHours: number, now = new Date()): Date | null {
  if (!lastSentAt) return null;
  const next = new Date(lastSentAt.getTime() + gapHours * 3_600_000);
  return next > now ? next : null;
}

export async function assertTelegramSlot(database: Database, config: Config, firstContact: boolean): Promise<void> {
  const state = (await database<{ outreach_paused_until: Date | null }[]>`SELECT outreach_paused_until FROM telegram_bot_state WHERE singleton = true`)[0];
  if (state?.outreach_paused_until && state.outreach_paused_until > new Date()) throw new SendDeferred(state.outreach_paused_until, "telegram_paused");
  if (!firstContact) return;
  const last = (await database<{ sent_at: Date | null }[]>`
    SELECT max(m.sent_at) AS sent_at FROM outreach_messages m JOIN conversation_threads t ON t.id = m.thread_id
    WHERE t.channel = 'telegram' AND m.direction = 'outbound' AND m.kind = 'first_contact'
  `)[0]?.sent_at ?? null;
  const next = nextFirstContactAt(last, config.telegramFirstContactGapHours);
  if (next) throw new SendDeferred(next, "telegram_first_contact_gap");
}

export async function sendTelegramDirect(database: Database, config: Config, input: { threadId: string; username: string; text: string; retrying: boolean }): Promise<string> {
  const telegram = await connected(config);
  try {
    const entity = await telegram.getEntity(input.username);
    if (!(entity instanceof Api.User) || entity.bot) throw new Error(`Send blocked: telegram_contact_not_a_person (${input.username})`);
    await database`UPDATE conversation_threads SET external_thread_id = ${entity.id.toString()} WHERE id = ${input.threadId}`;
    // MTProto has no idempotency key: after an unknown outcome the dialog itself shows whether the text went out.
    if (input.retrying) {
      const recent = await telegram.getMessages(entity, { limit: 10 });
      const same = recent.find((message) => message.out && message.message === input.text);
      if (same) return `tg:${entity.id.toString()}:${same.id}`;
    }
    const sent = await telegram.sendMessage(entity, { message: input.text, linkPreview: false });
    return `tg:${entity.id.toString()}:${sent.id}`;
  } catch (error) {
    const pause = floodPause(error);
    if (!pause) throw error;
    await database`UPDATE telegram_bot_state SET outreach_paused_until = ${pause} WHERE singleton = true`;
    await notify(database, "critical", "telegram_flood", "Telegram ограничил аккаунт рассылки", {
      until: pause.toISOString(), error: error instanceof Error ? error.message : String(error),
    }, `telegram_flood:${pause.toISOString().slice(0, 13)}`);
    throw new SendDeferred(pause, "telegram_flood");
  }
}

export function floodPause(error: unknown, now = new Date()): Date | null {
  if (error instanceof errors.FloodWaitError) return new Date(now.getTime() + (error.seconds + 60) * 1000);
  if (error instanceof errors.RPCError && error.errorMessage === "PEER_FLOOD") return new Date(now.getTime() + 24 * 3_600_000);
  return null;
}

// Replies are read even under emergency stop, like mail: reading has no external effect.
export async function pollTelegramDirect(database: Database, config: Config): Promise<void> {
  const threads = await database<{ id: string; external_thread_id: string }[]>`
    SELECT id, external_thread_id FROM conversation_threads WHERE channel = 'telegram' AND external_thread_id IS NOT NULL
  `;
  if (threads.length === 0) return;
  const byPeer = new Map(threads.map((thread) => [thread.external_thread_id, thread.id]));
  const telegram = await connected(config);
  const dialogs = await telegram.getDialogs({ limit: 100 });
  for (const dialog of dialogs) {
    const threadId = dialog.id ? byPeer.get(dialog.id.toString()) : undefined;
    if (!threadId || dialog.unreadCount === 0 || !dialog.entity) continue;
    const incoming = (await telegram.getMessages(dialog.entity, { limit: Math.min(dialog.unreadCount, 20) }))
      .filter((message) => !message.out && message.message).reverse();
    for (const message of incoming) {
      const messageId = randomUUID();
      const inserted = await database<{ id: string }[]>`
        INSERT INTO outreach_messages (id, thread_id, direction, kind, status, subject, body, external_message_id, received_at)
        VALUES (${messageId}, ${threadId}, 'inbound', 'reply', 'received', 'Telegram', ${message.message.slice(0, 20_000)},
          ${`tg:${dialog.id!.toString()}:${message.id}`}, now())
        ON CONFLICT (external_message_id) DO NOTHING RETURNING id
      `;
      if (!inserted[0]) continue;
      await database`UPDATE conversation_threads SET state = 'replied', updated_at = now() WHERE id = ${threadId}`;
      await enqueue(database, "classify_reply", { messageId }, `classify_reply:${messageId}`);
    }
    await telegram.markAsRead(dialog.entity);
  }
}
