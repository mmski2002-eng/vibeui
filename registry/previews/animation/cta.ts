// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "cta-anim-001": () =>
    import("@/registry/animations/cta/cta-anim-001/cta-anim-001").then((module) => module.CtaAnim001),
} satisfies PreviewLoaderMap
