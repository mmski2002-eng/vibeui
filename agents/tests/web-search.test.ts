import assert from "node:assert/strict";
import test from "node:test";
import { braveTelegramChannels, isMoscowNight, telegramChannelsFromUrls, urlsFromYandexXml, yandexTelegramChannels } from "../src/discovery/web-search.js";
import { discoveryTasks } from "../src/scheduler.js";
import type { Policy } from "../src/policy.js";

const xml = `<?xml version="1.0" encoding="utf-8"?><yandexsearch><response><results><grouping>
<group><doc><url>https://t.me/s/VibeChan</url><title>Вайбкодинг</title></doc></group>
<group><doc><url>https://t.me/vibechan/120</url><title>Пост</title></doc></group>
<group><doc><url>https://t.me/joinchat/AAAA</url><title>Чат</title></doc></group>
<group><doc><url>https://t.me/cursor_ru_bot</url><title>Бот</title></doc></group>
<group><doc><url>https://telegram.me/ai_frontend?start=1</url><title>AI</title></doc></group>
<group><doc><url>https://habr.com/ru/articles/1/</url><title>Хабр</title></doc></group>
</grouping></results></response></yandexsearch>`;

test("keeps only public channel usernames from search result links", () => {
  assert.deepEqual(telegramChannelsFromUrls(urlsFromYandexXml(xml)), ["vibechan", "ai_frontend"]);
});

test("Yandex 'nothing found' is empty, other errors fail", () => {
  assert.deepEqual(urlsFromYandexXml(`<yandexsearch><response><error code="15">Sorry, there are no results</error></response></yandexsearch>`), []);
  assert.throws(() => urlsFromYandexXml(`<yandexsearch><response><error code="32">Limit exceeded</error></response></yandexsearch>`), /error 32/);
});

test("Yandex request carries the key, folder and site:t.me, and decodes base64 XML", async (context) => {
  const calls: { url: string; auth: string | null; body: { folderId: string; responseFormat: string; query: { queryText: string } } }[] = [];
  context.mock.method(globalThis, "fetch", async (input: string, init: RequestInit) => {
    calls.push({ url: String(input), auth: new Headers(init.headers).get("authorization"), body: JSON.parse(String(init.body)) });
    return Response.json({ rawData: Buffer.from(xml).toString("base64") });
  });
  assert.deepEqual(await yandexTelegramChannels({ yandexSearchApiKey: "key", yandexFolderId: "b1gfolder" }, "вайбкодинг"), ["vibechan", "ai_frontend"]);
  assert.equal(calls[0]?.url, "https://searchapi.api.cloud.yandex.net/v2/web/search");
  assert.equal(calls[0]?.auth, "Api-Key key");
  assert.equal(calls[0]?.body.folderId, "b1gfolder");
  assert.equal(calls[0]?.body.query.queryText, "вайбкодинг site:t.me");
  assert.equal(calls[0]?.body.responseFormat, "FORMAT_XML");
});

test("Brave request uses the subscription token and reads web results", async (context) => {
  const calls: { url: string; token: string | null }[] = [];
  context.mock.method(globalThis, "fetch", async (input: URL, init: RequestInit) => {
    calls.push({ url: String(input), token: new Headers(init.headers).get("x-subscription-token") });
    return Response.json({ web: { results: [{ url: "https://t.me/s/NoCodeDaily" }, { url: "https://example.com" }] } });
  });
  assert.deepEqual(await braveTelegramChannels({ braveSearchApiKey: "brave" }, "no-code"), ["nocodedaily"]);
  assert.equal(calls[0]?.token, "brave");
  assert.match(calls[0]?.url ?? "", /q=no-code\+site%3At\.me/);
  context.mock.method(globalThis, "fetch", async () => new Response("quota", { status: 429 }));
  await assert.rejects(braveTelegramChannels({ braveSearchApiKey: "brave" }, "x"), /Brave Search API 429/);
});

test("Moscow night is 00:00–08:00 UTC+3", () => {
  assert.equal(isMoscowNight(new Date("2026-10-09T21:30:00Z")), true);
  assert.equal(isMoscowNight(new Date("2026-10-09T04:59:00Z")), true);
  assert.equal(isMoscowNight(new Date("2026-10-09T05:00:00Z")), false);
  assert.equal(isMoscowNight(new Date("2026-10-09T12:00:00Z")), false);
});

test("Yandex tasks appear only at night, Brave whenever its key is set", () => {
  const policy = { discovery: { youtube: { ru: [], en: [] }, rutube: [], habrHubs: [], devtoTags: [], telegramQueries: ["cursor"] } } as Policy;
  const sources = (options: { yandex: boolean; brave: boolean; night: boolean }) =>
    discoveryTasks(policy, { youtubeApiKey: "", vkServiceToken: "", telegramSearch: false, ...options }).map((task) => task.source);
  assert.deepEqual(sources({ yandex: true, brave: true, night: false }), ["brave-tg", "telegram", "maintenance"]);
  assert.deepEqual(sources({ yandex: true, brave: false, night: true }), ["yandex-tg", "telegram", "maintenance"]);
  assert.deepEqual(sources({ yandex: false, brave: false, night: true }), ["telegram", "maintenance"]);
});
