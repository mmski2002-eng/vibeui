import assert from "node:assert/strict";
import test from "node:test";
import { businessContactFromDescription, detectMarket, isRelevant, normalizeUsername, parseChannelPage, parseCount } from "../src/discovery/telegram.js";

const page = `<meta property="og:title" content="Вайбкодинг &amp; ИИ">
<div class="tgme_channel_info"><div class="tgme_channel_info_description">Про Cursor и Claude. По вопросам рекламы: @ads_manager</div>
<span class="counter_value">12.3K</span> <span class="counter_type">subscribers</span></div>
<div class="tgme_widget_message_wrap js-widget_message_wrap"><div data-post="vibechan/10">
<a class="tgme_widget_message_forwarded_from_name" href="https://t.me/OtherChan">Other</a>
<div class="tgme_widget_message_text js-message_text" dir="auto">Собрал лендинг в Cursor с нейросетью, смотрите <a href="https://t.me/friendchan/5">разбор</a><br/>и @mention_chan</div>
<span class="tgme_widget_message_views">4.5K</span><time datetime="2026-09-30T10:00:00+00:00"></time></div></div>`;

test("parses a public channel page", () => {
  const channel = parseChannelPage("vibechan", page);
  assert.ok(channel);
  assert.equal(channel.title, "Вайбкодинг & ИИ");
  assert.equal(channel.subscribers, 12_300);
  assert.equal(channel.posts.length, 1);
  assert.equal(channel.posts[0]?.url, "https://t.me/vibechan/10");
  assert.equal(channel.posts[0]?.views, 4_500);
  assert.deepEqual(channel.linkedChannels.sort(), ["ads_manager", "friendchan", "mention_chan", "otherchan"]);
  assert.equal(detectMarket(channel), "ru");
  assert.equal(isRelevant(channel), true);
  assert.equal(parseChannelPage("x", "<html>user profile</html>"), null);
});

test("normalizes usernames and skips service links and bots", () => {
  assert.equal(normalizeUsername("https://t.me/s/VibeChan"), "vibechan");
  assert.equal(normalizeUsername("@vibechan"), "vibechan");
  assert.equal(normalizeUsername("https://t.me/vibechan/123"), "vibechan");
  assert.equal(normalizeUsername("https://t.me/joinchat"), null);
  assert.equal(normalizeUsername("news_bot"), null);
});

test("parses counters and business contacts", () => {
  assert.equal(parseCount("1.2M"), 1_200_000);
  assert.equal(parseCount("987"), 987);
  assert.deepEqual(businessContactFromDescription("Канал. По вопросам рекламы: @ads_manager"), { kind: "telegram", value: "@ads_manager", isBusiness: true });
  assert.equal(businessContactFromDescription("Автор @someone"), null);
});
