import { randomUUID } from "node:crypto";
import type { Database } from "../database.js";
import type { Market } from "../types.js";
import { queueScoring } from "./save.js";
import { writeAudit } from "../audit.js";
import { businessEmailFromDescription, median } from "./youtube.js";

// Uses only Telegram's public web preview (t.me/s/<channel>): no account, no API key, read-only.
const REQUEST_DELAY_MS = 3_000;
const REFRESH_AFTER_DAYS = 7;
const reservedNames = new Set(["joinchat", "addstickers", "addemoji", "share", "proxy", "socks", "iv", "s", "c", "addlist", "boost", "setlanguage", "contact"]);
export const topicPattern = /вайб.?код|vibe.?cod|cursor|claude|chatgpt|gpt|openai|нейросет|(?<![а-яё])ии(?![а-яё])|\bai\b|no.?code|low.?code|react|next\.?js|tailwind|shadcn|frontend|фронтенд|вёрстк|верстк|веб.?разработ|программир|разработчик|стартап|saas|\bmvp\b|indie|лендинг|landing/gi;
export const adMarkers = /реклам|сотруднич|по вопросам|для связи|коммерч|business|ads|partnership|collab/i;

export interface TelegramPost { url: string; text: string; views: number | null; publishedAt: string | null }
export interface TelegramChannel {
  username: string; title: string; description: string; subscribers: number | null;
  posts: TelegramPost[]; linkedChannels: string[];
}
export interface TelegramDiscoveryResult { visited: number; relevant: number; created: number; attached: number; updated: number; jobsQueued: number; skipped: number }
interface Seed { name: string; ownerCreatorId: string | null }

export async function discoverTelegram(database: Database, seeds: string[], options: { maxChannels: number; maxDepth: number }): Promise<TelegramDiscoveryResult> {
  const result: TelegramDiscoveryResult = { visited: 0, relevant: 0, created: 0, attached: 0, updated: 0, jobsQueued: 0, skipped: 0 };
  const queue: Array<Seed & { depth: number }> = [];
  const seen = new Set<string>();
  const push = (seed: Seed, depth: number) => {
    const normalized = normalizeUsername(seed.name);
    if (normalized && !seen.has(normalized)) { seen.add(normalized); queue.push({ name: normalized, ownerCreatorId: seed.ownerCreatorId, depth }); }
  };
  for (const seed of seeds) push({ name: seed, ownerCreatorId: null }, 0);
  for (const seed of await seedsFromDatabase(database)) push(seed, 0);

  while (queue.length > 0 && result.visited < options.maxChannels) {
    const next = queue.shift();
    if (!next) break;
    if (await recentlyChecked(database, next.name)) { result.skipped++; continue; }
    await delay(REQUEST_DELAY_MS);
    const channel = await fetchChannel(next.name).catch(() => null);
    result.visited++;
    if (!channel) continue;
    if (!isRelevant(channel)) continue;
    result.relevant++;
    const saved = await saveChannel(database, channel, next.ownerCreatorId);
    result[saved.status]++;
    if (await queueScoring(database, saved.id)) result.jobsQueued++;
    if (next.depth < options.maxDepth) for (const linked of channel.linkedChannels) push({ name: linked, ownerCreatorId: null }, next.depth + 1);
  }
  await writeAudit(database, { actor: "discovery", action: "discover_telegram", targetType: "query", targetId: seeds.join(",").slice(0, 200) || "database-seeds",
    decision: "completed", details: { ...result } });
  return result;
}

export function normalizeUsername(value: string): string | null {
  const match = /^(?:https?:\/\/)?(?:t(?:elegram)?\.me\/(?:s\/)?|@)?([A-Za-z][A-Za-z0-9_]{3,31})\/?(?:\d+)?$/.exec(value.trim());
  const name = match?.[1]?.toLowerCase();
  if (!name || reservedNames.has(name) || name.endsWith("bot")) return null;
  return name;
}

export function isRelevant(channel: TelegramChannel): boolean {
  const text = [channel.title, channel.description, ...channel.posts.map((post) => post.text)].join("\n");
  return (text.match(topicPattern) ?? []).length >= 4 && channel.posts.length > 0;
}

export function detectMarket(channel: TelegramChannel): Market {
  const text = [channel.title, channel.description, ...channel.posts.slice(0, 10).map((post) => post.text)].join(" ");
  const cyrillic = (text.match(/[а-яё]/gi) ?? []).length;
  const latin = (text.match(/[a-z]/gi) ?? []).length;
  return cyrillic >= latin * 0.5 ? "ru" : "en";
}

export function parseCount(value: string): number | null {
  const match = /([\d.,\s]+)\s*([KMkм]?)/.exec(value.replace(/ /g, " "));
  if (!match?.[1]) return null;
  const number = Number.parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
  if (!Number.isFinite(number)) return null;
  const unit = match[2]?.toUpperCase();
  return Math.round(number * (unit === "M" || unit === "М" ? 1_000_000 : unit === "K" ? 1_000 : 1));
}

export function parseChannelPage(username: string, html: string): TelegramChannel | null {
  if (!html.includes("tgme_channel_info")) return null;
  const title = decode(/<meta property="og:title" content="([^"]*)"/.exec(html)?.[1] ?? username);
  const description = stripTags(/<div class="tgme_channel_info_description">([\s\S]*?)<\/div>/.exec(html)?.[1] ?? "");
  const subscribersRaw = /<span class="counter_value">([^<]+)<\/span>\s*<span class="counter_type">(?:subscribers|подписчик)/.exec(html)?.[1];
  const posts: TelegramPost[] = [];
  const linked = new Set<string>();
  for (const block of html.split('class="tgme_widget_message_wrap').slice(1)) {
    const postPath = /data-post="([^"]+)"/.exec(block)?.[1];
    if (!postPath) continue;
    const textHtml = /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(block)?.[1] ?? "";
    posts.push({
      url: `https://t.me/${postPath}`,
      text: stripTags(textHtml).slice(0, 1_000),
      views: parseCount(/<span class="tgme_widget_message_views">([^<]+)<\/span>/.exec(block)?.[1] ?? ""),
      publishedAt: /<time datetime="([^"]+)"/.exec(block)?.[1] ?? null,
    });
    const forwarded = /tgme_widget_message_forwarded_from_name" href="https:\/\/t\.me\/([A-Za-z0-9_]+)/.exec(block)?.[1];
    if (forwarded) linked.add(forwarded);
    for (const link of textHtml.matchAll(/href="https:\/\/t\.me\/([A-Za-z][A-Za-z0-9_]{3,31})(?:\/\d+)?"/g)) if (link[1]) linked.add(link[1]);
    for (const mention of stripTags(textHtml).matchAll(/(?:^|\s)@([A-Za-z][A-Za-z0-9_]{3,31})/g)) if (mention[1]) linked.add(mention[1]);
  }
  for (const mention of description.matchAll(/@([A-Za-z][A-Za-z0-9_]{3,31})/g)) if (mention[1]) linked.add(mention[1]);
  linked.delete(username);
  return {
    username, title, description, subscribers: subscribersRaw ? parseCount(subscribersRaw) : null,
    posts: posts.reverse(), linkedChannels: [...linked].map((name) => name.toLowerCase()).filter((name) => name !== username),
  };
}

export function businessContactFromDescription(description: string): { kind: "email" | "telegram"; value: string; isBusiness: boolean } | null {
  const email = businessEmailFromDescription(description);
  if (email) return { kind: "email", value: email.email, isBusiness: email.isBusiness };
  const lines = description.split(/\n|(?<=[.!])\s/);
  for (const line of lines) {
    const handle = /@([A-Za-z][A-Za-z0-9_]{3,31})/.exec(line)?.[1];
    if (handle && adMarkers.test(line)) return { kind: "telegram", value: `@${handle}`, isBusiness: true };
  }
  return null;
}

async function fetchChannel(username: string): Promise<TelegramChannel | null> {
  const response = await fetch(`https://t.me/s/${username}`, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; VibeUIResearch/1.0)", accept: "text/html" },
    redirect: "manual", signal: AbortSignal.timeout(20_000),
  });
  if (response.status !== 200) return null;
  return parseChannelPage(username, await response.text());
}

async function saveChannel(database: Database, channel: TelegramChannel, ownerCreatorId: string | null): Promise<{ status: "created" | "attached" | "updated"; id: string }> {
  const profileUrl = `https://t.me/${channel.username}`;
  const existing = await database<{ creator_id: string; profile_id: string }[]>`
    SELECT creator_id, id AS profile_id FROM creator_profiles WHERE platform = 'telegram' AND external_id = ${channel.username}
  `;
  const owner = !existing[0] && ownerCreatorId ? (await database<{ id: string }[]>`SELECT id FROM creators WHERE id = ${ownerCreatorId}`)[0] : undefined;
  const creatorId = existing[0]?.creator_id ?? owner?.id ?? randomUUID();
  const profileId = existing[0]?.profile_id ?? randomUUID();
  const views = channel.posts.map((post) => post.views).filter((value): value is number => value !== null);
  const medianViews = views.length ? Math.round(median(views) ?? 0) : null;
  const raw = database.json({ title: channel.title, description: channel.description.slice(0, 2_000) });
  const market = detectMarket(channel);
  await database.begin(async (transaction) => {
    if (existing[0]) {
      await transaction`UPDATE creator_profiles SET followers = ${channel.subscribers}, median_views = ${medianViews},
        raw_public_data = ${raw}, verified_at = now(), updated_at = now() WHERE id = ${profileId}`;
    } else {
      if (!owner) {
        await transaction`INSERT INTO creators (id, display_name, market, language, status)
          VALUES (${creatorId}, ${channel.title}, ${market}, ${market}, 'researched')`;
      }
      await transaction`INSERT INTO creator_profiles (id, creator_id, platform, external_id, profile_url, handle, followers, median_views, raw_public_data, verified_at)
        VALUES (${profileId}, ${creatorId}, 'telegram', ${channel.username}, ${profileUrl}, ${`@${channel.username}`}, ${channel.subscribers}, ${medianViews}, ${raw}, now())`;
    }
    for (const post of channel.posts.slice(0, 20)) {
      await transaction`
        INSERT INTO creator_posts (id, creator_id, profile_id, url, title, summary, published_at, views)
        VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${post.url}, ${post.text.slice(0, 120) || "(без текста)"}, ${post.text}, ${post.publishedAt}, ${post.views})
        ON CONFLICT (profile_id, url) DO UPDATE SET views = EXCLUDED.views, source_checked_at = now()
      `;
    }
    const contact = businessContactFromDescription(channel.description);
    if (contact) {
      await transaction`
        INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at)
        VALUES (${randomUUID()}, ${creatorId}, ${contact.kind}, ${contact.value}, ${contact.value.toLowerCase()}, ${profileUrl}, ${contact.isBusiness}, now())
        ON CONFLICT (kind, normalized_value) DO NOTHING
      `;
    }
  });
  return { status: existing[0] ? "updated" : owner ? "attached" : "created", id: creatorId };
}

async function recentlyChecked(database: Database, username: string): Promise<boolean> {
  const rows = await database`
    SELECT 1 FROM creator_profiles WHERE platform = 'telegram' AND external_id = ${username}
      AND verified_at > now() - make_interval(days => ${REFRESH_AFTER_DAYS})
  `;
  return rows.length > 0;
}

// A Telegram link in a creator's own profile description is that creator's channel; links in posts are only seeds.
async function seedsFromDatabase(database: Database): Promise<Seed[]> {
  const rows = await database<{ name: string; owner: string | null }[]>`
    SELECT DISTINCT lower(m[1]) AS name, owner FROM (
      SELECT regexp_matches(COALESCE(raw_public_data::text, ''), 't\\.me/([A-Za-z][A-Za-z0-9_]{3,31})', 'g') AS m, creator_id::text AS owner
        FROM creator_profiles WHERE platform <> 'telegram'
      UNION ALL
      SELECT regexp_matches(COALESCE(summary, ''), 't\\.me/([A-Za-z][A-Za-z0-9_]{3,31})', 'g'), NULL FROM creator_posts
    ) links
  `;
  return rows.map((row) => ({ name: row.name, ownerCreatorId: row.owner }))
    .sort((a, b) => Number(b.ownerCreatorId !== null) - Number(a.ownerCreatorId !== null));
}

function stripTags(html: string): string {
  return decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();
}
function decode(text: string): string {
  return text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code))).replace(/&amp;/g, "&");
}
function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
