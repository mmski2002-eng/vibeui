// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "search-001": dynamic(() =>
    import("@/registry/animations/search/search-001/search-001").then((module) => module.Search001),
  ),
  "search-002": dynamic(() =>
    import("@/registry/animations/search/search-002/search-002").then((module) => module.Search002),
  ),
  "search-003": dynamic(() =>
    import("@/registry/animations/search/search-003/search-003").then((module) => module.Search003),
  ),
} satisfies PreviewMap
