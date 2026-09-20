// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "text-001": () =>
    import("@/registry/animations/promo/text-001/text-001").then((module) => module.Text001),
  "text-002": () =>
    import("@/registry/animations/promo/text-002/text-002").then((module) => module.Text002),
  "text-003": () =>
    import("@/registry/animations/promo/text-003/text-003").then((module) => module.Text003),
  "flip-001": () =>
    import("@/registry/animations/promo/flip-001/flip-001").then((module) => module.Flip001),
  "flip-002": () =>
    import("@/registry/animations/promo/flip-002/flip-002").then((module) => module.Flip002),
  "folio-001": () =>
    import("@/registry/animations/promo/folio-001/folio-001").then((module) => module.Folio001),
  "folio-002": () =>
    import("@/registry/animations/promo/folio-002/folio-002").then((module) => module.Folio002),
  "cta-anim-001": () =>
    import("@/registry/animations/promo/cta-anim-001/cta-anim-001").then((module) => module.CtaAnim001),
  "process-001": () =>
    import("@/registry/animations/promo/process-001/process-001").then((module) => module.Process001),
} satisfies PreviewLoaderMap
