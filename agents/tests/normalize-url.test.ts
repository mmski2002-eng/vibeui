import assert from "node:assert/strict";
import test from "node:test";
import { normalizeUrl } from "../src/import-creators.js";

test("removes tracking and fragments from profile URLs", () => {
  assert.equal(normalizeUrl("https://Example.com/creator/?utm_source=x&keep=1#bio"), "https://example.com/creator?keep=1");
});
