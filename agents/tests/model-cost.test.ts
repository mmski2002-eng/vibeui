import assert from "node:assert/strict";
import test from "node:test";
import { calculateModelCost, isPricedModel } from "../src/model-cost.js";

test("calculates Luna token cost including cached input", () => {
  assert.equal(calculateModelCost("gpt-6-luna", { inputTokens: 1_000_000, cachedInputTokens: 200_000, outputTokens: 100_000 }), 0.132);
  assert.equal(calculateModelCost("openai/gpt-6-luna", { inputTokens: 1_000_000, cachedInputTokens: 200_000, outputTokens: 100_000 }), 0.132);
});

test("refuses to price an unknown model instead of recording zero cost", () => {
  assert.throws(() => calculateModelCost("unknown/model", { inputTokens: 1, cachedInputTokens: 0, outputTokens: 1 }), /No price configured/);
  assert.equal(isPricedModel("unknown/model"), false);
  assert.equal(isPricedModel("openai/gpt-6-luna"), true);
});
