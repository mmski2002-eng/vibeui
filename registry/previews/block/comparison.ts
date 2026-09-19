// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "comparison-001": () =>
    import("@/registry/blocks/comparison/comparison-001/comparison-001").then((module) => module.Comparison001),
  "comparison-002": () =>
    import("@/registry/blocks/comparison/comparison-002/comparison-002").then((module) => module.Comparison002),
  "comparison-003": () =>
    import("@/registry/blocks/comparison/comparison-003/comparison-003").then((module) => module.Comparison003),
  "comparison-004": () =>
    import("@/registry/blocks/comparison/comparison-004/comparison-004").then((module) => module.Comparison004),
  "comparison-005": () =>
    import("@/registry/blocks/comparison/comparison-005/comparison-005").then((module) => module.Comparison005),
  "comparison-006": () =>
    import("@/registry/blocks/comparison/comparison-006/comparison-006").then((module) => module.Comparison006),
  "comparison-010": () =>
    import("@/registry/blocks/comparison/comparison-010/comparison-010").then((module) => module.Comparison010),
  "comparison-015": () =>
    import("@/registry/blocks/comparison/comparison-015/comparison-015").then((module) => module.Comparison015),
  "comparison-016": () =>
    import("@/registry/blocks/comparison/comparison-016/comparison-016").then((module) => module.Comparison016),
} satisfies PreviewLoaderMap
