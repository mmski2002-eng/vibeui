import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { extractUsage, ModelOutputError, type TokenUsage } from "./model-cost.js";

const scoringOutput = z.object({
  topicFit: z.number().int().min(0).max(30),
  builderAudience: z.number().int().min(0).max(20),
  realReach: z.number().int().min(0).max(15),
  engagementQuality: z.number().int().min(0).max(10),
  practicalDemos: z.number().int().min(0).max(10),
  publishingRegularity: z.number().int().min(0).max(5),
  allowedContact: z.number().int().min(0).max(5),
  moderateAdLoad: z.number().int().min(0).max(5),
  redFlags: z.array(z.string()).max(10),
  dataGaps: z.array(z.string()).max(10),
  rationale: z.string().min(1).max(1500),
  evidenceUrls: z.array(z.string().max(2048)).max(20),
});

export type ScoringOutput = z.infer<typeof scoringOutput> & { total: number; usage: TokenUsage };

interface ScoringInput {
  candidate: Record<string, unknown>;
  model: string;
  allowedEvidenceUrls?: string[];
}

export async function scoreCandidate(input: ScoringInput): Promise<ScoringOutput> {
  const agent = new Agent({
    name: "VibeUI Candidate Scorer",
    model: input.model,
    instructions: `You assess creator fit for VibeUI, a UI component library for AI-assisted coding.
Use only facts and source URLs in the supplied record. Never invent audience metrics or evidence.
Apply these maximum weights exactly: topic fit 30, builder audience 20, real reach 15,
engagement 10, practical demonstrations 10, regularity 5, allowed public business contact 5,
moderate advertising load 5.
Red flags are only concrete negative evidence that disqualifies the creator: signs of bought or fake audience,
scams or get-rich-quick promises, deceptive or unsafe content, spam, plagiarism, or a market/language mismatch.
Missing or incomplete data is never a red flag: list it in dataGaps and simply give fewer points for that criterion.
contacts lists published contacts without their values; allowedContact may score only a public business contact.
Russian-market creators must be relevant to vibeui.ru; English-market creators to vibeui.club.
VibeUI partners with individual creators. An official channel of a company, product, tool vendor, school selling courses as its main business,
media outlet or conference is a red flag ("not an individual creator"), even if its topic fits.`,
    outputType: scoringOutput,
  });

  const result = await run(agent, JSON.stringify(input.candidate));
  const usage = extractUsage(result.state.usage);
  if (!result.finalOutput) throw new ModelOutputError("Scoring agent returned no structured output", usage);
  const parsed = scoringOutput.safeParse(result.finalOutput);
  if (!parsed.success) throw new ModelOutputError(`Scoring output failed validation: ${parsed.error.message.slice(0, 500)}`, usage);
  const output = parsed.data;
  // OpenAI strict structured outputs reject `format: uri`, so URLs are checked here instead of in the schema.
  const malformed = output.evidenceUrls.filter((url) => !URL.canParse(url));
  if (malformed.length > 0) throw new ModelOutputError(`Scoring output contains malformed URLs: ${malformed.join(", ")}`, usage);
  if (input.allowedEvidenceUrls) {
    // Unsupported citations are dropped rather than failing the whole (already paid) scoring; at least one must remain.
    const allowed = new Set(input.allowedEvidenceUrls);
    output.evidenceUrls = output.evidenceUrls.filter((url) => allowed.has(url));
    if (output.evidenceUrls.length === 0) throw new ModelOutputError("Scoring output contains no supported evidence URLs", usage);
  }
  const total = output.redFlags.length > 0 ? Math.min(49, sumScore(output)) : sumScore(output);
  return { ...output, total, usage };
}

function sumScore(output: z.infer<typeof scoringOutput>): number {
  return output.topicFit + output.builderAudience + output.realReach +
    output.engagementQuality + output.practicalDemos + output.publishingRegularity +
    output.allowedContact + output.moderateAdLoad;
}
