// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "blog-post-001": dynamic(() =>
    import("@/registry/animations/blog-post/blog-post-001/blog-post-001").then((module) => module.BlogPost001),
  ),
} satisfies PreviewMap
