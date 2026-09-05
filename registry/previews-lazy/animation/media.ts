// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "media-001": dynamic(() =>
    import("@/registry/animations/media/media-001/media-001").then((module) => module.Media001),
  ),
  "media-002": dynamic(() =>
    import("@/registry/animations/media/media-002/media-002").then((module) => module.Media002),
  ),
} satisfies PreviewMap
