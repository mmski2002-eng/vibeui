// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "cursor-001": () =>
    import("@/registry/animations/cursor/cursor-001/cursor-001").then((module) => module.Cursor001),
  "cursor-002": () =>
    import("@/registry/animations/cursor/cursor-002/cursor-002").then((module) => module.Cursor002),
  "cursor-003": () =>
    import("@/registry/animations/cursor/cursor-003/cursor-003").then((module) => module.Cursor003),
  "cursor-004": () =>
    import("@/registry/animations/cursor/cursor-004/cursor-004").then((module) => module.Cursor004),
} satisfies PreviewLoaderMap
