// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "hero-anim-001": dynamic(() =>
    import("@/registry/animations/hero/hero-anim-001/hero-anim-001").then((module) => module.HeroAnim001),
  ),
} satisfies PreviewMap
