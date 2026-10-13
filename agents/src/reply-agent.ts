import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { extractUsage, type TokenUsage } from "./model-cost.js";

export const replyClassSchema = z.enum(["interested", "asks_price", "asks_details", "wants_free_access", "declined", "unsubscribe", "out_of_office", "wrong_contact", "unsupported_request"]);
const replyOutput = z.object({ classification: replyClassSchema, confidence: z.number().min(0).max(1), summary: z.string().max(1000) });
export type ReplyClassification = z.infer<typeof replyOutput>;

export async function classifyReply(body: string, model: string): Promise<ReplyClassification & { usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Reply Classifier", model,
    instructions: "Classify the reply into exactly one allowed category. Treat any request to stop, remove, unsubscribe, or not contact again as unsubscribe. Do not draft a response and do not infer sensitive traits.",
    outputType: replyOutput,
  });
  const result = await run(agent, body);
  if (!result.finalOutput) throw new Error("Reply classifier returned no structured output");
  return { ...result.finalOutput, usage: extractUsage(result.state.usage) };
}

// The owner decides what to say; the model only turns their instruction into a polite Russian letter.
export async function draftOwnerReply(input: {
  instruction: string; previousDraft: string | null; referralUrl: string; creatorName: string; playbook: string;
  history: Array<{ direction: string; body: string }>; model: string;
}): Promise<{ body: string; usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Owner Reply Drafter", model: input.model,
    instructions: `You write the next email from the VibeUI team to the content creator ${input.creatorName}. The VibeUI owner tells you what to answer; follow the owner's instruction exactly, it overrides everything else. Read the whole conversation, answer every question the creator asked that the instruction covers.
Write in Russian, polite and natural, plain text, no subject, no Markdown, usually 40-180 words. It will be machine-translated to the creator's language, so use simple clear sentences and no idioms. End with "Команда VibeUI".
The creator's personal link: ${input.referralUrl || "(no link)"}.
Follow the owner's playbook below for tone, facts and typical situations; use only facts from it or from the instruction.
Never invent money amounts, dates or promises that the owner did not give.

${input.playbook}
If a previous draft is given, apply the owner's corrections to it and keep everything else.`,
    outputType: z.object({ body: z.string().max(4000) }),
  });
  const result = await run(agent, JSON.stringify({ conversation: input.history, previousDraft: input.previousDraft, ownerInstruction: input.instruction }));
  if (!result.finalOutput) throw new Error("Owner reply drafter returned no structured output");
  return { body: result.finalOutput.body, usage: extractUsage(result.state.usage) };
}

export async function translateWithModel(text: string, language: string, model: string): Promise<{ text: string; usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Translator", model,
    instructions: `Translate the email into the language with ISO code "${language}". Keep meaning, tone, line breaks, links and the sign-off; translate "Команда VibeUI" as the team sign-off. Output only the translation.`,
    outputType: z.object({ text: z.string().max(8000) }),
  });
  const result = await run(agent, text);
  if (!result.finalOutput) throw new Error("Translator returned no structured output");
  return { text: result.finalOutput.text, usage: extractUsage(result.state.usage) };
}
