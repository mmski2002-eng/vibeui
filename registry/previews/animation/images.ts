// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "images-001": () =>
    import("@/registry/animations/images/images-001/images-001").then((module) => module.Images001),
  "images-002": () =>
    import("@/registry/animations/images/images-002/images-002").then((module) => module.Images002),
} satisfies PreviewLoaderMap
