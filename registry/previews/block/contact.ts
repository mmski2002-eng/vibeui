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
  "contact-005": () =>
    import("@/registry/blocks/contact/contact-005/contact-005").then((module) => module.Contact005),
  "contact-006": () =>
    import("@/registry/blocks/contact/contact-006/contact-006").then((module) => module.Contact006),
} satisfies PreviewLoaderMap
