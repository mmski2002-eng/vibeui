// Both domains share one database; the creator's domain decides the origin of the referral link.
const MARKET_ORIGIN = { ru: "https://vibeui.ru", en: "https://vibeui.club" } as const;

export async function createReferralInvite(apiKey: string, market: "ru" | "en", input: { creatorId: string; name: string; word: string }) {
  if (!apiKey) throw new Error("VIBEUI_INTERNAL_API_KEY is not configured");
  const response = await fetch(new URL("/api/internal/invites", MARKET_ORIGIN[market]), {
    method: "POST", signal: AbortSignal.timeout(20_000),
    headers: { authorization: `Bearer ${apiKey}`, accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error(`VibeUI invite API ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const body = await response.json() as { code?: unknown; url?: unknown };
  if (typeof body.code !== "string" || typeof body.url !== "string") throw new Error("VibeUI invite API returned no link");
  return { code: body.code, url: body.url };
}

export type CreatorStats = {
  code: string; claimed: boolean; claimedAt: string | null;
  visits: number; registrations: number; payments: number; commissionPercent: number;
  revenue: { currency: string; amount: number; commission: number }[];
};

export async function fetchCreatorStats(apiKey: string, market: "ru" | "en", creatorId: string): Promise<CreatorStats | null> {
  if (!apiKey) throw new Error("VIBEUI_INTERNAL_API_KEY is not configured");
  const url = new URL("/api/internal/invites", MARKET_ORIGIN[market]);
  url.searchParams.set("creatorId", creatorId);
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20_000),
    headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`VibeUI stats API ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return response.json() as Promise<CreatorStats>;
}

// referral_metrics keeps one amount; the creator's market currency goes there, all currencies stay in raw_data.
export function marketRevenue(stats: CreatorStats, market: "ru" | "en") {
  const row = stats.revenue.find((item) => item.currency === (market === "ru" ? "RUB" : "USD"));
  return { revenue: row?.amount ?? 0, commission: row?.commission ?? 0 };
}
