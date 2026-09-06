// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "download-001": dynamic(() =>
    import("@/registry/blocks/downloads/download-001/download-001").then((module) => module.Download001),
  ),
  "download-002": dynamic(() =>
    import("@/registry/blocks/downloads/download-002/download-002").then((module) => module.Download002),
  ),
  "download-003": dynamic(() =>
    import("@/registry/blocks/downloads/download-003/download-003").then((module) => module.Download003),
  ),
} satisfies PreviewMap
