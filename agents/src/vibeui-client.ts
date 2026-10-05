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
