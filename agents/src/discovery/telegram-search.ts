import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import type { Config } from "../config.js";

// Keyword search for public channels needs a Telegram user account (MTProto); the bot API and t.me pages have no search.
// The account only reads search results: found usernames are handed to the t.me/s/ crawler, which saves and scores them.
export function telegramSearchConfigured(config: Config): boolean {
  return Boolean(config.telegramApiId && config.telegramApiHash && config.telegramSession);
}

export async function searchTelegramChannels(config: Config, query: string, limit = 30): Promise<string[]> {
  const client = new TelegramClient(new StringSession(config.telegramSession), config.telegramApiId, config.telegramApiHash, { connectionRetries: 2 });
  client.setLogLevel("error" as never);
  await client.connect();
  try {
    const found = await client.invoke(new Api.contacts.Search({ q: query, limit }));
    return channelUsernames(found.chats);
  } finally {
    await client.destroy();
  }
}

export function channelUsernames(chats: unknown[]): string[] {
  return chats
    .filter((chat): chat is { className: string; broadcast?: boolean; username?: string | null } => typeof chat === "object" && chat !== null && "className" in chat)
    .filter((chat) => chat.className === "Channel" && chat.broadcast === true && typeof chat.username === "string")
    .map((chat) => chat.username!.toLowerCase());
}

// One-off login run by the owner in a terminal; prints the session string for TELEGRAM_SESSION.
export async function loginTelegram(apiId: number, apiHash: string, ask: (question: string) => Promise<string>): Promise<string> {
  const client = new TelegramClient(new StringSession(""), apiId, apiHash, { connectionRetries: 2 });
  await client.start({
    phoneNumber: () => ask("Телефон (+7...): "),
    phoneCode: () => ask("Код из Telegram: "),
    password: () => ask("Пароль 2FA (если есть): "),
    onError: (error) => console.error(error.message),
  });
  const session = String(client.session.save());
  await client.destroy();
  return session;
}
