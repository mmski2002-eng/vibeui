// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "tags-001": () =>
    import("@/registry/components/tags-input/tags-001/tags-001").then((module) => module.Tags001),
  "tags-002": () =>
    import("@/registry/components/tags-input/tags-002/tags-002").then((module) => module.Tags002),
  "tags-003": () =>
    import("@/registry/components/tags-input/tags-003/tags-003").then((module) => module.Tags003),
  "tags-004": () =>
    import("@/registry/components/tags-input/tags-004/tags-004").then((module) => module.Tags004),
  "tags-005": () =>
    import("@/registry/components/tags-input/tags-005/tags-005").then((module) => module.Tags005),
  "tags-006": () =>
    import("@/registry/components/tags-input/tags-006/tags-006").then((module) => module.Tags006),
  "tags-007": () =>
    import("@/registry/components/tags-input/tags-007/tags-007").then((module) => module.Tags007),
  "tags-008": () =>
    import("@/registry/components/tags-input/tags-008/tags-008").then((module) => module.Tags008),
  "tags-009": () =>
    import("@/registry/components/tags-input/tags-009/tags-009").then((module) => module.Tags009),
  "tags-010": () =>
    import("@/registry/components/tags-input/tags-010/tags-010").then((module) => module.Tags010),
} satisfies PreviewLoaderMap
