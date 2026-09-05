// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "geo-001": () =>
    import("@/registry/animations/geo/geo-001/geo-001").then((module) => module.Geo001),
  "geo-002": () =>
    import("@/registry/animations/geo/geo-002/geo-002").then((module) => module.Geo002),
} satisfies PreviewLoaderMap
