// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "surface-001": dynamic(() =>
    import("@/registry/blocks/background/surface-001/surface-001").then((module) => module.Surface001),
  ),
  "surface-002": dynamic(() =>
    import("@/registry/blocks/background/surface-002/surface-002").then((module) => module.Surface002),
  ),
  "surface-003": dynamic(() =>
    import("@/registry/blocks/background/surface-003/surface-003").then((module) => module.Surface003),
  ),
  "surface-004": dynamic(() =>
    import("@/registry/blocks/background/surface-004/surface-004").then((module) => module.Surface004),
  ),
  "surface-005": dynamic(() =>
    import("@/registry/blocks/background/surface-005/surface-005").then((module) => module.Surface005),
  ),
  "surface-006": dynamic(() =>
    import("@/registry/blocks/background/surface-006/surface-006").then((module) => module.Surface006),
  ),
  "surface-007": dynamic(() =>
    import("@/registry/blocks/background/surface-007/surface-007").then((module) => module.Surface007),
  ),
  "surface-008": dynamic(() =>
    import("@/registry/blocks/background/surface-008/surface-008").then((module) => module.Surface008),
  ),
  "surface-009": dynamic(() =>
    import("@/registry/blocks/background/surface-009/surface-009").then((module) => module.Surface009),
  ),
  "surface-010": dynamic(() =>
    import("@/registry/blocks/background/surface-010/surface-010").then((module) => module.Surface010),
  ),
  "surface-011": dynamic(() =>
    import("@/registry/blocks/background/surface-011/surface-011").then((module) => module.Surface011),
  ),
  "surface-012": dynamic(() =>
    import("@/registry/blocks/background/surface-012/surface-012").then((module) => module.Surface012),
  ),
  "surface-013": dynamic(() =>
    import("@/registry/blocks/background/surface-013/surface-013").then((module) => module.Surface013),
  ),
  "surface-014": dynamic(() =>
    import("@/registry/blocks/background/surface-014/surface-014").then((module) => module.Surface014),
  ),
} satisfies PreviewMap
