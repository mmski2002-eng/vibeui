// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "error-001": () =>
    import("@/registry/animations/error/error-001/error-001").then((module) => module.Error001),
  "error-002": () =>
    import("@/registry/animations/error/error-002/error-002").then((module) => module.Error002),
} satisfies PreviewLoaderMap
