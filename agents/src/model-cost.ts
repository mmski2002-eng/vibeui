export interface TokenUsage { inputTokens: number; cachedInputTokens: number; outputTokens: number }
const pricesPerMillion: Record<string, { input: number; cached: number; output: number }> = {
  "gpt-6-luna": { input: 0.1, cached: 0.01, output: 0.5 },
  "openai/gpt-6-luna": { input: 0.1, cached: 0.01, output: 0.5 },
  "gpt-6.1-sol": { input: 2, cached: 0.1, output: 10 },
};
export function calculateModelCost(model: string, usage: TokenUsage): number {
  const price = pricesPerMillion[model];
  if (!price) return 0;
  const uncached = Math.max(0, usage.inputTokens - usage.cachedInputTokens);
  return (uncached * price.input + usage.cachedInputTokens * price.cached + usage.outputTokens * price.output) / 1_000_000;
}
export function extractUsage(usage: { inputTokens: number; outputTokens: number; inputTokensDetails: Array<Record<string, number>> }): TokenUsage {
  const cachedInputTokens = usage.inputTokensDetails.reduce((sum, item) => sum + (item.cached_tokens ?? item.cachedTokens ?? 0), 0);
  return { inputTokens: usage.inputTokens, cachedInputTokens, outputTokens: usage.outputTokens };
}
