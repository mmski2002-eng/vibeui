import { resolve } from "node:path";

function integer(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be an integer`);
  return parsed;
}

export type Config = ReturnType<typeof loadConfig>;

export function loadConfig() {
  return {
    databaseUrl: process.env.DATABASE_URL ?? "",
    scoringModel: process.env.OPENAI_SCORING_MODEL ?? "gpt-6-luna",
    generationModel: process.env.OPENAI_GENERATION_MODEL ?? "gpt-6.1-sol",
    youtubeApiKey: process.env.YOUTUBE_API_KEY ?? "",
    resendApiKey: process.env.RESEND_API_KEY ?? "",
    resendWebhookSecret: process.env.RESEND_WEBHOOK_SECRET ?? "",
    outreachEmailFrom: process.env.OUTREACH_EMAIL_FROM ?? "",
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
