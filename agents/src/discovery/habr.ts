import type { Database } from "../database.js";
import { writeAudit } from "../audit.js";
import { topicPattern } from "./telegram.js";
import { businessEmailFromDescription } from "./youtube.js";
import { delay, getJson, recentlyChecked, saveProfile, topicHits, type FoundPost } from "./save.js";

// Habr's public JSON behind habr.com (no key). A hub feed gives authors; each author's own articles decide relevance.
const API = "https://habr.com/kek/v2";
const REQUEST_DELAY_MS = 1_500;

interface HabrArticle {
  id: string; timePublished: string; isCorporative: boolean; titleHtml: string;
  author?: { alias: string; fullname?: string | null } | null;
  statistics?: { readingCount?: number; score?: number; commentsCount?: number };
}
interface HabrFeed { publicationRefs?: Record<string, HabrArticle> }
interface HabrCard { alias: string; fullname?: string | null; speciality?: string | null; followStats?: { followersCount?: number }; rating?: number; reach?: string | null }
interface HabrWhois { aboutHtml?: string | null; contacts?: unknown[] }

export interface HabrDiscoveryResult { authors: number; relevant: number; created: number; updated: number; skipped: number }

export async function discoverHabr(database: Database, hub: string, options: { maxAuthors: number }): Promise<HabrDiscoveryResult> {
  const result: HabrDiscoveryResult = { authors: 0, relevant: 0, created: 0, updated: 0, skipped: 0 };
  const feed = await getJson<HabrFeed>(`${API}/articles/?hub=${encodeURIComponent(hub)}&sort=all&fl=ru&hl=ru&page=1`);
  for (const alias of authorsFromFeed(feed).slice(0, options.maxAuthors)) {
    result.authors++;
    if (await recentlyChecked(database, "habr", alias)) { result.skipped++; continue; }
    await delay(REQUEST_DELAY_MS);
    const [card, whois, own] = await Promise.all([
      getJson<HabrCard>(`${API}/users/${encodeURIComponent(alias)}/card?fl=ru&hl=ru`),
      getJson<HabrWhois>(`${API}/users/${encodeURIComponent(alias)}/whois?fl=ru&hl=ru`),
      getJson<HabrFeed>(`${API}/articles/?user=${encodeURIComponent(alias)}&sort=all&fl=ru&hl=ru&page=1`),
    ]);
    const posts = articlesToPosts(own);
    if (topicHits([card.speciality ?? "", ...posts.map((post) => post.title)], topicPattern) < 2) continue;
    result.relevant++;
    const saved = await saveProfile(database, {
      platform: "habr", externalId: alias, profileUrl: `https://habr.com/ru/users/${alias}/`, handle: `@${alias}`,
      displayName: card.fullname || alias, market: "ru", followers: card.followStats?.followersCount ?? null,
      raw: { speciality: card.speciality, rating: card.rating, reach: card.reach, about: stripTags(whois.aboutHtml ?? "").slice(0, 2_000), contacts: whois.contacts ?? [] },
      posts, contact: contactFromWhois(whois),
    });
    result[saved.status]++;
  }
  await writeAudit(database, { actor: "discovery", action: "discover_habr", targetType: "query", targetId: hub, decision: "completed", details: { ...result } });
  return result;
}

// Company blogs are skipped: VibeUI partners with individual creators.
export function authorsFromFeed(feed: HabrFeed): string[] {
  const aliases = Object.values(feed.publicationRefs ?? {})
    .filter((article) => !article.isCorporative && article.author?.alias)
    .map((article) => article.author!.alias);
  return [...new Set(aliases)];
}

export function articlesToPosts(feed: HabrFeed): FoundPost[] {
  return Object.values(feed.publicationRefs ?? {})
    .sort((a, b) => b.timePublished.localeCompare(a.timePublished))
    .map((article) => {
      const title = stripTags(article.titleHtml);
      return {
        url: `https://habr.com/ru/articles/${article.id}/`, title, summary: title, publishedAt: article.timePublished,
        views: article.statistics?.readingCount ?? null, likes: article.statistics?.score ?? null, comments: article.statistics?.commentsCount ?? null,
      };
    });
}

export function contactFromWhois(whois: HabrWhois): { kind: "email"; value: string; isBusiness: boolean } | null {
  const email = businessEmailFromDescription(`${stripTags(whois.aboutHtml ?? "")}\n${JSON.stringify(whois.contacts ?? [])}`);
  return email ? { kind: "email", value: email.email, isBusiness: email.isBusiness } : null;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
