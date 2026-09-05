// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "faq-anim-001": dynamic(() =>
    import("@/registry/animations/faq/faq-anim-001/faq-anim-001").then((module) => module.FaqAnim001),
  ),
} satisfies PreviewMap
