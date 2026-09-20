// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "slider-001": dynamic(() =>
    import("@/registry/components/slider/slider-001/slider-001").then((module) => module.Slider001),
  ),
  "slider-002": dynamic(() =>
    import("@/registry/components/slider/slider-002/slider-002").then((module) => module.Slider002),
  ),
  "slider-003": dynamic(() =>
    import("@/registry/components/slider/slider-003/slider-003").then((module) => module.Slider003),
  ),
  "slider-004": dynamic(() =>
    import("@/registry/components/slider/slider-004/slider-004").then((module) => module.Slider004),
  ),
  "slider-005": dynamic(() =>
    import("@/registry/components/slider/slider-005/slider-005").then((module) => module.Slider005),
  ),
  "slider-006": dynamic(() =>
    import("@/registry/components/slider/slider-006/slider-006").then((module) => module.Slider006),
  ),
  "slider-007": dynamic(() =>
    import("@/registry/components/slider/slider-007/slider-007").then((module) => module.Slider007),
  ),
  "slider-008": dynamic(() =>
    import("@/registry/components/slider/slider-008/slider-008").then((module) => module.Slider008),
  ),
  "slider-009": dynamic(() =>
    import("@/registry/components/slider/slider-009/slider-009").then((module) => module.Slider009),
  ),
  "slider-010": dynamic(() =>
    import("@/registry/components/slider/slider-010/slider-010").then((module) => module.Slider010),
  ),
  "slider-011": dynamic(() =>
    import("@/registry/components/slider/slider-011/slider-011").then((module) => module.Slider011),
  ),
  "slider-012": dynamic(() =>
    import("@/registry/components/slider/slider-012/slider-012").then((module) => module.Slider012),
  ),
  "range-001": dynamic(() =>
    import("@/registry/components/slider/range-001/range-001").then((module) => module.Range001),
  ),
  "range-002": dynamic(() =>
    import("@/registry/components/slider/range-002/range-002").then((module) => module.Range002),
  ),
  "range-003": dynamic(() =>
    import("@/registry/components/slider/range-003/range-003").then((module) => module.Range003),
  ),
  "range-004": dynamic(() =>
    import("@/registry/components/slider/range-004/range-004").then((module) => module.Range004),
  ),
  "range-005": dynamic(() =>
    import("@/registry/components/slider/range-005/range-005").then((module) => module.Range005),
  ),
  "range-006": dynamic(() =>
    import("@/registry/components/slider/range-006/range-006").then((module) => module.Range006),
  ),
  "range-007": dynamic(() =>
    import("@/registry/components/slider/range-007/range-007").then((module) => module.Range007),
  ),
} satisfies PreviewMap
