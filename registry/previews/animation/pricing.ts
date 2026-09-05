// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "pricing-anim-001": () =>
    import("@/registry/animations/pricing/pricing-anim-001/pricing-anim-001").then((module) => module.PricingAnim001),
} satisfies PreviewLoaderMap
