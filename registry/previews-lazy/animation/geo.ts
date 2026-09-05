// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "geo-001": dynamic(() =>
    import("@/registry/animations/geo/geo-001/geo-001").then((module) => module.Geo001),
  ),
  "geo-002": dynamic(() =>
    import("@/registry/animations/geo/geo-002/geo-002").then((module) => module.Geo002),
  ),
} satisfies PreviewMap
