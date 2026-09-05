// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "cta-anim-001": dynamic(() =>
    import("@/registry/animations/cta/cta-anim-001/cta-anim-001").then((module) => module.CtaAnim001),
  ),
} satisfies PreviewMap
