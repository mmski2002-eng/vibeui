// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "blog-post-001": () =>
    import("@/registry/animations/blog-post/blog-post-001/blog-post-001").then((module) => module.BlogPost001),
} satisfies PreviewLoaderMap
