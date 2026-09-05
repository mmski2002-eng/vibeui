// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "rating-001": dynamic(() =>
    import("@/registry/components/rating/rating-001/rating-001").then((module) => module.Rating001),
  ),
  "rating-002": dynamic(() =>
    import("@/registry/components/rating/rating-002/rating-002").then((module) => module.Rating002),
  ),
  "rating-003": dynamic(() =>
    import("@/registry/components/rating/rating-003/rating-003").then((module) => module.Rating003),
  ),
  "rating-004": dynamic(() =>
    import("@/registry/components/rating/rating-004/rating-004").then((module) => module.Rating004),
  ),
  "rating-005": dynamic(() =>
    import("@/registry/components/rating/rating-005/rating-005").then((module) => module.Rating005),
  ),
  "rating-006": dynamic(() =>
    import("@/registry/components/rating/rating-006/rating-006").then((module) => module.Rating006),
  ),
  "rating-007": dynamic(() =>
    import("@/registry/components/rating/rating-007/rating-007").then((module) => module.Rating007),
  ),
  "rating-008": dynamic(() =>
    import("@/registry/components/rating/rating-008/rating-008").then((module) => module.Rating008),
  ),
  "rating-009": dynamic(() =>
    import("@/registry/components/rating/rating-009/rating-009").then((module) => module.Rating009),
  ),
} satisfies PreviewMap
