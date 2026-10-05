import { OpenAIProvider, setDefaultModelProvider, setTracingDisabled } from "@openai/agents";
import type { Config } from "./config.js";

export function configureModelProvider(config: Config): void {
  if (!config.openRouterApiKey) return;
  setDefaultModelProvider(new OpenAIProvider({
    apiKey: config.openRouterApiKey,
    baseURL: config.openRouterBaseUrl,
    useResponses: false,
  }));
  setTracingDisabled(true);
}
