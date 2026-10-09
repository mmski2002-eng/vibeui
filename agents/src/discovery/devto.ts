import type { Database } from "../database.js";
import { writeAudit } from "../audit.js";
import { topicPattern } from "./telegram.js";
import { businessEmailFromDescription } from "./youtube.js";
import { delay, getJson, recentlyChecked, saveProfile, topicHits, type FoundPost } from "./save.js";

// Dev.to public API (no key). Top articles of a tag give authors; an author's own articles decide relevance.
// Dev.to hides emails, so the website goes into raw data for the website contact enrichment.
const API = "https://dev.to/api";
const REQUEST_DELAY_MS = 1_000;

interface DevtoArticle {
  url: string; title: string; description?: string | null; published_at?: string | null; tag_list?: string[] | string;
  public_reactions_count?: number; comments_count?: number; user?: { username: string; name?: string } | null;
}
interface DevtoUser { username: string; name?: string; summary?: string | null; website_url?: string | null; twitter_username?: string | null; github_username?: string | null; location?: string | null }

export interface DevtoDiscoveryResult { authors: number; relevant: number; created: number; updated: number; skipped: number }

export async function discoverDevto(database: Database, tag: string, options: { maxAuthors: number }): Promise<DevtoDiscoveryResult> {
  const result: DevtoDiscoveryResult = { authors: 0, relevant: 0, created: 0, updated: 0, skipped: 0 };
  const top = await getJson<DevtoArticle[]>(`${API}/articles?tag=${encodeURIComponent(tag)}&top=30&per_page=30`);
  for (const username of authorsFromArticles(top).slice(0, options.maxAuthors)) {
    result.authors++;
    if (await recentlyChecked(database, "devto", username)) { result.skipped++; continue; }
    await delay(REQUEST_DELAY_MS);
    const [user, own] = await Promise.all([
      getJson<DevtoUser>(`${API}/users/by_username?url=${encodeURIComponent(username)}`),
      getJson<DevtoArticle[]>(`${API}/articles?username=${encodeURIComponent(username)}&per_page=10`),
    ]);
    const posts = articlesToPosts(own);
    if (topicHits([user.summary ?? "", ...posts.map((post) => `${post.title} ${post.summary}`)], topicPattern) < 3) continue;
    result.relevant++;
    const email = businessEmailFromDescription(user.summary ?? "");
    const saved = await saveProfile(database, {
      platform: "devto", externalId: username, profileUrl: `https://dev.to/${username}`, handle: `@${username}`,
      displayName: user.name || username, market: "en", followers: null,
      raw: { summary: user.summary, website: user.website_url, twitter: user.twitter_username, github: user.github_username, location: user.location },
      posts, contact: email ? { kind: "email", value: email.email, isBusiness: email.isBusiness } : null,
    });
    result[saved.status]++;
  }
  await writeAudit(database, { actor: "discovery", action: "discover_devto", targetType: "query", targetId: tag, decision: "completed", details: { ...result } });
  return result;
}

export function authorsFromArticles(articles: DevtoArticle[]): string[] {
  return [...new Set(articles.map((article) => article.user?.username).filter((name): name is string => Boolean(name)))];
}

export function articlesToPosts(articles: DevtoArticle[]): FoundPost[] {
  return articles.map((article) => ({
    url: article.url, title: article.title, summary: `${article.description ?? ""} ${Array.isArray(article.tag_list) ? article.tag_list.join(" ") : article.tag_list ?? ""}`.trim(),
    publishedAt: article.published_at ?? null, views: null, likes: article.public_reactions_count ?? null, comments: article.comments_count ?? null,
  }));
}
