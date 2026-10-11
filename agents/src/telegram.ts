import type { Config } from "./config.js";
import type { Database } from "./database.js";
import { enqueue } from "./queue.js";
import { splitText, translate } from "./translate.js";

const icon: Record<string, string> = { critical: "🔴", warning: "🟠", info: "🔵" };

export function telegramConfigured(config: Config): boolean {
  return Boolean(config.telegramBotToken && config.telegramChatId);
}

async function callTelegram<T>(config: Config, method: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/${method}`, {
    method: "POST", signal: AbortSignal.timeout(15_000),
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Telegram ${method} ${response.status}: ${(await response.text()).slice(0, 200)}`);
  return ((await response.json()) as { result: T }).result;
}

// Telegram caps a message at 4096 characters, so a long letter goes out in parts; returns every part's id.
export async function sendTelegram(config: Config, text: string, buttons?: Array<{ text: string; callback_data: string }>): Promise<number[]> {
  const chunks = splitText(text, 4000);
  const ids: number[] = [];
  for (const [index, chunk] of chunks.entries()) {
    const markup = buttons && index === chunks.length - 1 ? { reply_markup: { inline_keyboard: [buttons] } } : {};
    const sent = await callTelegram<{ message_id: number }>(config, "sendMessage", { chat_id: config.telegramChatId, text: chunk, disable_web_page_preview: true, ...markup });
    ids.push(sent.message_id);
  }
  return ids;
}

export async function linkTelegramMessages(database: Database, ids: number[], inboundMessageId: string, draftId: string | null = null): Promise<void> {
  for (const id of ids) {
    await database`
      INSERT INTO telegram_links (telegram_message_id, inbound_message_id, draft_id) VALUES (${id}, ${inboundMessageId}, ${draftId})
      ON CONFLICT (telegram_message_id) DO NOTHING
    `;
  }
}

export function letterText(title: string, subject: string | null, body: string, translation: string | null): string {
  return [title, subject ? `Тема: ${subject}` : null, "", "— Оригинал —", body,
    ...(translation === null ? [] : ["", "— Перевод —", translation]),
    "", "Ответьте на это сообщение, что написать блогеру, и я подготовлю ответ."]
    .filter((line) => line !== null).join("\n");
}

async function russianTranslation(body: string): Promise<string | null> {
  try {
    const result = await translate(body, "ru");
    return result.source === "ru" ? null : result.text;
  } catch (error) {
    console.error("Translate failed:", error instanceof Error ? error.message : error);
    return "(перевод недоступен)";
  }
}

// Older undelivered rows are skipped so that enabling the bot does not replay the whole history.
export async function deliverNotifications(database: Database, config: Config): Promise<void> {
  const rows = await database<{ id: string; severity: string; kind: string; title: string; details: Record<string, unknown> }[]>`
    SELECT id, severity, kind, title, details FROM notifications
    WHERE delivered_at IS NULL AND created_at > now() - interval '1 day' ORDER BY created_at LIMIT 10
  `;
  for (const row of rows) {
    const title = `${icon[row.severity] ?? "⚪"} ${row.title}`;
    const messageId = typeof row.details?.messageId === "string" ? row.details.messageId : null;
    const letter = row.kind === "reply_received" && messageId
      ? (await database<{ subject: string | null; body: string }[]>`SELECT subject, body FROM outreach_messages WHERE id = ${messageId}`)[0]
      : undefined;
    let text: string;
    if (letter) {
      text = letterText(title, letter.subject, letter.body, await russianTranslation(letter.body));
    } else {
      const lines = Object.entries(row.details ?? {})
        .filter(([key, value]) => key !== "messageId" && value !== null && value !== undefined && typeof value !== "object")
        .map(([key, value]) => `${key}: ${String(value).slice(0, 300)}`);
      text = [title, ...lines, "", "https://vibeui.club/agents/"].join("\n");
    }
    const ids = await sendTelegram(config, text);
    if (messageId) await linkTelegramMessages(database, ids, messageId);
    await database`UPDATE notifications SET delivered_at = now() WHERE id = ${row.id}`;
  }
}

// The site's RU server cannot reach Telegram, so it queues messages in its own database and we relay them.
export async function deliverSiteNotifications(site: Database, config: Config): Promise<void> {
  const rows = await site<{ id: string; title: string; body: string }[]>`
    SELECT id, title, body FROM admin_notification
    WHERE delivered_at IS NULL AND created_at > now() - interval '1 day' ORDER BY created_at LIMIT 10
  `;
  for (const row of rows) {
    await sendTelegram(config, `${row.title}
${row.body}`);
    await site`UPDATE admin_notification SET delivered_at = now() WHERE id = ${row.id}`;
  }
}

interface TelegramUpdate {
  update_id: number;
  message?: { message_id: number; chat: { id: number }; text?: string; reply_to_message?: { message_id: number } };
  callback_query?: { id: string; data?: string; message?: { chat: { id: number } } };
}

// Only the owner's chat is trusted: a reply there becomes an instruction, the button sends the prepared draft.
export async function pollTelegramUpdates(database: Database, config: Config): Promise<void> {
  const offset = (await database<{ update_offset: string }[]>`SELECT update_offset FROM telegram_bot_state WHERE singleton = true`)[0]?.update_offset ?? "0";
  const updates = await callTelegram<TelegramUpdate[]>(config, "getUpdates", { offset: Number(offset), timeout: 0, allowed_updates: ["message", "callback_query"] });
  for (const update of updates) {
    // The offset moves first: one broken update must not block every later one.
    await database`UPDATE telegram_bot_state SET update_offset = ${update.update_id + 1} WHERE singleton = true`;
    await handleUpdate(database, config, update).catch((error: unknown) => console.error("Telegram update failed:", error instanceof Error ? error.message : error));
  }
}

async function handleUpdate(database: Database, config: Config, update: TelegramUpdate): Promise<void> {
  const message = update.message;
  if (message && String(message.chat.id) === config.telegramChatId && message.reply_to_message && message.text) {
    const link = (await database<{ inbound_message_id: string; draft_id: string | null }[]>`
      SELECT inbound_message_id, draft_id FROM telegram_links WHERE telegram_message_id = ${message.reply_to_message.message_id}
    `)[0];
    if (link) {
      await enqueue(database, "telegram_draft", { inboundId: link.inbound_message_id, previousDraftId: link.draft_id, instruction: message.text }, `telegram_draft:${update.update_id}`);
      await sendTelegram(config, link.draft_id ? "Принял правки, переделываю ответ…" : "Принял, готовлю ответ…");
    } else {
      await sendTelegram(config, "Не понял, к какому письму это относится. Ответьте на сообщение с письмом блогера или на черновик.");
    }
  }
  const callback = update.callback_query;
  if (callback && String(callback.message?.chat.id) === config.telegramChatId && callback.data?.startsWith("send:")) {
    const draftId = callback.data.slice(5);
    const draft = (await database<{ sent_message_id: string | null }[]>`SELECT sent_message_id FROM telegram_drafts WHERE id = ${draftId}`)[0];
    if (draft && !draft.sent_message_id) await enqueue(database, "telegram_send", { draftId }, `telegram_send:${draftId}`);
    const text = !draft ? "Черновик не найден" : draft.sent_message_id ? "Уже отправлено, повторно не шлю" : "Перевожу и отправляю";
    await callTelegram(config, "answerCallbackQuery", { callback_query_id: callback.id, text })
      .catch((error: unknown) => console.error("Telegram answerCallbackQuery failed:", error instanceof Error ? error.message : error));
  }
}
