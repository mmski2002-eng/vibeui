export class VibeUiClient {
  constructor(private readonly baseUrl: string, private readonly apiKey: string) {}

  async createPartner(input: { creatorId: string; email: string; displayName: string }, idempotencyKey: string) {
    return this.request<{ id: string }>("POST", "/api/internal/partners", input, idempotencyKey);
  }
  async issuePromo(partnerId: string, input: { preferredCode?: string }, idempotencyKey: string) {
    return this.request<{ referralCode: string; referralUrl: string; promoCode: string }>("POST", `/api/internal/partners/${encodeURIComponent(partnerId)}/promo`, input, idempotencyKey);
  }
  async grantAccess(partnerId: string, idempotencyKey: string) {
    return this.request<{ active: boolean }>("POST", `/api/internal/partners/${encodeURIComponent(partnerId)}/access`, {}, idempotencyKey);
  }
  async stats(partnerId: string) {
    return this.request<Record<string, unknown>>("GET", `/api/internal/partners/${encodeURIComponent(partnerId)}/stats`);
  }
  private async request<T>(method: string, path: string, body?: unknown, idempotencyKey?: string): Promise<T> {
    if (!this.baseUrl || !this.apiKey) throw new Error("VibeUI internal API is not configured");
    const response = await fetch(new URL(path, this.baseUrl), {
      method, signal: AbortSignal.timeout(20_000),
      headers: { authorization: `Bearer ${this.apiKey}`, accept: "application/json", ...(body ? { "content-type": "application/json" } : {}), ...(idempotencyKey ? { "idempotency-key": idempotencyKey } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) throw new Error(`VibeUI internal API ${response.status}: ${(await response.text()).slice(0, 500)}`);
    return response.json() as Promise<T>;
  }
}

// Each market is a separate VibeUI instance with its own accounts, so the invite is created on the creator's domain.
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
