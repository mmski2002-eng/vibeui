// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "pricing-001": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-001/pricing-001").then((module) => module.Pricing001),
  ),
  "pricing-002": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-002/pricing-002").then((module) => module.Pricing002),
  ),
  "pricing-003": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-003/pricing-003").then((module) => module.Pricing003),
  ),
  "pricing-004": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-004/pricing-004").then((module) => module.Pricing004),
  ),
  "pricing-005": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-005/pricing-005").then((module) => module.Pricing005),
  ),
  "pricing-006": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-006/pricing-006").then((module) => module.Pricing006),
  ),
  "pricing-007": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-007/pricing-007").then((module) => module.Pricing007),
  ),
  "pricing-008": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-008/pricing-008").then((module) => module.Pricing008),
  ),
  "pricing-009": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-009/pricing-009").then((module) => module.Pricing009),
  ),
  "pricing-010": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-010/pricing-010").then((module) => module.Pricing010),
  ),
  "pricing-011": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-011/pricing-011").then((module) => module.Pricing011),
  ),
  "pricing-012": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-012/pricing-012").then((module) => module.Pricing012),
  ),
  "pricing-013": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-013/pricing-013").then((module) => module.Pricing013),
  ),
  "pricing-014": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-014/pricing-014").then((module) => module.Pricing014),
  ),
  "pricing-015": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-015/pricing-015").then((module) => module.Pricing015),
  ),
  "pricing-016": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-016/pricing-016").then((module) => module.Pricing016),
  ),
  "pricing-018": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-018/pricing-018").then((module) => module.Pricing018),
  ),
  "pricing-019": dynamic(() =>
    import("@/registry/blocks/pricing/pricing-019/pricing-019").then((module) => module.Pricing019),
  ),
} satisfies PreviewMap
