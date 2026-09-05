// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "newsletter-001": () =>
    import("@/registry/animations/newsletter/newsletter-001/newsletter-001").then((module) => module.Newsletter001),
} satisfies PreviewLoaderMap
