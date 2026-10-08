import type { Config } from "./config.js";
import type { Database } from "./database.js";

const icon: Record<string, string> = { critical: "🔴", warning: "🟠", info: "🔵" };

export function telegramConfigured(config: Config): boolean {
  return Boolean(config.telegramBotToken && config.telegramChatId);
}

export async function sendTelegram(config: Config, text: string): Promise<void> {
  const response = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: "POST", signal: AbortSignal.timeout(10_000),
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: config.telegramChatId, text, disable_web_page_preview: true }),
  });
  if (!response.ok) throw new Error(`Telegram ${response.status}: ${(await response.text()).slice(0, 200)}`);
}

// Older undelivered rows are skipped so that enabling the bot does not replay the whole history.
export async function deliverNotifications(database: Database, config: Config): Promise<void> {
  const rows = await database<{ id: string; severity: string; title: string; details: Record<string, unknown> }[]>`
    SELECT id, severity, title, details FROM notifications
    WHERE delivered_at IS NULL AND created_at > now() - interval '1 day' ORDER BY created_at LIMIT 10
  `;
  for (const row of rows) {
    const lines = Object.entries(row.details ?? {})
      .filter(([, value]) => value !== null && value !== undefined && typeof value !== "object")
      .map(([key, value]) => `${key}: ${String(value).slice(0, 300)}`);
    await sendTelegram(config, [`${icon[row.severity] ?? "⚪"} ${row.title}`, ...lines, "", "https://vibeui.club/agents/"].join("\n"));
    await database`UPDATE notifications SET delivered_at = now() WHERE id = ${row.id}`;
  }
}
