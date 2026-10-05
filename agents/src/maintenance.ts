import { randomUUID } from "node:crypto";
import type { Database } from "./database.js";
import { writeAudit } from "./audit.js";
import { businessEmailFromDescription } from "./discovery/youtube.js";
import { adMarkers } from "./discovery/telegram.js";

const socialHosts = /(?:^|\.)(?:youtube\.com|youtu\.be|t\.me|telegram\.me|vk\.com|vk\.ru|instagram\.com|tiktok\.com|x\.com|twitter\.com|facebook\.com|linkedin\.com|boosty\.to|patreon\.com|github\.com|discord\.gg|discord\.com|ok\.ru|dzen\.ru|rutube\.ru|google\.com|goo\.gl|bit\.ly|clck\.ru|taplink\.cc|linktr\.ee|apple\.com|spotify\.com|amazon\.com|cursor\.com|anthropic\.com|openai\.com|claude\.ai)$/i;
const contactPaths = ["", "/contacts", "/contact", "/about", "/kontakty"];
const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const ignoredEmail = /\.(?:png|jpe?g|gif|webp|svg)$|^(?:noreply|no-reply|example|test|support|privacy|abuse|postmaster)@|@(?:example|sentry|wixpress|domain)\./i;

export interface MaintenanceResult { marketsFixed: number; postContacts: number; websiteContacts: number; sitesChecked: number; merged: number; rescoreQueued: number }

export async function maintain(database: Database, options: { websites: boolean; rescore: boolean }): Promise<MaintenanceResult> {
  const result: MaintenanceResult = { marketsFixed: 0, postContacts: 0, websiteContacts: 0, sitesChecked: 0, merged: 0, rescoreQueued: 0 };
  const touched = new Set<string>();
  result.marketsFixed = await fixMarkets(database, touched);
  result.merged = await mergeDuplicates(database, touched);
  result.postContacts = await contactsFromPosts(database, touched);
  if (options.websites) {
    const sites = await contactsFromWebsites(database, touched);
    result.sitesChecked = sites.checked;
    result.websiteContacts = sites.found;
  }
  if (options.rescore) result.rescoreQueued = await queueRescore(database, touched);
  await writeAudit(database, { actor: "maintenance", action: "maintain", targetType: "system", decision: "completed", details: { ...result } });
  return result;
}

export function marketFromText(text: string): "ru" | "en" | null {
  const cyrillic = (text.match(/[а-яё]/gi) ?? []).length;
  const latin = (text.match(/[a-z]/gi) ?? []).length;
  if (cyrillic + latin < 40) return null;
  return cyrillic >= latin * 0.3 ? "ru" : "en";
}

async function fixMarkets(database: Database, touched: Set<string>): Promise<number> {
  const rows = await database<{ id: string; market: string; text: string }[]>`
    SELECT c.id, c.market, c.display_name || ' ' || COALESCE(string_agg(p.title, ' '), '') AS text
    FROM creators c LEFT JOIN creator_posts p ON p.creator_id = c.id
    GROUP BY c.id
  `;
  let fixed = 0;
  for (const row of rows) {
    const market = marketFromText(row.text);
    if (!market || market === row.market) continue;
    await database`UPDATE creators SET market = ${market}, language = ${market}, updated_at = now() WHERE id = ${row.id}`;
    touched.add(row.id);
    fixed++;
  }
  return fixed;
}

// A Telegram or VK profile is the same person as a YouTube creator when that creator links it from the
// channel description or from at least two of their own videos.
async function mergeDuplicates(database: Database, touched: Set<string>): Promise<number> {
  const pairs = await database<{ target: string; source: string }[]>`
    WITH links AS (
      SELECT yp.creator_id AS owner, lower(m[1]) AS handle, 'telegram' AS platform, 2 AS weight
        FROM creator_profiles yp, regexp_matches(COALESCE(yp.raw_public_data::text, ''), 't\\.me/([A-Za-z][A-Za-z0-9_]{3,31})', 'g') m WHERE yp.platform = 'youtube'
      UNION ALL
      SELECT p.creator_id, lower(m[1]), 'telegram', 1
        FROM creator_posts p JOIN creator_profiles pp ON pp.id = p.profile_id AND pp.platform = 'youtube',
        regexp_matches(COALESCE(p.summary, ''), 't\\.me/([A-Za-z][A-Za-z0-9_]{3,31})', 'g') m
      UNION ALL
      SELECT p.creator_id, lower(m[1]), 'vk', 1
        FROM creator_posts p JOIN creator_profiles pp ON pp.id = p.profile_id AND pp.platform = 'youtube',
        regexp_matches(COALESCE(p.summary, ''), 'vk\\.(?:com|ru)/([A-Za-z0-9_.]{3,64})', 'g') m
    ), owners AS (
      SELECT owner, handle, platform FROM links GROUP BY owner, handle, platform HAVING sum(weight) >= 2
    )
    SELECT DISTINCT o.owner::text AS target, tp.creator_id::text AS source
    FROM owners o JOIN creator_profiles tp ON tp.platform = o.platform
      AND (lower(tp.external_id) = o.handle OR lower(tp.handle) = o.handle OR lower(tp.handle) = '@' || o.handle)
    WHERE tp.creator_id <> o.owner
  `;
  let merged = 0;
  const done = new Set<string>();
  for (const pair of pairs) {
    if (done.has(pair.source) || done.has(pair.target)) continue;
    const owners = pairs.filter((item) => item.source === pair.source);
    if (owners.length > 1) continue;
    await database.begin(async (transaction) => {
      await transaction`UPDATE creator_profiles SET creator_id = ${pair.target} WHERE creator_id = ${pair.source}`;
      await transaction`UPDATE creator_posts SET creator_id = ${pair.target} WHERE creator_id = ${pair.source}`;
      await transaction`UPDATE creator_contacts SET creator_id = ${pair.target} WHERE creator_id = ${pair.source}`;
      await transaction`DELETE FROM candidate_scores WHERE creator_id = ${pair.source}`;
      await transaction`UPDATE agent_jobs SET status = 'cancelled', last_error = 'merged', updated_at = now()
        WHERE status = 'queued' AND payload->>'creatorId' = ${pair.source}`;
      const threads = await transaction`SELECT 1 FROM conversation_threads WHERE creator_id = ${pair.source}`;
      if (threads.length > 0) throw new Error(`Creator ${pair.source} has conversations; merge manually`);
      await transaction`DELETE FROM creators WHERE id = ${pair.source}`;
    }).then(() => {
      merged++;
      done.add(pair.source);
      touched.add(pair.target);
    }).catch(() => undefined);
  }
  return merged;
}

async function contactsFromPosts(database: Database, touched: Set<string>): Promise<number> {
  const rows = await database<{ creator_id: string; url: string; summary: string }[]>`
    SELECT p.creator_id, p.url, p.summary FROM creator_posts p
    WHERE p.summary ~ '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}'
      AND NOT EXISTS (SELECT 1 FROM creator_contacts cc WHERE cc.creator_id = p.creator_id AND cc.is_public_business)
    ORDER BY p.published_at DESC NULLS LAST
  `;
  let added = 0;
  for (const row of rows) {
    const contact = businessEmailFromDescription(row.summary);
    if (!contact?.isBusiness || ignoredEmail.test(contact.email)) continue;
    if (await insertContact(database, row.creator_id, contact.email, row.url)) { added++; touched.add(row.creator_id); }
  }
  return added;
}

export function websiteCandidates(text: string): string[] {
  const urls = new Set<string>();
  for (const match of text.matchAll(/https?:\/\/[^\s"'<>)\]\\]+/g)) {
    try {
      const url = new URL(match[0]);
      if (socialHosts.test(url.hostname.replace(/^www\./, ""))) continue;
      urls.add(url.origin);
    } catch { /* not a URL */ }
  }
  return [...urls].slice(0, 2);
}

export function businessEmailFromHtml(html: string): string | null {
  const mailto = [...html.matchAll(/mailto:([^"'?\s>]+)/gi)].map((match) => decodeURIComponent(match[1] ?? ""));
  const text = html.replace(/<[^>]+>/g, " ");
  const candidates = [...mailto, ...(text.match(emailPattern) ?? [])].filter((email) => !ignoredEmail.test(email));
  for (const email of candidates) {
    const index = text.indexOf(email);
    const context = index >= 0 ? text.slice(Math.max(0, index - 150), index + email.length + 50) : "";
    if (adMarkers.test(context) || /^(?:ads|adv|pr|promo|partner|business|collab|reklama|hello|info)@/i.test(email)) return email;
  }
  return null;
}

// Only the creator's own site linked from their profile, a handful of public contact pages, one request per second.
async function contactsFromWebsites(database: Database, touched: Set<string>): Promise<{ checked: number; found: number }> {
  const rows = await database<{ creator_id: string; text: string }[]>`
    SELECT cp.creator_id, string_agg(COALESCE(cp.raw_public_data::text, ''), ' ') AS text FROM creator_profiles cp
    WHERE NOT EXISTS (SELECT 1 FROM creator_contacts cc WHERE cc.creator_id = cp.creator_id AND cc.is_public_business)
      AND EXISTS (SELECT 1 FROM candidate_scores s WHERE s.creator_id = cp.creator_id AND s.total >= 60)
    GROUP BY cp.creator_id
  `;
  let checked = 0;
  let found = 0;
  for (const row of rows) {
    for (const origin of websiteCandidates(row.text)) {
      checked++;
      let email: string | null = null;
      let source = origin;
      for (const path of contactPaths) {
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        const html = await fetch(`${origin}${path}`, { headers: { "user-agent": "Mozilla/5.0 (compatible; VibeUIResearch/1.0)" }, signal: AbortSignal.timeout(10_000) })
          .then((response) => response.ok && (response.headers.get("content-type") ?? "").includes("html") ? response.text() : "")
          .catch(() => "");
        email = html ? businessEmailFromHtml(html) : null;
        if (email) { source = `${origin}${path}`; break; }
      }
      if (email && await insertContact(database, row.creator_id, email, source)) { found++; touched.add(row.creator_id); break; }
    }
  }
  return { checked, found };
}

async function insertContact(database: Database, creatorId: string, email: string, sourceUrl: string): Promise<boolean> {
  const rows = await database`
    INSERT INTO creator_contacts (id, creator_id, kind, value, normalized_value, source_url, is_public_business, verified_at)
    VALUES (${randomUUID()}, ${creatorId}, 'email', ${email}, ${email.toLowerCase()}, ${sourceUrl}, true, now())
    ON CONFLICT (kind, normalized_value) DO NOTHING RETURNING id
  `;
  return rows.length > 0;
}

async function queueRescore(database: Database, touched: Set<string>): Promise<number> {
  const candidates = await database<{ id: string; total: number | null }[]>`
    SELECT c.id, s.total FROM creators c
    LEFT JOIN LATERAL (SELECT total FROM candidate_scores s WHERE s.creator_id = c.id ORDER BY created_at DESC LIMIT 1) s ON true
    WHERE c.do_not_contact = false
  `;
  const rows = candidates.filter((row) => row.total === null || row.total >= 60 || touched.has(row.id));
  const stamp = new Date().toISOString().slice(0, 13);
  for (const row of rows) {
    await database`
      INSERT INTO agent_jobs (id, kind, payload, idempotency_key)
      VALUES (${randomUUID()}, 'score_creator', ${database.json({ creatorId: row.id })}, ${`rescore:${row.id}:${stamp}`})
      ON CONFLICT (idempotency_key) DO NOTHING
    `;
  }
  await database`UPDATE agent_jobs SET status = 'cancelled', last_error = 'superseded by rescore', updated_at = now()
    WHERE status = 'queued' AND kind = 'score_creator' AND idempotency_key NOT LIKE ${`rescore:%:${stamp}`}`;
  return rows.length;
}
