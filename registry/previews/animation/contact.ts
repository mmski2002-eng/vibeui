// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "contact-anim-001": () =>
    import("@/registry/animations/contact/contact-anim-001/contact-anim-001").then((module) => module.ContactAnim001),
} satisfies PreviewLoaderMap
