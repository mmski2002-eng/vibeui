import { randomUUID } from "node:crypto";
import type { Database } from "../database.js";
import type { Market } from "../types.js";
import { enqueue } from "../queue.js";
import { writeAudit } from "../audit.js";
import { median } from "./youtube.js";
import { adMarkers, topicPattern } from "./telegram.js";

// Service-token VK API only: reads public communities and walls. Search needs a user token that personal
// VK ID apps cannot get, so communities are reached through links published by known creators.
const API = "https://api.vk.com/method";
const VERSION = "5.199";
const REQUEST_DELAY_MS = 400;
const REFRESH_AFTER_DAYS = 7;

interface VkGroup {
  id: number; name: string; screen_name: string; is_closed: number; type: string; deactivated?: string;
  members_count?: number; description?: string; activity?: string; site?: string;
  contacts?: Array<{ user_id?: number; desc?: string; email?: string }>;
}
interface VkPost {
  id: number; owner_id: number; date: number; text: string; marked_as_ads?: number;
  views?: { count: number }; likes?: { count: number }; comments?: { count: number }; reposts?: { count: number };
  copy_history?: Array<{ owner_id: number }>;
}
export interface Seed { name: string; ownerCreatorId: string | null }
export interface VkDiscoveryResult { visited: number; relevant: number; created: number; attached: number; updated: number; jobsQueued: number; skipped: number }

export async function discoverVk(database: Database, token: string, seeds: string[], options: { maxGroups: number; maxDepth: number }): Promise<VkDiscoveryResult> {
  if (!token) throw new Error("VK_SERVICE_TOKEN is required for VK discovery");
  const result: VkDiscoveryResult = { visited: 0, relevant: 0, created: 0, attached: 0, updated: 0, jobsQueued: 0, skipped: 0 };
  const queue: Array<Seed & { depth: number }> = [];
  const seen = new Set<string>();
  const push = (seed: Seed, depth: number) => {
    const name = normalizeVkName(seed.name);
    if (name && !seen.has(name)) { seen.add(name); queue.push({ name, ownerCreatorId: seed.ownerCreatorId, depth }); }
  };
  for (const seed of seeds) push({ name: seed, ownerCreatorId: null }, 0);
  for (const seed of await vkSeedsFromDatabase(database)) push(seed, 0);

  while (queue.length > 0 && result.visited < options.maxGroups) {
    const next = queue.shift();
    if (!next) break;
    if (await recentlyChecked(database, next.name)) { result.skipped++; continue; }
    result.visited++;
    const group = (await call<{ groups: VkGroup[] }>(token, "groups.getById", {
      group_id: next.name, fields: "members_count,description,activity,site,contacts",
    }).catch(() => null))?.groups?.[0];
    if (!group || group.is_closed !== 0 || group.deactivated) continue;
    const wall = await call<{ items: VkPost[] }>(token, "wall.get", { owner_id: String(-group.id), count: "20", filter: "owner" }).catch(() => null);
    const posts = (wall?.items ?? []).filter((post) => post.text);
    if (!isRelevantVk(group, posts)) continue;
    result.relevant++;
    const saved = await saveGroup(database, group, posts, next.ownerCreatorId);
    result[saved.status]++;
    await enqueue(database, "score_creator", { creatorId: saved.creatorId }, `score_creator:${saved.creatorId}:${new Date().toISOString().slice(0, 10)}`);
    result.jobsQueued++;
    if (next.depth < options.maxDepth) {
      for (const linked of linkedGroups(posts, group.id)) push({ name: linked, ownerCreatorId: null }, next.depth + 1);
    }
  }
  await writeAudit(database, { actor: "discovery", action: "discover_vk", targetType: "query", targetId: seeds.join(",").slice(0, 200) || "database-seeds",
    decision: "completed", details: { ...result } });
  return result;
}

export function normalizeVkName(value: string): string | null {
  const match = /^(?:https?:\/\/)?(?:m\.)?(?:vk\.(?:com|ru)\/)?([A-Za-z0-9_.]{3,64})\/?$/.exec(value.trim());
  const name = match?.[1]?.toLowerCase();
  if (!name || /^(id\d+|wall-?\d+.*|video.*|photo.*|feed|im|away\.php|share\.php|app\d+|login|search)$/.test(name)) return null;
  return name.replace(/^(?:public|club|event)(\d+)$/, "club$1");
}

export function isRelevantVk(group: Pick<VkGroup, "name" | "description" | "activity">, posts: Pick<VkPost, "text">[]): boolean {
  const text = [group.name, group.description ?? "", group.activity ?? "", ...posts.map((post) => post.text)].join("\n");
  return posts.length > 0 && (text.match(topicPattern) ?? []).length >= 4;
}

export function businessContactFromGroup(group: Pick<VkGroup, "contacts" | "description">): { email: string; isBusiness: boolean } | null {
  for (const contact of group.contacts ?? []) {
    if (contact.email) return { email: contact.email, isBusiness: adMarkers.test(contact.desc ?? "") };
  }
  return null;
}

function linkedGroups(posts: VkPost[], ownId: number): string[] {
  const names = new Set<string>();
  for (const post of posts) {
    for (const source of post.copy_history ?? []) if (source.owner_id < 0 && -source.owner_id !== ownId) names.add(`club${-source.owner_id}`);
    for (const link of post.text.matchAll(/(?:vk\.(?:com|ru)\/|\[club)([A-Za-z0-9_.]{3,64})/g)) if (link[1]) names.add(link[1].toLowerCase());
  }
  return [...names];
}

function detectMarket(text: string): Market {
  const cyrillic = (text.match(/[а-яё]/gi) ?? []).length;
  const latin = (text.match(/[a-z]/gi) ?? []).length;
  return cyrillic >= latin * 0.5 ? "ru" : "en";
}

async function saveGroup(database: Database, group: VkGroup, posts: VkPost[], ownerCreatorId: string | null): Promise<{ status: "created" | "attached" | "updated"; creatorId: string }> {
  const externalId = String(group.id);
  const profileUrl = `https://vk.com/${group.screen_name}`;
  const existing = await database<{ creator_id: string; profile_id: string }[]>`
    SELECT creator_id, id AS profile_id FROM creator_profiles WHERE platform = 'vk' AND external_id = ${externalId}
  `;
  const owner = !existing[0] && ownerCreatorId ? (await database<{ id: string }[]>`SELECT id FROM creators WHERE id = ${ownerCreatorId}`)[0] : undefined;
  const creatorId = existing[0]?.creator_id ?? owner?.id ?? randomUUID();
  const profileId = existing[0]?.profile_id ?? randomUUID();
  const views = posts.map((post) => post.views?.count).filter((value): value is number => typeof value === "number");
  const engagement = posts.filter((post) => post.views?.count).map((post) => ((post.likes?.count ?? 0) + (post.comments?.count ?? 0) + (post.reposts?.count ?? 0)) / (post.views?.count ?? 1));
  const medianViews = views.length ? Math.round(median(views) ?? 0) : null;
  const engagementRate = engagement.length ? Number((median(engagement) ?? 0).toFixed(4)) : null;
  const raw = database.json({ name: group.name, description: (group.description ?? "").slice(0, 2_000), activity: group.activity ?? null, site: group.site ?? null,
    adPosts: posts.filter((post) => post.marked_as_ads).length });
  const market = detectMarket([group.name, group.description ?? "", ...posts.slice(0, 10).map((post) => post.text)].join(" "));
  await database.begin(async (transaction) => {
    if (existing[0]) {
      await transaction`UPDATE creator_profiles SET followers = ${group.members_count ?? null}, median_views = ${medianViews}, engagement_rate = ${engagementRate},
        raw_public_data = ${raw}, verified_at = now(), updated_at = now() WHERE id = ${profileId}`;
    } else {
      if (!owner) {
        await transaction`INSERT INTO creators (id, display_name, market, language, status) VALUES (${creatorId}, ${group.name}, ${market}, ${market}, 'researched')`;
      }
      await transaction`INSERT INTO creator_profiles (id, creator_id, platform, external_id, profile_url, handle, followers, median_views, engagement_rate, raw_public_data, verified_at)
        VALUES (${profileId}, ${creatorId}, 'vk', ${externalId}, ${profileUrl}, ${group.screen_name}, ${group.members_count ?? null}, ${medianViews}, ${engagementRate}, ${raw}, now())`;
    }
    for (const post of posts.slice(0, 20)) {
      const url = `https://vk.com/wall${post.owner_id}_${post.id}`;
      await transaction`
        INSERT INTO creator_posts (id, creator_id, profile_id, external_id, url, title, summary, published_at, views, likes, comments)
        VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${String(post.id)}, ${url}, ${post.text.slice(0, 120)}, ${post.text.slice(0, 1_000)},
          ${new Date(post.date * 1000).toISOString()}, ${post.views?.count ?? null}, ${post.likes?.count ?? null}, ${post.comments?.count ?? null})
        ON CONFLICT (profile_id, url) DO UPDATE SET views = EXCLUDED.views, likes = EXCLUDED.likes, comments = EXCLUDED.comments, source_checked_at = now()
      `;
    }
    const contact = businessContactFromGroup(group);
    if (contact) {
      await transaction`
        INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at)
        VALUES (${randomUUID()}, ${creatorId}, 'email', ${contact.email}, ${contact.email.toLowerCase()}, ${profileUrl}, ${contact.isBusiness}, now())
        ON CONFLICT (kind, normalized_value) DO NOTHING
      `;
    }
  });
  return { status: existing[0] ? "updated" : owner ? "attached" : "created", creatorId };
}

async function recentlyChecked(database: Database, name: string): Promise<boolean> {
  const rows = await database`
    SELECT 1 FROM creator_profiles WHERE platform = 'vk' AND (lower(handle) = ${name} OR 'club' || external_id = ${name})
      AND verified_at > now() - make_interval(days => ${REFRESH_AFTER_DAYS})
  `;
  return rows.length > 0;
}

// A VK link in a creator's own profile description is that creator's community; links in posts are only seeds.
async function vkSeedsFromDatabase(database: Database): Promise<Seed[]> {
  const rows = await database<{ name: string; owner: string | null }[]>`
    SELECT DISTINCT lower(m[1]) AS name, owner FROM (
      SELECT regexp_matches(COALESCE(raw_public_data::text, ''), 'vk\\.(?:com|ru)/([A-Za-z0-9_.]{3,64})', 'g') AS m, creator_id::text AS owner
        FROM creator_profiles WHERE platform <> 'vk'
      UNION ALL
      SELECT regexp_matches(COALESCE(summary, ''), 'vk\\.(?:com|ru)/([A-Za-z0-9_.]{3,64})', 'g'), NULL FROM creator_posts
    ) links
  `;
  return rows.map((row) => ({ name: row.name, ownerCreatorId: row.owner })).sort((a, b) => Number(b.ownerCreatorId !== null) - Number(a.ownerCreatorId !== null));
}

async function call<T>(token: string, method: string, parameters: Record<string, string>): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, REQUEST_DELAY_MS));
  const url = new URL(`${API}/${method}`);
  for (const [key, value] of Object.entries({ ...parameters, access_token: token, v: VERSION })) url.searchParams.set(key, value);
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  const body = await response.json() as { response?: T; error?: { error_code: number; error_msg: string } };
  if (body.error) throw new Error(`VK ${method} ${body.error.error_code}: ${body.error.error_msg}`);
  if (body.response === undefined) throw new Error(`VK ${method}: empty response`);
  return body.response;
}
