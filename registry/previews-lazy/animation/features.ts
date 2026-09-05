// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "features-anim-001": dynamic(() =>
    import("@/registry/animations/features/features-anim-001/features-anim-001").then((module) => module.FeaturesAnim001),
  ),
} satisfies PreviewMap
