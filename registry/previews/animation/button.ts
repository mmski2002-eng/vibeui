// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "button-anim-001": () =>
    import("@/registry/animations/button/button-anim-001/button-anim-001").then((module) => module.ButtonAnim001),
} satisfies PreviewLoaderMap
