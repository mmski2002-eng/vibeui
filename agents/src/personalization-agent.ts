import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { extractUsage, type TokenUsage } from "./model-cost.js";

const outputSchema = z.object({
  subject: z.string().min(1).max(160),
  body: z.string().min(50).max(3000),
  facts: z.array(z.object({ claim: z.string().min(1).max(500), sourceUrl: z.string().url() })).min(1).max(8),
  chosenPostUrl: z.string().url(),
});
export type PersonalizationOutput = z.infer<typeof outputSchema> & { usage: TokenUsage };

export async function personalizeOutreach(input: {
  creator: Record<string, unknown>;
  posts: Array<Record<string, unknown>>;
  market: "ru" | "en";
  model: string;
}): Promise<PersonalizationOutput> {
  const allowedUrls = new Set(input.posts.map((post) => post.url).filter((url): url is string => typeof url === "string"));
  if (allowedUrls.size === 0) throw new Error("Cannot personalize without a sourced publication");
  const agent = new Agent({
    name: "VibeUI Outreach Personalizer", model: input.model,
    instructions: `Write one concise first-contact email in ${input.market === "ru" ? "Russian" : "English"}.
Use exactly one supplied publication as the opening reason. VibeUI lets an AI coding agent install a real UI component file instead of recreating a generic component from a verbal description.
Suggest a concrete comparison experiment and ask whether the creator is interested. You may offer trial access, a personal referral link, audience promo code, and commission, but no fixed amount or guaranteed earnings.
Never invent familiarity, product functions, customers, reviews, metrics, or facts. Every factual claim about the creator must cite one supplied URL. No attachments, legal promises, or pressure.`,
    outputType: outputSchema,
  });
  const result = await run(agent, JSON.stringify({ creator: input.creator, posts: input.posts }));
  if (!result.finalOutput) throw new Error("Personalization agent returned no structured output");
  const output = outputSchema.parse(result.finalOutput);
  const citedUrls = [output.chosenPostUrl, ...output.facts.map((fact) => fact.sourceUrl)];
  const unsupported = citedUrls.filter((url) => !allowedUrls.has(url));
  if (unsupported.length > 0) throw new Error(`Personalization cited unsupported URLs: ${unsupported.join(", ")}`);
  return { ...output, usage: extractUsage(result.state.usage) };
}
