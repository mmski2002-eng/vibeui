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
    instructions: `Write one first-contact ${input.channel === "telegram" ? "Telegram direct message" : "email"} in ${input.market === "ru" ? "Russian" : "English"}. The owner wrote this message; reproduce it almost word for word:

${input.market === "ru"
  ? "Добрый день! Предлагаю сотрудничество: прорекламировать мой продукт — сайт UI-компонентов vibeui.ru. Ваша выгода — процент от продаж подписки на сервис. Если интересно, пишите."
  : "Hi! I'd like to offer a partnership: promoting my product — vibeui.club, a site of UI components. Your benefit is a percentage of subscription sales. If interested, please reply."}

Change at most one or two words or short phrases with natural synonyms (for example a different greeting or a different "if interested" phrase) so that messages to different people are not identical. Keep the meaning, the length, the order and the domain exactly. Add nothing else: no compliments, no product description, no links, no numbers, no Pro month, no questions, no emoji.
The message is plain text, no Markdown.
${input.channel === "email" ? `End with the sign-off line "${signOff(input)}" and nothing after it. Subject: short and plain, for example "${input.market === "ru" ? "Сотрудничество с VibeUI" : "Partnership with VibeUI"}".` : "No signature line; subject is only an internal label."}
For "facts" and "chosenPostUrl" use any one supplied publication URL; they are internal only.`,
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
  if (output.body.includes(input.referralUrl)) throw new ModelOutputError("The first message must not contain the referral link", usage);
  if (input.market === "ru" && /(^|[^а-яё])(ты|тебе|тебя|твой|твоей|твоя|попробуй|напиши|ответь)([^а-яё]|$)/i.test(output.body)) throw new ModelOutputError("Russian outreach must use the formal «вы»", usage);
  if (unsupported.length > 0) throw new ModelOutputError(`Personalization cited unsupported URLs: ${unsupported.join(", ")}`, usage);
  return { ...output, usage };
}
