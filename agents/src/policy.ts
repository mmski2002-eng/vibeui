import { readFile } from "node:fs/promises";
import { z } from "zod";

const platformSchema = z.enum([
  "telegram", "youtube", "vk", "dzen", "habr", "vc", "rutube",
  "newsletter", "podcast", "website", "x", "tiktok", "linkedin",
  "instagram", "devto", "hashnode", "medium", "producthunt",
]);

export const policySchema = z.object({
  version: z.number().int().positive(),
  outreachEnabled: z.boolean(),
  minimumAutomaticScore: z.number().int().min(0).max(100),
  dailyContactLimit: z.number().int().nonnegative(),
  maximumFollowUps: z.number().int().nonnegative(),
  followUpDelayDays: z.number().int().positive(),
  secondFollowUpDelayDays: z.number().int().positive(),
  allowedPlatforms: z.object({
    ru: z.array(platformSchema),
    en: z.array(platformSchema),
  }),
  requirePublicBusinessContact: z.boolean(),
  requireHumanApprovalFor: z.array(z.enum([
    "first_contact", "payment_offer", "contract", "referral_activation",
  ])),
  blockedContactDomains: z.array(z.string().min(1)),
  monthlyModelBudgetUsd: z.number().nonnegative(),
  monthlyOutreachBudgetUsd: z.number().nonnegative(),
});

export type Policy = z.infer<typeof policySchema>;
export type Platform = z.infer<typeof platformSchema>;

export async function loadPolicy(path: string): Promise<Policy> {
  const content = await readFile(path, "utf8");
  return policySchema.parse(JSON.parse(content));
}
