// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "email-001": () =>
    import("@/registry/animations/email/email-001/email-001").then((module) => module.Email001),
  "email-002": () =>
    import("@/registry/animations/email/email-002/email-002").then((module) => module.Email002),
} satisfies PreviewLoaderMap
