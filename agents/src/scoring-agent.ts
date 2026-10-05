import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { extractUsage, type TokenUsage } from "./model-cost.js";

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
moderate advertising load 5. Add a red flag when evidence is missing or suspicious.
Russian-market creators must be relevant to vibeui.ru; English-market creators to vibeui.club.`,
    outputType: scoringOutput,
  });

  const result = await run(agent, JSON.stringify(input.candidate));
  if (!result.finalOutput) throw new Error("Scoring agent returned no structured output");
  const output = scoringOutput.parse(result.finalOutput);
  // OpenAI strict structured outputs reject `format: uri`, so URLs are checked here instead of in the schema.
  const malformed = output.evidenceUrls.filter((url) => !URL.canParse(url));
  if (malformed.length > 0) throw new Error(`Scoring output contains malformed URLs: ${malformed.join(", ")}`);
  if (input.allowedEvidenceUrls) {
    const allowed = new Set(input.allowedEvidenceUrls);
    const unsupported = output.evidenceUrls.filter((url) => !allowed.has(url));
    if (unsupported.length > 0) throw new Error(`Scoring output cited unsupported evidence: ${unsupported.join(", ")}`);
    if (output.evidenceUrls.length === 0) throw new Error("Scoring output contains no evidence URLs");
  }
  const total = output.redFlags.length > 0 ? Math.min(49, sumScore(output)) : sumScore(output);
  return { ...output, total, usage: extractUsage(result.state.usage) };
}

function sumScore(output: z.infer<typeof scoringOutput>): number {
  return output.topicFit + output.builderAudience + output.realReach +
    output.engagementQuality + output.practicalDemos + output.publishingRegularity +
    output.allowedContact + output.moderateAdLoad;
}
