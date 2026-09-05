// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "footer-anim-001": dynamic(() =>
    import("@/registry/animations/footer/footer-anim-001/footer-anim-001").then((module) => module.FooterAnim001),
  ),
} satisfies PreviewMap
