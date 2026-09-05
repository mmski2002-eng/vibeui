// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "bento-001": () =>
    import("@/registry/animations/bento/bento-001/bento-001").then((module) => module.Bento001),
} satisfies PreviewLoaderMap
