// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "blog-001": () =>
    import("@/registry/blocks/blog/blog-001/blog-001").then((module) => module.Blog001),
  "blog-002": () =>
    import("@/registry/blocks/blog/blog-002/blog-002").then((module) => module.Blog002),
  "blog-003": () =>
    import("@/registry/blocks/blog/blog-003/blog-003").then((module) => module.Blog003),
  "blog-004": () =>
    import("@/registry/blocks/blog/blog-004/blog-004").then((module) => module.Blog004),
  "blog-005": () =>
    import("@/registry/blocks/blog/blog-005/blog-005").then((module) => module.Blog005),
  "blog-006": () =>
    import("@/registry/blocks/blog/blog-006/blog-006").then((module) => module.Blog006),
} satisfies PreviewLoaderMap
