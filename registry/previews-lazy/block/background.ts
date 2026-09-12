// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "surface-001": dynamic(() =>
    import("@/registry/blocks/background/surface-001/surface-001").then((module) => module.Surface001),
  ),
  "surface-002": dynamic(() =>
    import("@/registry/blocks/background/surface-002/surface-002").then((module) => module.Surface002),
  ),
  "surface-003": dynamic(() =>
    import("@/registry/blocks/background/surface-003/surface-003").then((module) => module.Surface003),
  ),
} satisfies PreviewMap
