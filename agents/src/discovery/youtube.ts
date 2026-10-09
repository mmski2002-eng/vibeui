import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Database } from "../database.js";
import type { Market } from "../types.js";
import { queueScoring } from "./save.js";
import { writeAudit } from "../audit.js";

interface SearchResponse {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: { channelId?: string; channelTitle?: string; title?: string; description?: string; publishedAt?: string };
  }>;
}
interface VideosResponse {
  items?: Array<{
    id?: string;
    snippet?: { title?: string; description?: string; publishedAt?: string };
    statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
  }>;
}
interface PlaylistItemsResponse { items?: Array<{ contentDetails?: { videoId?: string } }> }
interface ChannelsResponse {
  items?: Array<{
    id?: string;
    snippet?: { title?: string; description?: string; customUrl?: string; country?: string };
    contentDetails?: { relatedPlaylists?: { uploads?: string } };
    statistics?: { subscriberCount?: string; videoCount?: string; viewCount?: string; hiddenSubscriberCount?: boolean };
  }>;
}

export interface DiscoveryResult { videosFound: number; creatorsCreated: number; creatorsUpdated: number; jobsQueued: number }

export async function discoverYouTube(
  database: Database,
  apiKey: string,
  market: Market,
  query: string,
  maxResults: number,
): Promise<DiscoveryResult> {
  if (!apiKey) throw new Error("YOUTUBE_API_KEY is required for YouTube discovery");
  const limit = Math.min(Math.max(maxResults, 1), 50);
  const publishedAfter = new Date(Date.now() - 90 * 86_400_000).toISOString();
  const search = await getJson<SearchResponse>("https://www.googleapis.com/youtube/v3/search", {
    key: apiKey, part: "snippet", type: "video", q: query, order: "relevance",
    maxResults: String(limit), publishedAfter, relevanceLanguage: market === "ru" ? "ru" : "en",
  });
  const videos = (search.items ?? []).filter((item) => item.id?.videoId && item.snippet?.channelId);
  const channelIds = [...new Set(videos.map((item) => item.snippet?.channelId).filter((id): id is string => Boolean(id)))];
  if (channelIds.length === 0) return { videosFound: 0, creatorsCreated: 0, creatorsUpdated: 0, jobsQueued: 0 };
  const channels = await getJson<ChannelsResponse>("https://www.googleapis.com/youtube/v3/channels", {
    key: apiKey, part: "snippet,statistics,contentDetails", id: channelIds.join(","), maxResults: "50",
  });
  const videoStats = await getJson<VideosResponse>("https://www.googleapis.com/youtube/v3/videos", {
    key: apiKey, part: "statistics", id: videos.map((item) => item.id?.videoId).join(","), maxResults: "50",
  });
  const statsById = new Map((videoStats.items ?? []).flatMap((item) => item.id ? [[item.id, item.statistics ?? {}] as const] : []));
  const byId = new Map((channels.items ?? []).flatMap((channel) => channel.id ? [[channel.id, channel] as const] : []));
  let creatorsCreated = 0; let creatorsUpdated = 0; let jobsQueued = 0;

  for (const channelId of channelIds) {
    const channel = byId.get(channelId);
    if (!channel) continue;
    const profileUrl = `https://www.youtube.com/channel/${channelId}`;
    const existing = await database<{ creator_id: string; profile_id: string }[]>`
      SELECT creator_id, id AS profile_id FROM creator_profiles
      WHERE platform = 'youtube' AND external_id = ${channelId}
    `;
    const creatorId = existing[0]?.creator_id ?? randomUUID();
    const profileId = existing[0]?.profile_id ?? randomUUID();
    const subscribers = integerOrNull(channel.statistics?.subscriberCount);
    const raw = channel as unknown as postgres.JSONValue;
    if (existing[0]) {
      creatorsUpdated++;
      await database`
        UPDATE creator_profiles SET followers = ${subscribers}, raw_public_data = ${database.json(raw)},
          verified_at = now(), updated_at = now() WHERE id = ${profileId}
      `;
    } else {
      creatorsCreated++;
      await database.begin(async (transaction) => {
        await transaction`
          INSERT INTO creators (id, display_name, market, language, country, status)
          VALUES (${creatorId}, ${channel.snippet?.title ?? channelId}, ${channelMarket(channel, videos.filter((item) => item.snippet?.channelId === channelId).map((item) => item.snippet?.title ?? ""), market)}, ${channelMarket(channel, videos.filter((item) => item.snippet?.channelId === channelId).map((item) => item.snippet?.title ?? ""), market)},
            ${channel.snippet?.country ?? null}, 'researched')
        `;
        await transaction`
          INSERT INTO creator_profiles (id, creator_id, platform, external_id, profile_url, handle,
            followers, raw_public_data, verified_at)
          VALUES (${profileId}, ${creatorId}, 'youtube', ${channelId}, ${profileUrl},
            ${channel.snippet?.customUrl ?? null}, ${subscribers}, ${transaction.json(raw)}, now())
        `;
      });
    }
    const contact = businessEmailFromDescription(channel.snippet?.description);
    if (contact) {
      await database`
        INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at)
        VALUES (${randomUUID()}, ${creatorId}, 'email', ${contact.email}, ${contact.email.toLowerCase()}, ${profileUrl}, ${contact.isBusiness}, now())
        ON CONFLICT (kind, normalized_value) DO NOTHING
      `;
    }
    for (const video of videos.filter((item) => item.snippet?.channelId === channelId)) {
      const videoId = video.id?.videoId;
      if (!videoId) continue;
      const stats = statsById.get(videoId);
      await database`
        INSERT INTO creator_posts (id, creator_id, profile_id, external_id, url, title, summary,
          published_at, views, likes, comments, raw_public_data)
        VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${videoId},
          ${`https://www.youtube.com/watch?v=${videoId}`}, ${video.snippet?.title ?? videoId},
          ${video.snippet?.description ?? null}, ${video.snippet?.publishedAt ?? null},
          ${integerOrNull(stats?.viewCount)}, ${integerOrNull(stats?.likeCount)}, ${integerOrNull(stats?.commentCount)},
          ${database.json(video as unknown as postgres.JSONValue)})
        ON CONFLICT (profile_id, url) DO UPDATE SET title = EXCLUDED.title,
          summary = EXCLUDED.summary, views = EXCLUDED.views, likes = EXCLUDED.likes, comments = EXCLUDED.comments,
          source_checked_at = now(), raw_public_data = EXCLUDED.raw_public_data
      `;
    }
    const uploads = channel.contentDetails?.relatedPlaylists?.uploads;
    if (uploads) await enrichRecentUploads(database, apiKey, creatorId, profileId, uploads);
    if (await queueScoring(database, creatorId)) jobsQueued++;
  }
  await writeAudit(database, { actor: "discovery", action: "discover", targetType: "query",
    targetId: query, decision: "completed", details: { market, query, creatorsCreated, creatorsUpdated, videos: videos.length } });
  return { videosFound: videos.length, creatorsCreated, creatorsUpdated, jobsQueued };
}

async function getJson<T>(endpoint: string, parameters: Record<string, string>): Promise<T> {
  const url = new URL(endpoint);
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);
  const response = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`YouTube API ${response.status}: ${(await response.text()).slice(0, 500)}`);
  return response.json() as Promise<T>;
}
function integerOrNull(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

const businessMarkers = /business|sponsor|collab|partnership|advertis|inquir|enquir|сотруднич|реклам|по вопросам|деловы/i;

// Only an email the creator published in the channel description counts; it is business-grade only when the
// surrounding text says so, otherwise it is stored but sending stays blocked by the public-business rule.
export function businessEmailFromDescription(description: string | undefined): { email: string; isBusiness: boolean } | null {
  if (!description) return null;
  const match = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}/.exec(description);
  if (!match) return null;
  const context = description.slice(Math.max(0, match.index - 120), match.index + match[0].length + 40);
  return { email: match[0], isBusiness: businessMarkers.test(context) };
}

// Recent uploads give the scorer real reach and cadence instead of a single search hit (about 2 quota units).
async function enrichRecentUploads(database: Database, apiKey: string, creatorId: string, profileId: string, uploadsPlaylistId: string): Promise<void> {
  const playlist = await getJson<PlaylistItemsResponse>("https://www.googleapis.com/youtube/v3/playlistItems", {
    key: apiKey, part: "contentDetails", playlistId: uploadsPlaylistId, maxResults: "10",
  });
  const ids = (playlist.items ?? []).map((item) => item.contentDetails?.videoId).filter((id): id is string => Boolean(id));
  if (ids.length === 0) return;
  const videos = await getJson<VideosResponse>("https://www.googleapis.com/youtube/v3/videos", {
    key: apiKey, part: "snippet,statistics", id: ids.join(","), maxResults: "10",
  });
  const views: number[] = [];
  const engagement: number[] = [];
  for (const video of videos.items ?? []) {
    if (!video.id) continue;
    const viewCount = integerOrNull(video.statistics?.viewCount);
    const likes = integerOrNull(video.statistics?.likeCount);
    const comments = integerOrNull(video.statistics?.commentCount);
    if (viewCount !== null) views.push(viewCount);
    if (viewCount) engagement.push(((likes ?? 0) + (comments ?? 0)) / viewCount);
    await database`
      INSERT INTO creator_posts (id, creator_id, profile_id, external_id, url, title, summary, published_at, views, likes, comments)
      VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${video.id}, ${`https://www.youtube.com/watch?v=${video.id}`},
        ${video.snippet?.title ?? video.id}, ${video.snippet?.description?.slice(0, 1000) ?? null}, ${video.snippet?.publishedAt ?? null},
        ${viewCount}, ${likes}, ${comments})
      ON CONFLICT (profile_id, url) DO UPDATE SET views = EXCLUDED.views, likes = EXCLUDED.likes,
        comments = EXCLUDED.comments, source_checked_at = now()
    `;
  }
  await database`
    UPDATE creator_profiles SET median_views = ${views.length ? Math.round(median(views) ?? 0) : null},
      engagement_rate = ${engagement.length ? Number(median(engagement)?.toFixed(4)) : null}, updated_at = now()
    WHERE id = ${profileId}
  `;
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] ?? null : Math.round((((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2) * 10_000) / 10_000;
}

const russianSpeakingCountries = new Set(["RU", "BY", "KZ", "KG", "UZ", "AM", "AZ", "MD", "TJ", "TM", "GE", "UA"]);

// The market follows the channel itself, not the language of the search query that surfaced it.
export function channelMarket(channel: { snippet?: { title?: string; description?: string; country?: string } }, videoTitles: string[], fallback: Market): Market {
  const country = channel.snippet?.country?.toUpperCase();
  const text = [channel.snippet?.title ?? "", channel.snippet?.description ?? "", ...videoTitles].join(" ");
  const cyrillic = (text.match(/[а-яё]/gi) ?? []).length;
  const latin = (text.match(/[a-z]/gi) ?? []).length;
  if (cyrillic + latin < 20) return country && russianSpeakingCountries.has(country) ? "ru" : fallback;
  return cyrillic >= latin * 0.3 ? "ru" : "en";
}
