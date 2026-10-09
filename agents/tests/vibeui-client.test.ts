import assert from "node:assert/strict";
import test from "node:test";
import { fetchCreatorStats, marketRevenue, type CreatorStats } from "../src/vibeui-client.js";

const stats: CreatorStats = {
  code: "for_anna", claimed: true, claimedAt: "2026-10-01T00:00:00.000Z",
  visits: 12, registrations: 3, payments: 2, commissionPercent: 25,
  revenue: [{ currency: "RUB", amount: 1380, commission: 345 }, { currency: "USD", amount: 9, commission: 2 }],
};

test("takes revenue in the creator's market currency", () => {
  assert.deepEqual(marketRevenue(stats, "ru"), { revenue: 1380, commission: 345 });
  assert.deepEqual(marketRevenue(stats, "en"), { revenue: 9, commission: 2 });
  assert.deepEqual(marketRevenue({ ...stats, revenue: [] }, "ru"), { revenue: 0, commission: 0 });
});

test("asks the creator's domain for one creator's stats", async (context) => {
  const calls: { url: string; auth: string | null }[] = [];
  context.mock.method(globalThis, "fetch", async (input: URL, init: RequestInit) => {
    calls.push({ url: String(input), auth: new Headers(init.headers).get("authorization") });
    return Response.json(stats);
  });
  assert.deepEqual(await fetchCreatorStats("key", "en", "11111111-2222-3333-4444-555555555555"), stats);
  assert.deepEqual(calls, [{ url: "https://vibeui.club/api/internal/invites?creatorId=11111111-2222-3333-4444-555555555555", auth: "Bearer key" }]);
});

test("treats an unknown creator as not invited and other errors as failures", async (context) => {
  const fetchMock = context.mock.method(globalThis, "fetch", async () => Response.json({ error: "not_found" }, { status: 404 }));
  assert.equal(await fetchCreatorStats("key", "ru", "11111111-2222-3333-4444-555555555555"), null);
  fetchMock.mock.mockImplementation(async () => new Response("boom", { status: 500 }));
  await assert.rejects(fetchCreatorStats("key", "ru", "11111111-2222-3333-4444-555555555555"), /VibeUI stats API 500/);
  await assert.rejects(fetchCreatorStats("", "ru", "x"), /not configured/);
});
