import assert from "node:assert/strict";
import { test } from "node:test";
import { referralWord } from "../src/referral-word.js";

test("prefers the platform handle", () => {
  assert.equal(referralWord(["@GreatStackDev"], "GreatStack"), "for_greatstackdev");
});

test("transliterates a Russian surname over the handle", () => {
  assert.equal(referralWord(["vladm"], "Владилен Минин"), "for_minin");
});

test("stays within the 24-character code limit", () => {
  const word = referralWord(["a_very_long_channel_handle_name"], "x");
  assert.ok(word.length <= 24);
  assert.match(word, /^[a-z0-9][a-z0-9_-]{2,23}$/);
});

test("treats Latin two-word names as channel names", () => {
  assert.equal(referralWord(["@virtualcode"], "VIRTUAL CODE"), "for_virtualcode");
  assert.equal(referralWord(["@ZinhoAutomates"], "Zinho Automates"), "for_zinhoautomates");
});
