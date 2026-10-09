import type { Database } from "../database.js";
import { writeAudit } from "../audit.js";
import { topicPattern } from "./telegram.js";
import { businessEmailFromDescription } from "./youtube.js";
import { delay, getJson, recentlyChecked, saveProfile, topicHits, type FoundPost } from "./save.js";

// Rutube's public JSON API (no key): video search gives channels, a channel's own videos decide relevance.
const API = "https://rutube.ru/api";
const REQUEST_DELAY_MS = 1_500;

interface RutubeVideo { id: string; title: string; description?: string | null; hits?: number | null; created_ts?: string | null; video_url?: string; author?: { id: number; name: string } | null }
interface RutubePage { results?: RutubeVideo[] }
interface RutubeProfile { id: number; name: string; description?: string | null; is_official?: boolean; video_count?: number; hits?: number; subscribers_count?: number }

export interface RutubeDiscoveryResult { channels: number; relevant: number; created: number; updated: number; skipped: number }

export async function discoverRutube(database: Database, query: string, options: { maxChannels: number }): Promise<RutubeDiscoveryResult> {
  const result: RutubeDiscoveryResult = { channels: 0, relevant: 0, created: 0, updated: 0, skipped: 0 };
  const search = await getJson<RutubePage>(`${API}/search/video/?query=${encodeURIComponent(query)}`);
  for (const authorId of authorsFromSearch(search).slice(0, options.maxChannels)) {
    result.channels++;
    if (await recentlyChecked(database, "rutube", String(authorId))) { result.skipped++; continue; }
    await delay(REQUEST_DELAY_MS);
    const [profile, videos] = await Promise.all([
      getJson<RutubeProfile>(`${API}/profile/user/${authorId}/`),
      getJson<RutubePage>(`${API}/video/person/${authorId}/?page=1`),
    ]);
    if (profile.is_official) continue;
    const posts = videosToPosts(videos);
    if (topicHits([profile.description ?? "", ...posts.map((post) => post.title)], topicPattern) < 3) continue;
    result.relevant++;
    const email = businessEmailFromDescription(profile.description ?? "");
    const saved = await saveProfile(database, {
      platform: "rutube", externalId: String(authorId), profileUrl: `https://rutube.ru/channel/${authorId}/`, handle: null,
      displayName: profile.name, market: "ru", followers: profile.subscribers_count ?? null,
      raw: { description: (profile.description ?? "").slice(0, 2_000), videoCount: profile.video_count, hits: profile.hits },
      posts, contact: email ? { kind: "email", value: email.email, isBusiness: email.isBusiness } : null,
    });
    result[saved.status]++;
  }
  await writeAudit(database, { actor: "discovery", action: "discover_rutube", targetType: "query", targetId: query, decision: "completed", details: { ...result } });
  return result;
}

export function authorsFromSearch(page: RutubePage): number[] {
  return [...new Set((page.results ?? []).map((video) => video.author?.id).filter((id): id is number => typeof id === "number"))];
}

export function videosToPosts(page: RutubePage): FoundPost[] {
  return (page.results ?? []).map((video) => ({
    url: video.video_url ?? `https://rutube.ru/video/${video.id}/`, title: video.title, summary: (video.description ?? "").slice(0, 1_000),
    publishedAt: video.created_ts ?? null, views: video.hits ?? null,
  }));
}
