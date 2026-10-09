import { Agent, run } from "@openai/agents";
import { z } from "zod";
import { extractUsage, ModelOutputError, type TokenUsage } from "./model-cost.js";

const outputSchema = z.object({
  subject: z.string().min(1).max(160),
  body: z.string().min(50).max(3000),
  facts: z.array(z.object({ claim: z.string().min(1).max(500), sourceUrl: z.string().max(2048) })).min(1).max(8),
  chosenPostUrl: z.string().max(2048),
});
export type PersonalizationOutput = z.infer<typeof outputSchema> & { usage: TokenUsage };

// A named person gets more replies than a team signature; the team line stays as the fallback.
function signOff(input: { market: "ru" | "en"; senderName?: string }): string {
  if (input.senderName) return `${input.senderName}, VibeUI`;
  return input.market === "ru" ? "Команда VibeUI" : "The VibeUI team";
}

export async function personalizeOutreach(input: {
  creator: Record<string, unknown>;
  posts: Array<Record<string, unknown>>;
  market: "ru" | "en";
  channel: "email" | "telegram";
  referralUrl: string;
  senderName?: string;
  model: string;
}): Promise<PersonalizationOutput> {
  const allowedUrls = new Set(input.posts.map((post) => post.url).filter((url): url is string => typeof url === "string"));
  if (allowedUrls.size === 0) throw new Error("Cannot personalize without a sourced publication");
  const agent = new Agent({
    name: "VibeUI Outreach Personalizer", model: input.model,
    instructions: `Write one first-contact ${input.channel === "telegram" ? "Telegram direct message: at most five short sentences, under 700 characters, no signature line; subject is only an internal label" : "email of 60-110 words"} in ${input.market === "ru" ? "Russian" : "English"}.

About VibeUI: a catalog of ready UI blocks and whole-page scenarios (landing sections, pricing, dashboards, forms) for vibe coding. Each block has a "Copy for AI" button: the AI coding agent installs the real component file instead of improvising a generic one, so the page looks designed on the first prompt.

Structure:
1. Open with one specific supplied publication (name it by its title, do not paste its URL: the creator knows their own video) and why it caught attention; be concrete, no flattery.
2. One sentence on how VibeUI fits what this creator shows (their stack, tools or audience), in your own words. No feature list.
3. The gift, stated explicitly in the sentence right before the link: signing up through this personal link gives a free month of VibeUI Pro. Then the link exactly as given, once, on its own line: ${input.referralUrl}
4. Only then, briefly: if they like it, the same link becomes their partner link; viewers get 30% off their first payment and the creator earns 25% of all payments from people they bring. No other numbers, no guarantees.
5. End with one easy question tied to their content that can be answered in a line (for example, whether ready sections would help in their next build). Do not ask for a video, review or post.

${input.market === "ru" ? "Russian: always address the creator formally with «вы», never «ты». Use plain Russian words instead of anglicisms like «generic» (Copy for AI stays as is). Never write «Источник:».\n" : ""}Style: sound like a person, not a template. Vary sentence openings and subject lines; never reuse the phrase "verbal description" or "component comparison". Subject: short, specific to the creator's content, no hype, no emoji.
Never invent familiarity, product functions, customers, reviews, metrics, or facts. Every factual claim about the creator must cite one supplied URL. No attachments, legal promises, or pressure.
The message is sent as plain text: no Markdown, no HTML, write links as bare URLs.
Greet the creator by first name only when a personal first name is evident; never use a channel or brand name as a name, greet neutrally instead.
${input.channel === "email" ? `End with the sign-off line "${signOff(input)}" and nothing after it.` : ""}`,
    outputType: outputSchema,
  });
  const result = await run(agent, JSON.stringify({ creator: input.creator, posts: input.posts }));
  const usage = extractUsage(result.state.usage);
  if (!result.finalOutput) throw new ModelOutputError("Personalization agent returned no structured output", usage);
  const parsed = outputSchema.safeParse(result.finalOutput);
  if (!parsed.success) throw new ModelOutputError(`Personalization output failed validation: ${parsed.error.message.slice(0, 500)}`, usage);
  const output = parsed.data;
  const citedUrls = [output.chosenPostUrl, ...output.facts.map((fact) => fact.sourceUrl)];
  const unsupported = citedUrls.filter((url) => !allowedUrls.has(url));
  if (output.body.split(input.referralUrl).length !== 2) throw new ModelOutputError("Personalization must contain the referral link exactly once", usage);
  const before = output.body.slice(0, output.body.indexOf(input.referralUrl)).toLowerCase();
  if (!/pro/.test(before.slice(-300))) throw new ModelOutputError("The free Pro month must be stated next to the referral link", usage);
  if (input.market === "ru" && /(^|[^а-яё])(ты|тебе|тебя|твой|твоей|твоя|попробуй|напиши|ответь)([^а-яё]|$)/i.test(output.body)) throw new ModelOutputError("Russian outreach must use the formal «вы»", usage);
  if (unsupported.length > 0) throw new ModelOutputError(`Personalization cited unsupported URLs: ${unsupported.join(", ")}`, usage);
  return { ...output, usage };
}
