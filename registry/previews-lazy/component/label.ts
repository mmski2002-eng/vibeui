// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "label-001": dynamic(() =>
    import("@/registry/components/label/label-001/label-001").then((module) => module.Label001),
  ),
  "label-002": dynamic(() =>
    import("@/registry/components/label/label-002/label-002").then((module) => module.Label002),
  ),
  "label-003": dynamic(() =>
    import("@/registry/components/label/label-003/label-003").then((module) => module.Label003),
  ),
  "label-004": dynamic(() =>
    import("@/registry/components/label/label-004/label-004").then((module) => module.Label004),
  ),
  "label-005": dynamic(() =>
    import("@/registry/components/label/label-005/label-005").then((module) => module.Label005),
  ),
  "label-006": dynamic(() =>
    import("@/registry/components/label/label-006/label-006").then((module) => module.Label006),
  ),
  "label-007": dynamic(() =>
    import("@/registry/components/label/label-007/label-007").then((module) => module.Label007),
  ),
  "label-008": dynamic(() =>
    import("@/registry/components/label/label-008/label-008").then((module) => module.Label008),
  ),
  "label-009": dynamic(() =>
    import("@/registry/components/label/label-009/label-009").then((module) => module.Label009),
  ),
  "label-010": dynamic(() =>
    import("@/registry/components/label/label-010/label-010").then((module) => module.Label010),
  ),
  "label-011": dynamic(() =>
    import("@/registry/components/label/label-011/label-011").then((module) => module.Label011),
  ),
  "label-012": dynamic(() =>
    import("@/registry/components/label/label-012/label-012").then((module) => module.Label012),
  ),
  "label-013": dynamic(() =>
    import("@/registry/components/label/label-013/label-013").then((module) => module.Label013),
  ),
} satisfies PreviewMap
