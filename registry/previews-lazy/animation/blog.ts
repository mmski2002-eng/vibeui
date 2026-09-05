// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "blog-anim-001": dynamic(() =>
    import("@/registry/animations/blog/blog-anim-001/blog-anim-001").then((module) => module.BlogAnim001),
  ),
} satisfies PreviewMap
