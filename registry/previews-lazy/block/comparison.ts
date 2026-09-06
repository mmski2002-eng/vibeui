// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "comparison-001": dynamic(() =>
    import("@/registry/blocks/comparison/comparison-001/comparison-001").then((module) => module.Comparison001),
  ),
  "comparison-002": dynamic(() =>
    import("@/registry/blocks/comparison/comparison-002/comparison-002").then((module) => module.Comparison002),
  ),
  "comparison-003": dynamic(() =>
    import("@/registry/blocks/comparison/comparison-003/comparison-003").then((module) => module.Comparison003),
  ),
} satisfies PreviewMap
