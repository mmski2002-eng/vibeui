import assert from "node:assert/strict";
import test from "node:test";
import { assertTransition, canTransition } from "../src/state-machine.js";

test("allows the normal researched-to-scored transition", () => {
  assert.equal(canTransition("researched", "scored"), true);
});
test("does not allow a creator to skip directly to paid", () => {
  assert.equal(canTransition("eligible", "paid"), false);
  assert.throws(() => assertTransition("eligible", "paid"), /Invalid workflow transition/);
});
test("do-not-contact is terminal", () => {
  assert.equal(canTransition("do_not_contact", "queued"), false);
});
