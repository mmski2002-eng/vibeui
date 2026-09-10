// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "layout-001": dynamic(() =>
    import("@/registry/blocks/layout/layout-001/layout-001").then((module) => module.Layout001),
  ),
  "layout-002": dynamic(() =>
    import("@/registry/blocks/layout/layout-002/layout-002").then((module) => module.Layout002),
  ),
  "layout-003": dynamic(() =>
    import("@/registry/blocks/layout/layout-003/layout-003").then((module) => module.Layout003),
  ),
  "layout-004": dynamic(() =>
    import("@/registry/blocks/layout/layout-004/layout-004").then((module) => module.Layout004),
  ),
  "layout-005": dynamic(() =>
    import("@/registry/blocks/layout/layout-005/layout-005").then((module) => module.Layout005),
  ),
  "layout-006": dynamic(() =>
    import("@/registry/blocks/layout/layout-006/layout-006").then((module) => module.Layout006),
  ),
  "layout-007": dynamic(() =>
    import("@/registry/blocks/layout/layout-007/layout-007").then((module) => module.Layout007),
  ),
  "layout-008": dynamic(() =>
    import("@/registry/blocks/layout/layout-008/layout-008").then((module) => module.Layout008),
  ),
  "layout-009": dynamic(() =>
    import("@/registry/blocks/layout/layout-009/layout-009").then((module) => module.Layout009),
  ),
  "layout-010": dynamic(() =>
    import("@/registry/blocks/layout/layout-010/layout-010").then((module) => module.Layout010),
  ),
  "layout-011": dynamic(() =>
    import("@/registry/blocks/layout/layout-011/layout-011").then((module) => module.Layout011),
  ),
  "layout-012": dynamic(() =>
    import("@/registry/blocks/layout/layout-012/layout-012").then((module) => module.Layout012),
  ),
  "layout-013": dynamic(() =>
    import("@/registry/blocks/layout/layout-013/layout-013").then((module) => module.Layout013),
  ),
  "layout-014": dynamic(() =>
    import("@/registry/blocks/layout/layout-014/layout-014").then((module) => module.Layout014),
  ),
  "layout-015": dynamic(() =>
    import("@/registry/blocks/layout/layout-015/layout-015").then((module) => module.Layout015),
  ),
  "layout-016": dynamic(() =>
    import("@/registry/blocks/layout/layout-016/layout-016").then((module) => module.Layout016),
  ),
  "layout-017": dynamic(() =>
    import("@/registry/blocks/layout/layout-017/layout-017").then((module) => module.Layout017),
  ),
  "layout-018": dynamic(() =>
    import("@/registry/blocks/layout/layout-018/layout-018").then((module) => module.Layout018),
  ),
  "layout-019": dynamic(() =>
    import("@/registry/blocks/layout/layout-019/layout-019").then((module) => module.Layout019),
  ),
} satisfies PreviewMap
