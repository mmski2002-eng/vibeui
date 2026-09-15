// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "flip-001": dynamic(() =>
    import("@/registry/animations/cards/flip-001/flip-001").then((module) => module.Flip001),
  ),
  "flip-002": dynamic(() =>
    import("@/registry/animations/cards/flip-002/flip-002").then((module) => module.Flip002),
  ),
} satisfies PreviewMap
