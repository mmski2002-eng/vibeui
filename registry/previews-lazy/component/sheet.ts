// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "sheet-001": dynamic(() =>
    import("@/registry/components/sheet/sheet-001/sheet-001").then((module) => module.Sheet001),
  ),
  "sheet-002": dynamic(() =>
    import("@/registry/components/sheet/sheet-002/sheet-002").then((module) => module.Sheet002),
  ),
  "sheet-003": dynamic(() =>
    import("@/registry/components/sheet/sheet-003/sheet-003").then((module) => module.Sheet003),
  ),
  "sheet-004": dynamic(() =>
    import("@/registry/components/sheet/sheet-004/sheet-004").then((module) => module.Sheet004),
  ),
  "sheet-005": dynamic(() =>
    import("@/registry/components/sheet/sheet-005/sheet-005").then((module) => module.Sheet005),
  ),
  "sheet-006": dynamic(() =>
    import("@/registry/components/sheet/sheet-006/sheet-006").then((module) => module.Sheet006),
  ),
  "sheet-007": dynamic(() =>
    import("@/registry/components/sheet/sheet-007/sheet-007").then((module) => module.Sheet007),
  ),
  "sheet-008": dynamic(() =>
    import("@/registry/components/sheet/sheet-008/sheet-008").then((module) => module.Sheet008),
  ),
  "sheet-009": dynamic(() =>
    import("@/registry/components/sheet/sheet-009/sheet-009").then((module) => module.Sheet009),
  ),
  "sheet-010": dynamic(() =>
    import("@/registry/components/sheet/sheet-010/sheet-010").then((module) => module.Sheet010),
  ),
} satisfies PreviewMap
