// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "files-001": () =>
    import("@/registry/animations/files/files-001/files-001").then((module) => module.Files001),
  "files-002": () =>
    import("@/registry/animations/files/files-002/files-002").then((module) => module.Files002),
  "files-003": () =>
    import("@/registry/animations/files/files-003/files-003").then((module) => module.Files003),
  "files-004": () =>
    import("@/registry/animations/files/files-004/files-004").then((module) => module.Files004),
} satisfies PreviewLoaderMap
