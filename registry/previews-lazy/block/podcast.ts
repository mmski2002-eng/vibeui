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
  "podcast-004": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-004/podcast-004").then((module) => module.Podcast004),
  ),
  "podcast-005": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-005/podcast-005").then((module) => module.Podcast005),
  ),
  "podcast-006": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-006/podcast-006").then((module) => module.Podcast006),
  ),
  "podcast-007": dynamic(() =>
    import("@/registry/blocks/podcast/podcast-007/podcast-007").then((module) => module.Podcast007),
  ),
} satisfies PreviewMap
