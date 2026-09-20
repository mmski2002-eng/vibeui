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
  "blog-007": () =>
    import("@/registry/blocks/blog/blog-007/blog-007").then((module) => module.Blog007),
  "blog-008": () =>
    import("@/registry/blocks/blog/blog-008/blog-008").then((module) => module.Blog008),
  "blog-009": () =>
    import("@/registry/blocks/blog/blog-009/blog-009").then((module) => module.Blog009),
  "blog-010": () =>
    import("@/registry/blocks/blog/blog-010/blog-010").then((module) => module.Blog010),
  "blog-011": () =>
    import("@/registry/blocks/blog/blog-011/blog-011").then((module) => module.Blog011),
  "blog-012": () =>
    import("@/registry/blocks/blog/blog-012/blog-012").then((module) => module.Blog012),
  "blog-013": () =>
    import("@/registry/blocks/blog/blog-013/blog-013").then((module) => module.Blog013),
  "blog-014": () =>
    import("@/registry/blocks/blog/blog-014/blog-014").then((module) => module.Blog014),
  "blog-015": () =>
    import("@/registry/blocks/blog/blog-015/blog-015").then((module) => module.Blog015),
  "changelog-001": () =>
    import("@/registry/blocks/blog/changelog-001/changelog-001").then((module) => module.Changelog001),
  "changelog-002": () =>
    import("@/registry/blocks/blog/changelog-002/changelog-002").then((module) => module.Changelog002),
  "changelog-003": () =>
    import("@/registry/blocks/blog/changelog-003/changelog-003").then((module) => module.Changelog003),
  "changelog-004": () =>
    import("@/registry/blocks/blog/changelog-004/changelog-004").then((module) => module.Changelog004),
  "changelog-013": () =>
    import("@/registry/blocks/blog/changelog-013/changelog-013").then((module) => module.Changelog013),
} satisfies PreviewLoaderMap
