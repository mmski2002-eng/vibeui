// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "testimonials-001": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-001/testimonials-001").then((module) => module.Testimonials001),
  ),
  "testimonials-002": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-002/testimonials-002").then((module) => module.Testimonials002),
  ),
  "testimonials-003": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-003/testimonials-003").then((module) => module.Testimonials003),
  ),
  "testimonials-004": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-004/testimonials-004").then((module) => module.Testimonials004),
  ),
  "testimonials-005": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-005/testimonials-005").then((module) => module.Testimonials005),
  ),
  "testimonials-006": dynamic(() =>
    import("@/registry/blocks/testimonials/testimonials-006/testimonials-006").then((module) => module.Testimonials006),
  ),
} satisfies PreviewMap
