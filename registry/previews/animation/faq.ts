// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "faq-anim-001": () =>
    import("@/registry/animations/faq/faq-anim-001/faq-anim-001").then((module) => module.FaqAnim001),
} satisfies PreviewLoaderMap
