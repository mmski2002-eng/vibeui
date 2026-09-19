// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "logocloud-001": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-001/logocloud-001").then((module) => module.Logocloud001),
  ),
  "logocloud-002": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-002/logocloud-002").then((module) => module.Logocloud002),
  ),
  "logocloud-003": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-003/logocloud-003").then((module) => module.Logocloud003),
  ),
  "logocloud-004": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-004/logocloud-004").then((module) => module.Logocloud004),
  ),
  "logocloud-005": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-005/logocloud-005").then((module) => module.Logocloud005),
  ),
  "logocloud-006": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-006/logocloud-006").then((module) => module.Logocloud006),
  ),
  "logocloud-007": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-007/logocloud-007").then((module) => module.Logocloud007),
  ),
  "logocloud-014": dynamic(() =>
    import("@/registry/blocks/logos/logocloud-014/logocloud-014").then((module) => module.Logocloud014),
  ),
} satisfies PreviewMap
