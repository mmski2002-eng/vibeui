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

const replyDraftOutput = z.object({
  needsHuman: z.boolean(),
  reason: z.string().max(500),
  body: z.string().max(3000),
});

export async function draftReply(input: {
  market: "ru" | "en"; classification: string; referralUrl: string;
  history: Array<{ direction: string; body: string }>; model: string;
}): Promise<z.infer<typeof replyDraftOutput> & { usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Reply Drafter", model: input.model,
    instructions: `You draft the next email from the VibeUI team to a content creator who replied to our outreach. Write in ${input.market === "ru" ? "Russian, formal «вы»" : "English"}, plain text, 40-150 words, no subject, no Markdown.

Facts you may use and nothing else:
- VibeUI is a catalog of ready UI blocks and whole-page scenarios for vibe coding; the "Copy for AI" button makes an AI coding agent install the real component file instead of improvising one.
- Their personal link gives a free month of VibeUI Pro on sign-up: ${input.referralUrl}
- After sign-up the same link is their partner link: viewers get 30% off their first payment, the creator earns 25% of all payments from people they bring. Payouts are requested from their partner account.
- Prices: ${input.market === "ru" ? "690 ₽ a month or 5 900 ₽ a year" : "$9 a month or $69 a year"}.

Answer exactly what they asked, warmly and briefly; repeat the link only if useful. End with the sign-off "${input.market === "ru" ? "Команда VibeUI" : "The VibeUI team"}".
Set needsHuman=true and leave body empty when they ask for anything outside these facts: a paid integration or fixed fee, a different commission, a contract or invoice, legal or tax questions, technical details the facts do not cover, or anything you are unsure about. Never promise money, dates, features or exclusivity.`,
    outputType: replyDraftOutput,
  });
  const result = await run(agent, JSON.stringify({ classification: input.classification, conversation: input.history }));
  if (!result.finalOutput) throw new Error("Reply drafter returned no structured output");
  return { ...result.finalOutput, usage: extractUsage(result.state.usage) };
}

// The owner decides what to say; the model only turns their instruction into a polite Russian letter.
export async function draftOwnerReply(input: {
  instruction: string; previousDraft: string | null; referralUrl: string; creatorName: string;
  history: Array<{ direction: string; body: string }>; model: string;
}): Promise<{ body: string; usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Owner Reply Drafter", model: input.model,
    instructions: `You write the next email from the VibeUI team to the content creator ${input.creatorName}. The VibeUI owner tells you what to answer; follow the owner's instruction exactly, it overrides everything else. Read the whole conversation, answer every question the creator asked that the instruction covers.
Write in Russian, polite and natural, plain text, no subject, no Markdown, usually 40-180 words. It will be machine-translated to the creator's language, so use simple clear sentences and no idioms. End with "Команда VibeUI".
Background you may use: VibeUI is a catalog of ready UI blocks and whole-page scenarios for vibe coding; "Copy for AI" makes an AI coding agent install the real component file. The creator's personal link gives a free month of Pro: ${input.referralUrl || "(no link)"}. Partners get 25% of payments from people they bring, viewers get 30% off the first payment.
Never invent money amounts, dates or promises that the owner did not give.
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
