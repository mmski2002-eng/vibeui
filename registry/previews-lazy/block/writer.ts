// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "writer-001": dynamic(() =>
    import("@/registry/blocks/writer/writer-001/writer-001").then((module) => module.Writer001),
  ),
  "writer-002": dynamic(() =>
    import("@/registry/blocks/writer/writer-002/writer-002").then((module) => module.Writer002),
  ),
  "writer-003": dynamic(() =>
    import("@/registry/blocks/writer/writer-003/writer-003").then((module) => module.Writer003),
  ),
  "writer-004": dynamic(() =>
    import("@/registry/blocks/writer/writer-004/writer-004").then((module) => module.Writer004),
  ),
} satisfies PreviewMap
