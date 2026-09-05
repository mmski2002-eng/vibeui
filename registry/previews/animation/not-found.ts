// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "not-found-001": () =>
    import("@/registry/animations/not-found/not-found-001/not-found-001").then((module) => module.NotFound001),
} satisfies PreviewLoaderMap
