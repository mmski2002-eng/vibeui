// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "layout-001": () =>
    import("@/registry/blocks/layout/layout-001/layout-001").then((module) => module.Layout001),
  "layout-002": () =>
    import("@/registry/blocks/layout/layout-002/layout-002").then((module) => module.Layout002),
  "layout-003": () =>
    import("@/registry/blocks/layout/layout-003/layout-003").then((module) => module.Layout003),
  "layout-004": () =>
    import("@/registry/blocks/layout/layout-004/layout-004").then((module) => module.Layout004),
  "layout-005": () =>
    import("@/registry/blocks/layout/layout-005/layout-005").then((module) => module.Layout005),
  "layout-006": () =>
    import("@/registry/blocks/layout/layout-006/layout-006").then((module) => module.Layout006),
  "layout-007": () =>
    import("@/registry/blocks/layout/layout-007/layout-007").then((module) => module.Layout007),
  "layout-008": () =>
    import("@/registry/blocks/layout/layout-008/layout-008").then((module) => module.Layout008),
  "layout-009": () =>
    import("@/registry/blocks/layout/layout-009/layout-009").then((module) => module.Layout009),
  "layout-010": () =>
    import("@/registry/blocks/layout/layout-010/layout-010").then((module) => module.Layout010),
  "layout-012": () =>
    import("@/registry/blocks/layout/layout-012/layout-012").then((module) => module.Layout012),
  "layout-014": () =>
    import("@/registry/blocks/layout/layout-014/layout-014").then((module) => module.Layout014),
  "layout-015": () =>
    import("@/registry/blocks/layout/layout-015/layout-015").then((module) => module.Layout015),
  "layout-016": () =>
    import("@/registry/blocks/layout/layout-016/layout-016").then((module) => module.Layout016),
} satisfies PreviewLoaderMap
