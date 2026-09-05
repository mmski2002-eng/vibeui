// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "footer-anim-001": () =>
    import("@/registry/animations/footer/footer-anim-001/footer-anim-001").then((module) => module.FooterAnim001),
} satisfies PreviewLoaderMap
