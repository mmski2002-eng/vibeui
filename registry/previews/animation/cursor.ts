// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "cursor-001": () =>
    import("@/registry/animations/cursor/cursor-001/cursor-001").then((module) => module.Cursor001),
} satisfies PreviewLoaderMap
