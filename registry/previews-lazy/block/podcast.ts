// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "podcast-001": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-001/podcast-001").then((module) => module.Podcast001),
  ),
  "podcast-002": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-002/podcast-002").then((module) => module.Podcast002),
  ),
  "podcast-003": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-003/podcast-003").then((module) => module.Podcast003),
  ),
} satisfies PreviewMap
