import assert from "node:assert/strict";
import test from "node:test";
import { businessContactFromGroup, isRelevantVk, normalizeVkName } from "../src/discovery/vk.js";

test("normalizes VK community links and skips non-community paths", () => {
  assert.equal(normalizeVkName("https://vk.com/VibeCoding"), "vibecoding");
  assert.equal(normalizeVkName("vk.ru/public123"), "club123");
  assert.equal(normalizeVkName("https://vk.com/id555"), null);
  assert.equal(normalizeVkName("https://vk.com/wall-1_2"), null);
});

test("treats a contact as business only when its label says so", () => {
  assert.deepEqual(businessContactFromGroup({ contacts: [{ desc: "Реклама", email: "ads@example.com" }] }), { email: "ads@example.com", isBusiness: true });
  assert.deepEqual(businessContactFromGroup({ contacts: [{ desc: "Админ", email: "me@example.com" }] }), { email: "me@example.com", isBusiness: false });
  assert.equal(businessContactFromGroup({ contacts: [{ desc: "Реклама" }] }), null);
});

test("requires topic evidence before saving a community", () => {
  assert.equal(isRelevantVk({ name: "Вайбкодинг", description: "ИИ и Cursor" }, [{ text: "Собрал лендинг на React с нейросетью" }]), true);
  assert.equal(isRelevantVk({ name: "Рецепты", description: "Пироги" }, [{ text: "Тесто" }]), false);
});
