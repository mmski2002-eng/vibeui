import { Agent, run } from "@openai/agents";
import { z } from "zod";

export const replyClassSchema = z.enum(["interested", "asks_price", "asks_details", "wants_free_access", "declined", "unsubscribe", "out_of_office", "wrong_contact", "unsupported_request"]);
const replyOutput = z.object({ classification: replyClassSchema, confidence: z.number().min(0).max(1), summary: z.string().max(1000) });
export type ReplyClassification = z.infer<typeof replyOutput>;

export async function classifyReply(body: string, model: string): Promise<ReplyClassification> {
  const agent = new Agent({
    name: "VibeUI Reply Classifier", model,
    instructions: "Classify the reply into exactly one allowed category. Treat any request to stop, remove, unsubscribe, or not contact again as unsubscribe. Do not draft a response and do not infer sensitive traits.",
    outputType: replyOutput,
  });
  const result = await run(agent, body);
  if (!result.finalOutput) throw new Error("Reply classifier returned no structured output");
  return result.finalOutput;
}
