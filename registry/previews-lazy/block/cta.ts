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
  "cta-007": dynamic(() =>
    import("@/registry/blocks/cta/cta-007/cta-007").then((module) => module.Cta007),
  ),
  "cta-008": dynamic(() =>
    import("@/registry/blocks/cta/cta-008/cta-008").then((module) => module.Cta008),
  ),
  "cta-009": dynamic(() =>
    import("@/registry/blocks/cta/cta-009/cta-009").then((module) => module.Cta009),
  ),
  "cta-010": dynamic(() =>
    import("@/registry/blocks/cta/cta-010/cta-010").then((module) => module.Cta010),
  ),
  "cta-011": dynamic(() =>
    import("@/registry/blocks/cta/cta-011/cta-011").then((module) => module.Cta011),
  ),
  "cta-012": dynamic(() =>
    import("@/registry/blocks/cta/cta-012/cta-012").then((module) => module.Cta012),
  ),
  "cta-013": dynamic(() =>
    import("@/registry/blocks/cta/cta-013/cta-013").then((module) => module.Cta013),
  ),
  "cta-014": dynamic(() =>
    import("@/registry/blocks/cta/cta-014/cta-014").then((module) => module.Cta014),
  ),
  "cta-015": dynamic(() =>
    import("@/registry/blocks/cta/cta-015/cta-015").then((module) => module.Cta015),
  ),
} satisfies PreviewMap
