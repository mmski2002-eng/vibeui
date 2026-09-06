// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "blog-001": dynamic(() =>
    import("@/registry/blocks/blog/blog-001/blog-001").then((module) => module.Blog001),
  ),
  "blog-002": dynamic(() =>
    import("@/registry/blocks/blog/blog-002/blog-002").then((module) => module.Blog002),
  ),
  "blog-003": dynamic(() =>
    import("@/registry/blocks/blog/blog-003/blog-003").then((module) => module.Blog003),
  ),
  "blog-004": dynamic(() =>
    import("@/registry/blocks/blog/blog-004/blog-004").then((module) => module.Blog004),
  ),
  "blog-005": dynamic(() =>
    import("@/registry/blocks/blog/blog-005/blog-005").then((module) => module.Blog005),
  ),
  "blog-006": dynamic(() =>
    import("@/registry/blocks/blog/blog-006/blog-006").then((module) => module.Blog006),
  ),
  "blog-007": dynamic(() =>
    import("@/registry/blocks/blog/blog-007/blog-007").then((module) => module.Blog007),
  ),
  "blog-008": dynamic(() =>
    import("@/registry/blocks/blog/blog-008/blog-008").then((module) => module.Blog008),
  ),
  "blog-009": dynamic(() =>
    import("@/registry/blocks/blog/blog-009/blog-009").then((module) => module.Blog009),
  ),
  "blog-010": dynamic(() =>
    import("@/registry/blocks/blog/blog-010/blog-010").then((module) => module.Blog010),
  ),
  "blog-011": dynamic(() =>
    import("@/registry/blocks/blog/blog-011/blog-011").then((module) => module.Blog011),
  ),
  "blog-012": dynamic(() =>
    import("@/registry/blocks/blog/blog-012/blog-012").then((module) => module.Blog012),
  ),
  "blog-013": dynamic(() =>
    import("@/registry/blocks/blog/blog-013/blog-013").then((module) => module.Blog013),
  ),
  "blog-014": dynamic(() =>
    import("@/registry/blocks/blog/blog-014/blog-014").then((module) => module.Blog014),
  ),
  "blog-015": dynamic(() =>
    import("@/registry/blocks/blog/blog-015/blog-015").then((module) => module.Blog015),
  ),
} satisfies PreviewMap
