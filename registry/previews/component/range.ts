// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "range-001": () =>
    import("@/registry/components/range/range-001/range-001").then((module) => module.Range001),
  "range-002": () =>
    import("@/registry/components/range/range-002/range-002").then((module) => module.Range002),
  "range-003": () =>
    import("@/registry/components/range/range-003/range-003").then((module) => module.Range003),
  "range-004": () =>
    import("@/registry/components/range/range-004/range-004").then((module) => module.Range004),
  "range-005": () =>
    import("@/registry/components/range/range-005/range-005").then((module) => module.Range005),
  "range-006": () =>
    import("@/registry/components/range/range-006/range-006").then((module) => module.Range006),
  "range-007": () =>
    import("@/registry/components/range/range-007/range-007").then((module) => module.Range007),
} satisfies PreviewLoaderMap
