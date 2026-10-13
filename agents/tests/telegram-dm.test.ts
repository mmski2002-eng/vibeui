import assert from "node:assert/strict";
import test from "node:test";
import { errors } from "telegram";
import { floodPause, nextFirstContactAt } from "../src/telegram-dm.js";

const now = new Date("2026-10-13T12:00:00Z");

test("first contacts are spaced by the gap", () => {
  assert.equal(nextFirstContactAt(null, 6, now), null);
  assert.equal(nextFirstContactAt(new Date("2026-10-13T05:00:00Z"), 6, now), null);
  assert.deepEqual(nextFirstContactAt(new Date("2026-10-13T10:00:00Z"), 6, now), new Date("2026-10-13T16:00:00Z"));
});

test("flood errors pause sending, other errors do not", () => {
  const wait = new errors.FloodWaitError({ request: undefined as never, capture: 300 });
  assert.deepEqual(floodPause(wait, now), new Date(now.getTime() + 360_000));
  const peerFlood = new errors.RPCError("PEER_FLOOD", undefined as never, 400);
  assert.deepEqual(floodPause(peerFlood, now), new Date(now.getTime() + 24 * 3_600_000));
  assert.equal(floodPause(new Error("network"), now), null);
});
