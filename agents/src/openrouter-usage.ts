import type { Config } from "./config.js";

let cache: { at: number; usage: number | null } | null = null;

// Our cost is estimated from a price table; OpenRouter bills the real amount (about 15% more on 2026-10-09).
// The total cap therefore takes whichever is higher, so the estimate can never let real spend run past it.
export async function billedUsage(config: Pick<Config, "openRouterApiKey" | "openRouterBaseUrl">): Promise<number | null> {
  if (!config.openRouterApiKey) return null;
  if (cache && Date.now() - cache.at < 10 * 60_000) return cache.usage;
  let usage: number | null = null;
  try {
    const response = await fetch(`${config.openRouterBaseUrl}/key`, {
      headers: { authorization: `Bearer ${config.openRouterApiKey}` }, signal: AbortSignal.timeout(5_000),
    });
    if (response.ok) usage = ((await response.json()) as { data?: { usage?: number } }).data?.usage ?? null;
  } catch {
    usage = null;
  }
  cache = { at: Date.now(), usage };
  return usage;
}
