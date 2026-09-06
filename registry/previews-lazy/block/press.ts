// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "pres-001": dynamic(() =>
    import("@/registry/blocks/press/pres-001/pres-001").then((module) => module.Pres001),
  ),
  "pres-002": dynamic(() =>
    import("@/registry/blocks/press/pres-002/pres-002").then((module) => module.Pres002),
  ),
  "pres-003": dynamic(() =>
    import("@/registry/blocks/press/pres-003/pres-003").then((module) => module.Pres003),
  ),
} satisfies PreviewMap
