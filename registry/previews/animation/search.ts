// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "search-001": () =>
    import("@/registry/animations/search/search-001/search-001").then((module) => module.Search001),
  "search-002": () =>
    import("@/registry/animations/search/search-002/search-002").then((module) => module.Search002),
  "search-003": () =>
    import("@/registry/animations/search/search-003/search-003").then((module) => module.Search003),
} satisfies PreviewLoaderMap
