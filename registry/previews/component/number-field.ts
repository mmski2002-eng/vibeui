// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "number-001": () =>
    import("@/registry/components/number-field/number-001/number-001").then((module) => module.Number001),
  "number-002": () =>
    import("@/registry/components/number-field/number-002/number-002").then((module) => module.Number002),
  "number-003": () =>
    import("@/registry/components/number-field/number-003/number-003").then((module) => module.Number003),
  "number-004": () =>
    import("@/registry/components/number-field/number-004/number-004").then((module) => module.Number004),
  "number-005": () =>
    import("@/registry/components/number-field/number-005/number-005").then((module) => module.Number005),
  "number-006": () =>
    import("@/registry/components/number-field/number-006/number-006").then((module) => module.Number006),
  "number-007": () =>
    import("@/registry/components/number-field/number-007/number-007").then((module) => module.Number007),
  "number-008": () =>
    import("@/registry/components/number-field/number-008/number-008").then((module) => module.Number008),
  "number-009": () =>
    import("@/registry/components/number-field/number-009/number-009").then((module) => module.Number009),
} satisfies PreviewLoaderMap
