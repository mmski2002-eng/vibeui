// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "charity-001": dynamic(() =>
    import("@/registry/blocks/charity/charity-001/charity-001").then((module) => module.Charity001),
  ),
  "charity-002": dynamic(() =>
    import("@/registry/blocks/charity/charity-002/charity-002").then((module) => module.Charity002),
  ),
  "charity-003": dynamic(() =>
    import("@/registry/blocks/charity/charity-003/charity-003").then((module) => module.Charity003),
  ),
  "charity-004": dynamic(() =>
    import("@/registry/blocks/charity/charity-004/charity-004").then((module) => module.Charity004),
  ),
  "charity-005": dynamic(() =>
    import("@/registry/blocks/charity/charity-005/charity-005").then((module) => module.Charity005),
  ),
} satisfies PreviewMap
