// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "cta-001": dynamic(() =>
    import("@/registry/blocks/cta/cta-001/cta-001").then((module) => module.Cta001),
  ),
  "cta-002": dynamic(() =>
    import("@/registry/blocks/cta/cta-002/cta-002").then((module) => module.Cta002),
  ),
  "cta-003": dynamic(() =>
    import("@/registry/blocks/cta/cta-003/cta-003").then((module) => module.Cta003),
  ),
  "cta-004": dynamic(() =>
    import("@/registry/blocks/cta/cta-004/cta-004").then((module) => module.Cta004),
  ),
  "cta-005": dynamic(() =>
    import("@/registry/blocks/cta/cta-005/cta-005").then((module) => module.Cta005),
  ),
  "cta-006": dynamic(() =>
    import("@/registry/blocks/cta/cta-006/cta-006").then((module) => module.Cta006),
  ),
} satisfies PreviewMap
