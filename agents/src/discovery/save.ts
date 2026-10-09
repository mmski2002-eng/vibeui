import { randomUUID } from "node:crypto";
import type postgres from "postgres";
import type { Database } from "../database.js";
import type { Market } from "../types.js";
import { enqueue } from "../queue.js";
import { median } from "./youtube.js";

export interface FoundPost { url: string; title: string; summary: string; publishedAt: string | null; views: number | null; likes?: number | null; comments?: number | null }
export interface FoundProfile {
  platform: string;
  externalId: string;
  profileUrl: string;
  handle: string | null;
  displayName: string;
  market: Market;
  followers: number | null;
  raw: Record<string, unknown>;
  posts: FoundPost[];
  contact: { kind: "email" | "telegram"; value: string; isBusiness: boolean } | null;
}

// Raw public data keeps profile links (t.me, websites): Telegram crawling and website enrichment read them from there.
export async function saveProfile(database: Database, profile: FoundProfile): Promise<{ status: "created" | "updated"; id: string }> {
  const existing = await database<{ creator_id: string; profile_id: string }[]>`
    SELECT creator_id, id AS profile_id FROM creator_profiles WHERE platform = ${profile.platform} AND external_id = ${profile.externalId}
  `;
  const creatorId = existing[0]?.creator_id ?? randomUUID();
  const profileId = existing[0]?.profile_id ?? randomUUID();
  const views = profile.posts.map((post) => post.views).filter((value): value is number => value !== null);
  const medianViews = views.length ? Math.round(median(views) ?? 0) : null;
  const raw = database.json(profile.raw as postgres.JSONValue);
  await database.begin(async (transaction) => {
    if (existing[0]) {
      await transaction`UPDATE creator_profiles SET followers = ${profile.followers}, median_views = ${medianViews},
        raw_public_data = ${raw}, verified_at = now(), updated_at = now() WHERE id = ${profileId}`;
    } else {
      await transaction`INSERT INTO creators (id, display_name, market, language, status)
        VALUES (${creatorId}, ${profile.displayName.slice(0, 200)}, ${profile.market}, ${profile.market}, 'researched')`;
      await transaction`INSERT INTO creator_profiles (id, creator_id, platform, external_id, profile_url, handle, followers, median_views, raw_public_data, verified_at)
        VALUES (${profileId}, ${creatorId}, ${profile.platform}, ${profile.externalId}, ${profile.profileUrl}, ${profile.handle}, ${profile.followers}, ${medianViews}, ${raw}, now())`;
    }
    for (const post of profile.posts.slice(0, 20)) {
      await transaction`
        INSERT INTO creator_posts (id, creator_id, profile_id, url, title, summary, published_at, views, likes, comments)
        VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${post.url}, ${post.title.slice(0, 300) || "(без названия)"}, ${post.summary.slice(0, 2_000)},
          ${post.publishedAt}, ${post.views}, ${post.likes ?? null}, ${post.comments ?? null})
        ON CONFLICT (profile_id, url) DO UPDATE SET views = EXCLUDED.views, likes = EXCLUDED.likes, comments = EXCLUDED.comments, source_checked_at = now()
      `;
    }
    if (profile.contact) {
      await transaction`
        INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at)
        VALUES (${randomUUID()}, ${creatorId}, ${profile.contact.kind}, ${profile.contact.value}, ${profile.contact.value.toLowerCase()}, ${profile.profileUrl}, ${profile.contact.isBusiness}, now())
        ON CONFLICT (kind, normalized_value) DO NOTHING
      `;
    }
  });
  await enqueue(database, "score_creator", { creatorId }, `score_creator:${creatorId}:${new Date().toISOString().slice(0, 10)}`);
  return { status: existing[0] ? "updated" : "created", id: creatorId };
}

export async function recentlyChecked(database: Database, platform: string, externalId: string, days = 30): Promise<boolean> {
  const rows = await database`
    SELECT 1 FROM creator_profiles WHERE platform = ${platform} AND external_id = ${externalId}
      AND verified_at > now() - make_interval(days => ${days})
  `;
  return rows.length > 0;
}

export function topicHits(texts: string[], pattern: RegExp): number {
  return (texts.join("\n").match(new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`)) ?? []).length;
}

export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; VibeUIResearch/1.0)", accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`${new URL(url).host} ${response.status}`);
  return response.json() as Promise<T>;
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
