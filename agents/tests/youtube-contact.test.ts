import assert from "node:assert/strict";
import test from "node:test";
import { businessEmailFromDescription, median } from "../src/discovery/youtube.js";

test("marks a description email as business only with a business marker nearby", () => {
  assert.deepEqual(businessEmailFromDescription("По вопросам сотрудничества: ads@example.com"), { email: "ads@example.com", isBusiness: true });
  assert.deepEqual(businessEmailFromDescription("Пишите мне: me@example.com"), { email: "me@example.com", isBusiness: false });
  assert.equal(businessEmailFromDescription("Без почты"), null);
});

test("median handles odd, even and empty lists", () => {
  assert.equal(median([3, 1, 2]), 2);
  assert.equal(median([4, 1, 3, 2]), 2.5);
  assert.equal(median([]), null);
});
