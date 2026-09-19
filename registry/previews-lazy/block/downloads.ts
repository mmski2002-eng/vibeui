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
  "download-004": dynamic(() =>
    import("@/registry/blocks/downloads/download-004/download-004").then((module) => module.Download004),
  ),
  "download-005": dynamic(() =>
    import("@/registry/blocks/downloads/download-005/download-005").then((module) => module.Download005),
  ),
  "download-006": dynamic(() =>
    import("@/registry/blocks/downloads/download-006/download-006").then((module) => module.Download006),
  ),
  "download-011": dynamic(() =>
    import("@/registry/blocks/downloads/download-011/download-011").then((module) => module.Download011),
  ),
  "download-013": dynamic(() =>
    import("@/registry/blocks/downloads/download-013/download-013").then((module) => module.Download013),
  ),
} satisfies PreviewMap
