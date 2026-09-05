// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "testimonials-anim-001": () =>
    import("@/registry/animations/testimonials/testimonials-anim-001/testimonials-anim-001").then((module) => module.TestimonialsAnim001),
} satisfies PreviewLoaderMap
