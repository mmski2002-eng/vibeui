// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "empty-anim-001": () =>
    import("@/registry/animations/empty/empty-anim-001/empty-anim-001").then((module) => module.EmptyAnim001),
} satisfies PreviewLoaderMap
