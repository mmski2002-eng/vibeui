// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "not-found-001": () =>
    import("@/registry/blocks/not-found/not-found-001/not-found-001").then((module) => module.NotFound001),
  "not-found-002": () =>
    import("@/registry/blocks/not-found/not-found-002/not-found-002").then((module) => module.NotFound002),
  "not-found-003": () =>
    import("@/registry/blocks/not-found/not-found-003/not-found-003").then((module) => module.NotFound003),
  "not-found-004": () =>
    import("@/registry/blocks/not-found/not-found-004/not-found-004").then((module) => module.NotFound004),
  "not-found-005": () =>
    import("@/registry/blocks/not-found/not-found-005/not-found-005").then((module) => module.NotFound005),
  "not-found-006": () =>
    import("@/registry/blocks/not-found/not-found-006/not-found-006").then((module) => module.NotFound006),
  "not-found-007": () =>
    import("@/registry/blocks/not-found/not-found-007/not-found-007").then((module) => module.NotFound007),
  "not-found-008": () =>
    import("@/registry/blocks/not-found/not-found-008/not-found-008").then((module) => module.NotFound008),
  "not-found-009": () =>
    import("@/registry/blocks/not-found/not-found-009/not-found-009").then((module) => module.NotFound009),
  "not-found-010": () =>
    import("@/registry/blocks/not-found/not-found-010/not-found-010").then((module) => module.NotFound010),
  "not-found-011": () =>
    import("@/registry/blocks/not-found/not-found-011/not-found-011").then((module) => module.NotFound011),
} satisfies PreviewLoaderMap
