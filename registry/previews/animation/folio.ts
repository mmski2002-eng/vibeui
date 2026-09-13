// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "folio-001": () =>
    import("@/registry/animations/folio/folio-001/folio-001").then((module) => module.Folio001),
  "folio-002": () =>
    import("@/registry/animations/folio/folio-002/folio-002").then((module) => module.Folio002),
} satisfies PreviewLoaderMap
