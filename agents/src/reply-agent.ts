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

const agentReplyOutput = z.object({
  decision: z.enum(["reply", "skip", "escalate"]),
  reason: z.string().max(500),
  body: z.string().max(4000),
});
export type AgentReply = z.infer<typeof agentReplyOutput>;

// Without an owner instruction the agent decides itself whether and what to answer, strictly by the playbook.
export async function draftAgentReply(input: {
  playbook: string; referralUrl: string; creatorName: string; classification: string;
  history: Array<{ direction: string; body: string }>; model: string;
}): Promise<AgentReply & { usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Reply Agent", model: input.model,
    instructions: `You answer the last message from the content creator ${input.creatorName} on behalf of the VibeUI team. Read the whole conversation first.
Decide:
- "reply": the playbook covers it — write the answer.
- "skip": nothing to answer (a short thanks or "ok" after we already answered, auto-replies, an unsubscribe). Body empty.
- "escalate": the playbook says only the owner decides (money, contracts, taxes, complaints, anything outside the facts). Body is a short polite holding answer: thank them and say we will check and come back. Promise nothing.
Write the body in Russian, plain text, no subject, no Markdown, usually 40-150 words; it is machine-translated, so use simple sentences without idioms. End with "Команда VibeUI".
Never repeat what we already said earlier in the conversation unless asked. Never invent amounts, dates, links or conditions: use only the playbook facts. The creator's personal link: ${input.referralUrl || "(no link)"}.
The classifier labelled the last message as "${input.classification}"; trust the text over the label.

Playbook:
${input.playbook}`,
    outputType: agentReplyOutput,
  });
  const result = await run(agent, JSON.stringify({ conversation: input.history }));
  if (!result.finalOutput) throw new Error("Reply agent returned no structured output");
  return { ...result.finalOutput, usage: extractUsage(result.state.usage) };
}

const learningOutput = z.object({
  experience: z.string().min(200).max(12_000),
  changes: z.array(z.string().max(400)).max(12),
});

// Rewrites only the experience part from outcomes; the locked part is given as read-only context.
export async function learnPlaybook(input: {
  locked: string; experience: string; data: string; model: string;
}): Promise<z.infer<typeof learningOutput> & { usage: TokenUsage }> {
  const agent = new Agent({
    name: "VibeUI Playbook Learner", model: input.model,
    instructions: `You improve the "experience" part of the VibeUI playbook for talking to content creators. It is written in Russian Markdown: tone and how to answer typical situations.
You get the locked part (facts and prohibitions; you must not change or contradict it), the current experience, and the conversations of the last days with their outcomes: did the creator answer, become a partner, publish a video, bring payments, decline. Owner corrections of agent drafts are the strongest signal: they show what the owner wants.
Keep what works, fix what led to silence, declines or owner corrections, add a typical situation when a new kind of message repeated. Small careful edits; keep the structure. Do not add facts, amounts, percentages or links that are not in the locked part. If the data is too thin to conclude anything, return the experience unchanged and an empty list of changes.
"changes" lists each edit in Russian in one sentence with its reason from the data.`,
    outputType: learningOutput,
  });
  const result = await run(agent, JSON.stringify({ locked: input.locked, experience: input.experience, data: input.data }));
  if (!result.finalOutput) throw new Error("Playbook learner returned no structured output");
  return { ...result.finalOutput, usage: extractUsage(result.state.usage) };
}
