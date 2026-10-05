import assert from "node:assert/strict";
import test from "node:test";
import { calculateModelCost } from "../src/model-cost.js";

test("calculates Luna token cost including cached input", () => {
  assert.equal(calculateModelCost("gpt-6-luna", { inputTokens: 1_000_000, cachedInputTokens: 200_000, outputTokens: 100_000 }), 0.132);
});
