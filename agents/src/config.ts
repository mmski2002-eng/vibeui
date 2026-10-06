import { resolve } from "node:path";

function integer(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be an integer`);
  return parsed;
}

function decimal(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative number`);
  return parsed;
}

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig() {
  const openRouterApiKey = process.env.OPENROUTER_API_KEY ?? "";
  return {
    databaseUrl: process.env.DATABASE_URL ?? "",
    scoringModel: process.env.OPENAI_SCORING_MODEL ?? (openRouterApiKey ? "openai/gpt-6-luna" : "gpt-6-luna"),
    generationModel: process.env.OPENAI_GENERATION_MODEL ?? (openRouterApiKey ? "openai/gpt-6-luna" : "gpt-6.1-sol"),
    openRouterApiKey,
    openRouterBaseUrl: process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
    hardModelBudgetUsd: decimal("HARD_MODEL_BUDGET_USD", 0.8),
    youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
    vkServiceToken: process.env.VK_SERVICE_TOKEN ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
    outreachEmailFrom: process.env.OUTREACH_EMAIL_FROM ?? "",
    gmailUser: process.env.GMAIL_USER ?? "",
    gmailAppPassword: (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, ""),
    outreachSenderName: process.env.OUTREACH_SENDER_NAME ?? "",
    inboxPollMs: integer("INBOX_POLL_MS", 120_000),
    vibeuiInternalApiUrl: process.env.VIBEUI_INTERNAL_API_URL ?? "",
    vibeuiInternalApiKey: process.env.VIBEUI_INTERNAL_API_KEY ?? "",
    adminHost: process.env.ADMIN_HOST ?? "127.0.0.1",
    adminPort: integer("ADMIN_PORT", 4310),
    adminUsername: process.env.ADMIN_USERNAME ?? "admin",
    adminPassword: process.env.ADMIN_PASSWORD ?? "",
    workerPollMs: integer("WORKER_POLL_MS", 3_000),
    policyPath: resolve(process.cwd(), process.env.POLICY_PATH ?? "policy/default-policy.json"),
  };
}

export function requireDatabaseUrl(config: Config): string {
  if (!config.databaseUrl) throw new Error("DATABASE_URL is required");
  return config.databaseUrl;
}
