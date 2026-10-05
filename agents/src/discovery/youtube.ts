import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Database } from "../database.js";
import type { Market } from "../types.js";
import { enqueue } from "../queue.js";
import { writeAudit } from "../audit.js";

interface SearchResponse {
  items?: Array<{
    id?: { videoId?: string };
    snippet?: { channelId?: string; channelTitle?: string; title?: string; description?: string; publishedAt?: string };
  }>;
}
interface ChannelsResponse {
  items?: Array<{
    id?: string;
    snippet?: { title?: string; description?: string; customUrl?: string; country?: string };
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
    key: apiKey, part: "snippet,statistics", id: channelIds.join(","), maxResults: "50",
  });
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
          VALUES (${creatorId}, ${channel.snippet?.title ?? channelId}, ${market}, ${market},
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
    for (const video of videos.filter((item) => item.snippet?.channelId === channelId)) {
      const videoId = video.id?.videoId;
      if (!videoId) continue;
      await database`
        INSERT INTO creator_posts (id, creator_id, profile_id, external_id, url, title, summary,
          published_at, raw_public_data)
        VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${videoId},
          ${`https://www.youtube.com/watch?v=${videoId}`}, ${video.snippet?.title ?? videoId},
          ${video.snippet?.description ?? null}, ${video.snippet?.publishedAt ?? null},
          ${database.json(video as unknown as postgres.JSONValue)})
        ON CONFLICT (profile_id, url) DO UPDATE SET title = EXCLUDED.title,
          summary = EXCLUDED.summary, source_checked_at = now(), raw_public_data = EXCLUDED.raw_public_data
      `;
    }
    await enqueue(database, "score_creator", { creatorId }, `score_creator:${creatorId}:${new Date().toISOString().slice(0, 10)}`);
    jobsQueued++;
  }
  await writeAudit(database, { actor: "discovery_youtube", action: "discover", targetType: "query",
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
