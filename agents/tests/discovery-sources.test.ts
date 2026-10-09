import assert from "node:assert/strict";
import test from "node:test";
import { articlesToPosts as habrPosts, authorsFromFeed, contactFromWhois } from "../src/discovery/habr.js";
import { authorsFromSearch, videosToPosts } from "../src/discovery/rutube.js";
import { articlesToPosts as devtoPosts, authorsFromArticles } from "../src/discovery/devto.js";
import { channelUsernames } from "../src/discovery/telegram-search.js";
import { topicHits } from "../src/discovery/save.js";
import { topicPattern } from "../src/discovery/telegram.js";

test("Habr: skips company blogs, dedupes authors, turns articles into posts", () => {
  const feed = { publicationRefs: {
    "1": { id: "1", timePublished: "2026-10-01T10:00:00+00:00", isCorporative: true, titleHtml: "Блог компании", author: { alias: "corp" } },
    "2": { id: "2", timePublished: "2026-10-02T10:00:00+00:00", isCorporative: false, titleHtml: "Cursor &amp; <em>Claude</em>", author: { alias: "anna" }, statistics: { readingCount: 900, score: 12, commentsCount: 4 } },
    "3": { id: "3", timePublished: "2026-10-03T10:00:00+00:00", isCorporative: false, titleHtml: "Ещё статья", author: { alias: "anna" } },
  } };
  assert.deepEqual(authorsFromFeed(feed), ["anna"]);
  const posts = habrPosts(feed);
  assert.equal(posts[0]?.url, "https://habr.com/ru/articles/3/");
  assert.deepEqual(posts.find((post) => post.url.endsWith("/2/")), {
    url: "https://habr.com/ru/articles/2/", title: "Cursor & Claude", summary: "Cursor & Claude", publishedAt: "2026-10-02T10:00:00+00:00", views: 900, likes: 12, comments: 4,
  });
  assert.deepEqual(contactFromWhois({ aboutHtml: "<p>По вопросам рекламы: ads@anna.dev</p>", contacts: [] }), { kind: "email", value: "ads@anna.dev", isBusiness: true });
  assert.equal(contactFromWhois({ aboutHtml: "", contacts: [] }), null);
});

test("Rutube: unique channel ids from search, videos become posts", () => {
  const page = { results: [
    { id: "a", title: "Cursor за 10 минут", author: { id: 7, name: "Dev" }, hits: 500, created_ts: "2026-09-01T00:00:00", video_url: "https://rutube.ru/video/a/" },
    { id: "b", title: "Ещё", author: { id: 7, name: "Dev" } }, { id: "c", title: "Без автора", author: null },
  ] };
  assert.deepEqual(authorsFromSearch(page), [7]);
  assert.deepEqual(videosToPosts(page)[1], { url: "https://rutube.ru/video/b/", title: "Ещё", summary: "", publishedAt: null, views: null });
});

test("Dev.to: unique authors, tags join the summary", () => {
  const articles = [
    { url: "https://dev.to/a/1", title: "Vibe coding with Cursor", description: "How I ship", tag_list: ["ai", "nextjs"], public_reactions_count: 40, comments_count: 3, user: { username: "a" } },
    { url: "https://dev.to/a/2", title: "Second", tag_list: "react, tailwind", user: { username: "a" } },
  ];
  assert.deepEqual(authorsFromArticles(articles), ["a"]);
  assert.equal(devtoPosts(articles)[0]?.summary, "How I ship ai nextjs");
  assert.equal(devtoPosts(articles)[1]?.summary, "react, tailwind");
});

test("Telegram search keeps only public broadcast channels", () => {
  const chats = [
    { className: "Channel", broadcast: true, username: "VibeChan" },
    { className: "Channel", broadcast: false, username: "somegroup" },
    { className: "Channel", broadcast: true, username: null },
    { className: "Chat", username: "x" },
  ];
  assert.deepEqual(channelUsernames(chats), ["vibechan"]);
});

test("topic hits count every match, also for a non-global pattern", () => {
  assert.equal(topicHits(["Cursor и Claude", "лендинг на Next.js"], topicPattern), 4);
  assert.equal(topicHits(["cursor cursor"], /cursor/i), 2);
});
