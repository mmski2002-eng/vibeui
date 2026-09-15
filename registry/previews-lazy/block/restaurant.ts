// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "restaurant-001": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-001/restaurant-001").then((module) => module.Restaurant001),
  ),
  "restaurant-002": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-002/restaurant-002").then((module) => module.Restaurant002),
  ),
  "restaurant-003": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-003/restaurant-003").then((module) => module.Restaurant003),
  ),
  "restaurant-004": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-004/restaurant-004").then((module) => module.Restaurant004),
  ),
  "restaurant-005": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-005/restaurant-005").then((module) => module.Restaurant005),
  ),
  "restaurant-006": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-006/restaurant-006").then((module) => module.Restaurant006),
  ),
  "restaurant-007": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-007/restaurant-007").then((module) => module.Restaurant007),
  ),
  "restaurant-008": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-008/restaurant-008").then((module) => module.Restaurant008),
  ),
  "restaurant-009": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-009/restaurant-009").then((module) => module.Restaurant009),
  ),
  "restaurant-010": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-010/restaurant-010").then((module) => module.Restaurant010),
  ),
  "restaurant-011": dynamic(() =>
    import("@/registry/blocks/restaurant/restaurant-011/restaurant-011").then((module) => module.Restaurant011),
  ),
} satisfies PreviewMap
