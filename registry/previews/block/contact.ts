// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "contact-001": () =>
    import("@/registry/blocks/contact/contact-001/contact-001").then((module) => module.Contact001),
  "contact-002": () =>
    import("@/registry/blocks/contact/contact-002/contact-002").then((module) => module.Contact002),
  "contact-003": () =>
    import("@/registry/blocks/contact/contact-003/contact-003").then((module) => module.Contact003),
  "contact-004": () =>
    import("@/registry/blocks/contact/contact-004/contact-004").then((module) => module.Contact004),
  "contact-006": () =>
    import("@/registry/blocks/contact/contact-006/contact-006").then((module) => module.Contact006),
  "contact-007": () =>
    import("@/registry/blocks/contact/contact-007/contact-007").then((module) => module.Contact007),
  "contact-009": () =>
    import("@/registry/blocks/contact/contact-009/contact-009").then((module) => module.Contact009),
  "contact-012": () =>
    import("@/registry/blocks/contact/contact-012/contact-012").then((module) => module.Contact012),
  "contact-014": () =>
    import("@/registry/blocks/contact/contact-014/contact-014").then((module) => module.Contact014),
  "contact-015": () =>
    import("@/registry/blocks/contact/contact-015/contact-015").then((module) => module.Contact015),
  "contact-016": () =>
    import("@/registry/blocks/contact/contact-016/contact-016").then((module) => module.Contact016),
  "contact-017": () =>
    import("@/registry/blocks/contact/contact-017/contact-017").then((module) => module.Contact017),
  "contact-018": () =>
    import("@/registry/blocks/contact/contact-018/contact-018").then((module) => module.Contact018),
} satisfies PreviewLoaderMap
