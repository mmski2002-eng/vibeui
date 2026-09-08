// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "file-001": () =>
    import("@/registry/components/file-upload/file-001/file-001").then((module) => module.File001),
  "file-002": () =>
    import("@/registry/components/file-upload/file-002/file-002").then((module) => module.File002),
  "file-003": () =>
    import("@/registry/components/file-upload/file-003/file-003").then((module) => module.File003),
  "file-006": () =>
    import("@/registry/components/file-upload/file-006/file-006").then((module) => module.File006),
  "file-007": () =>
    import("@/registry/components/file-upload/file-007/file-007").then((module) => module.File007),
  "file-008": () =>
    import("@/registry/components/file-upload/file-008/file-008").then((module) => module.File008),
  "file-009": () =>
    import("@/registry/components/file-upload/file-009/file-009").then((module) => module.File009),
  "file-010": () =>
    import("@/registry/components/file-upload/file-010/file-010").then((module) => module.File010),
} satisfies PreviewLoaderMap
