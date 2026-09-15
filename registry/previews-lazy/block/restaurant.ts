// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "restaurant-003": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-003/restaurant-003").then((module) => module.Restaurant003),
  ),
  "restaurant-005": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-005/restaurant-005").then((module) => module.Restaurant005),
  ),
} satisfies PreviewMap
