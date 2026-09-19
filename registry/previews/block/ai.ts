// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "ai-001": () =>
    import("@/registry/blocks/ai/ai-001/ai-001").then((module) => module.Ai001),
  "ai-002": () =>
    import("@/registry/blocks/ai/ai-002/ai-002").then((module) => module.Ai002),
} satisfies PreviewLoaderMap
