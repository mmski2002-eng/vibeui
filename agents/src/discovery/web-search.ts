import type { Config } from "../config.js";
import { normalizeUsername } from "./telegram.js";

// Keyword search for Telegram channels through web search engines: "<query> site:t.me" returns channel and post pages,
// their usernames go to the t.me/s/ crawler, which saves and scores them. No Telegram account is needed.
// Request format follows Yandex Search API v2 (the same one SearXNG uses) and Brave Search API v1.

export function yandexConfigured(config: Pick<Config, "yandexSearchApiKey" | "yandexFolderId">): boolean {
  return Boolean(config.yandexSearchApiKey && config.yandexFolderId);
}

export function braveConfigured(config: Pick<Config, "braveSearchApiKey">): boolean {
  return Boolean(config.braveSearchApiKey);
}

export async function yandexTelegramChannels(config: Pick<Config, "yandexSearchApiKey" | "yandexFolderId">, query: string): Promise<string[]> {
  const response = await fetch("https://searchapi.api.cloud.yandex.net/v2/web/search", {
    method: "POST", signal: AbortSignal.timeout(30_000),
    headers: { authorization: `Api-Key ${config.yandexSearchApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      query: { searchType: "SEARCH_TYPE_RU", queryText: `${query} site:t.me`, familyMode: "FAMILY_MODE_MODERATE", page: "0" },
      groupSpec: { groupMode: "GROUP_MODE_FLAT", groupsOnPage: "50", docsInGroup: "1" },
      l10n: "LOCALIZATION_RU", folderId: config.yandexFolderId, responseFormat: "FORMAT_XML",
    }),
  });
  if (!response.ok) throw new Error(`Yandex Search API ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const { rawData } = await response.json() as { rawData?: string };
  if (!rawData) throw new Error("Yandex Search API returned no rawData");
  return telegramChannelsFromUrls(urlsFromYandexXml(Buffer.from(rawData, "base64").toString("utf8")));
}

export async function braveTelegramChannels(config: Pick<Config, "braveSearchApiKey">, query: string): Promise<string[]> {
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", `${query} site:t.me`);
  url.searchParams.set("count", "20");
  const response = await fetch(url, {
    signal: AbortSignal.timeout(30_000),
    headers: { accept: "application/json", "x-subscription-token": config.braveSearchApiKey },
  });
  if (!response.ok) throw new Error(`Brave Search API ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const body = await response.json() as { web?: { results?: { url?: string }[] } };
  return telegramChannelsFromUrls((body.web?.results ?? []).map((result) => result.url ?? ""));
}

// Code 15 is Yandex's "nothing found", not a failure.
export function urlsFromYandexXml(xml: string): string[] {
  const error = /<error[^>]*code="(\d+)"[^>]*>([^<]*)<\/error>/.exec(xml);
  if (error && error[1] !== "15") throw new Error(`Yandex Search API error ${error[1]}: ${error[2]}`);
  return [...xml.matchAll(/<url>([^<]+)<\/url>/g)].map((match) => match[1]!.replace(/&amp;/g, "&"));
}

export function telegramChannelsFromUrls(urls: string[]): string[] {
  const names = urls.map((url) => {
    const match = /^https?:\/\/(?:www\.)?t(?:elegram)?\.me\/(?:s\/)?([A-Za-z][A-Za-z0-9_]{3,31})(?:[/?#]|$)/.exec(url.trim());
    return match ? normalizeUsername(match[1]!) : null;
  });
  return [...new Set(names.filter((name): name is string => Boolean(name)))];
}

// Yandex gives part of the night traffic for free (00:00–08:00 Moscow), so its searches wait for those hours.
export function isMoscowNight(now: Date): boolean {
  const hour = (now.getUTCHours() + 3) % 24;
  return hour < 8;
}
