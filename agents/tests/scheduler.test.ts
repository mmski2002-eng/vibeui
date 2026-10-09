import assert from "node:assert/strict";
import test from "node:test";
import { discoveryTasks, gate, pickTask, type SchedulerState } from "../src/scheduler.js";
import type { Policy } from "../src/policy.js";

const ready: SchedulerState = { emergencyStop: false, modelsPaused: false, spentToday: 0.1, dailyBudget: 0.5, spentTotal: 1, totalBudget: 3, pendingScoring: 0, stock: 4, dailyContactLimit: 5 };

test("searches only when budget is left, nothing waits for scoring and the stock is low", () => {
  assert.deepEqual(gate(ready), { run: true });
  assert.deepEqual(gate({ ...ready, emergencyStop: true }), { run: false, reason: "emergency_stop" });
  assert.deepEqual(gate({ ...ready, modelsPaused: true }), { run: false, reason: "models_paused" });
  assert.deepEqual(gate({ ...ready, spentToday: 0.5 }), { run: false, reason: "budget_spent" });
  assert.deepEqual(gate({ ...ready, spentTotal: 3 }), { run: false, reason: "total_budget_spent" });
  assert.deepEqual(gate({ ...ready, pendingScoring: 3 }), { run: false, reason: "scoring_in_progress" });
  assert.deepEqual(gate({ ...ready, stock: 15 }), { run: false, reason: "enough_candidates" });
  assert.deepEqual(gate({ ...ready, stock: 14 }), { run: true });
});

const policy = { discovery: { youtube: { ru: ["вайбкодинг"], en: ["vibe coding"] }, rutube: ["cursor"], habrHubs: ["webdev"], devtoTags: ["nextjs"], telegramQueries: ["cursor"] } } as Policy;

test("builds tasks only for configured sources", () => {
  const bare = discoveryTasks(policy, { youtubeApiKey: "", vkServiceToken: "", telegramSearch: false }).map((task) => task.source);
  assert.deepEqual(bare, ["rutube", "habr", "devto", "telegram", "maintenance"]);
  const full = discoveryTasks(policy, { youtubeApiKey: "k", vkServiceToken: "t", telegramSearch: true }).map((task) => task.source);
  assert.deepEqual(full, ["youtube:ru", "youtube:en", "rutube", "habr", "devto", "telegram-search", "telegram", "vk", "maintenance"]);
});

test("picks a never-run task first, then the longest waiting, and skips recent ones", () => {
  const tasks = [{ source: "habr", query: "webdev" }, { source: "devto", query: "nextjs" }, { source: "rutube", query: "cursor" }];
  const now = new Date("2026-10-09T12:00:00Z");
  const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 3_600_000);
  assert.deepEqual(pickTask(tasks, new Map([["habr|webdev", hoursAgo(30)]]), now), { source: "devto", query: "nextjs" });
  const runs = new Map([["habr|webdev", hoursAgo(30)], ["devto|nextjs", hoursAgo(40)], ["rutube|cursor", hoursAgo(2)]]);
  assert.deepEqual(pickTask(tasks, runs, now), { source: "devto", query: "nextjs" });
  assert.equal(pickTask(tasks, new Map(tasks.map((task) => [`${task.source}|${task.query}`, hoursAgo(1)])), now), null);
});
