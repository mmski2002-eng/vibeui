import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import type postgres from "postgres";
import type { Database } from "./database.js";

const importedCreator = z.object({
  displayName: z.string().min(1), market: z.enum(["ru", "en"]), language: z.string().optional(), country: z.string().optional(),
  profile: z.object({ platform: z.string().min(1), url: z.string().url(), externalId: z.string().optional(), handle: z.string().optional(), followers: z.number().int().nonnegative().optional() }),
  posts: z.array(z.object({ url: z.string().url(), title: z.string().min(1), summary: z.string().optional(), publishedAt: z.string().datetime().optional() })).default([]),
  contact: z.object({ kind: z.enum(["email"]), value: z.string().email(), sourceUrl: z.string().url(), isPublicBusiness: z.literal(true), verifiedAt: z.string().datetime() }).optional(),
});
const importFile = z.array(importedCreator);

export async function importCreators(database: Database, path: string): Promise<{ imported: number; updated: number }> {
  const records = importFile.parse(JSON.parse(await readFile(path, "utf8")));
  let imported = 0; let updated = 0;
  for (const record of records) {
    const profileUrl = normalizeUrl(record.profile.url);
    const existing = await database<{ creator_id: string; id: string }[]>`
      SELECT creator_id, id FROM creator_profiles WHERE platform = ${record.profile.platform} AND profile_url = ${profileUrl}
    `;
    const creatorId = existing[0]?.creator_id ?? randomUUID();
    const profileId = existing[0]?.id ?? randomUUID();
    if (existing[0]) {
      updated++;
      await database`UPDATE creators SET display_name = ${record.displayName}, language = ${record.language ?? null}, country = ${record.country ?? null}, updated_at = now() WHERE id = ${creatorId}`;
      await database`UPDATE creator_profiles SET followers = ${record.profile.followers ?? null}, updated_at = now(), verified_at = now() WHERE id = ${profileId}`;
    } else {
      imported++;
      await database.begin(async (transaction) => {
        await transaction`INSERT INTO creators (id, display_name, market, language, country, status) VALUES (${creatorId}, ${record.displayName}, ${record.market}, ${record.language ?? record.market}, ${record.country ?? null}, 'researched')`;
        await transaction`INSERT INTO creator_profiles (id, creator_id, platform, external_id, profile_url, handle, followers, verified_at) VALUES (${profileId}, ${creatorId}, ${record.profile.platform}, ${record.profile.externalId ?? null}, ${profileUrl}, ${record.profile.handle ?? null}, ${record.profile.followers ?? null}, now())`;
      });
    }
    for (const post of record.posts) {
      await database`INSERT INTO creator_posts (id, creator_id, profile_id, url, title, summary, published_at) VALUES (${randomUUID()}, ${creatorId}, ${profileId}, ${normalizeUrl(post.url)}, ${post.title}, ${post.summary ?? null}, ${post.publishedAt ?? null}) ON CONFLICT (profile_id, url) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary, source_checked_at = now()`;
    }
    if (record.contact) {
      const normalized = record.contact.value.trim().toLowerCase();
      await database`INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at) VALUES (${randomUUID()}, ${creatorId}, ${record.contact.kind}, ${record.contact.value}, ${normalized}, ${record.contact.sourceUrl}, true, ${record.contact.verifiedAt}) ON CONFLICT (kind, normalized_value) DO UPDATE SET source_url = EXCLUDED.source_url, verified_at = EXCLUDED.verified_at, is_public_business = true`;
    }
  }
  return { imported, updated };
}

export function normalizeUrl(input: string): string {
  const url = new URL(input);
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) if (key.startsWith("utm_") || key === "fbclid" || key === "gclid") url.searchParams.delete(key);
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  url.hostname = url.hostname.toLowerCase();
  return url.toString();
}
