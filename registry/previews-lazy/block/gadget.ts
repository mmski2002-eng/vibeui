// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "gadget-001": dynamic(() =>
    import("@/registry/blocks/gadget/gadget-001/gadget-001").then((module) => module.Gadget001),
  ),
  "gadget-002": dynamic(() =>
    import("@/registry/blocks/gadget/gadget-002/gadget-002").then((module) => module.Gadget002),
  ),
  "gadget-003": dynamic(() =>
    import("@/registry/blocks/gadget/gadget-003/gadget-003").then((module) => module.Gadget003),
  ),
} satisfies PreviewMap
