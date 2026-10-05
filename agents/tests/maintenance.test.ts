import assert from "node:assert/strict";
import test from "node:test";
import { businessEmailFromHtml, marketFromText, websiteCandidates } from "../src/maintenance.js";
import { channelMarket } from "../src/discovery/youtube.js";

test("market follows the channel's own language", () => {
  assert.equal(marketFromText("Prompt Engineering: build agents with Claude Code and Cursor, full tutorial for beginners"), "en");
  assert.equal(marketFromText("Вайбкодинг: собираем лендинг в Cursor с нуля, разбор ошибок нейросети"), "ru");
  assert.equal(marketFromText("short"), null);
  assert.equal(channelMarket({ snippet: { title: "Coding2GO", description: "Learn web development fast with modern tools" } }, ["Build a website with AI"], "ru"), "en");
});

test("own website candidates exclude social networks and JSON escapes", () => {
  assert.deepEqual(websiteCandidates('{"description":"Site: https://author.ru/about\nTG https://t.me/x https://youtube.com/@a"}'), ["https://author.ru"]);
});

test("website email counts only with an advertising context or role address", () => {
  assert.equal(businessEmailFromHtml('<p>По вопросам рекламы: <a href="mailto:me@author.ru">me@author.ru</a></p>'), "me@author.ru");
  assert.equal(businessEmailFromHtml("<p>ads@author.ru</p>"), "ads@author.ru");
  assert.equal(businessEmailFromHtml("<p>Пишите: ivan@author.ru</p>"), null);
  assert.equal(businessEmailFromHtml('<img src="logo@2x.png">'), null);
});
