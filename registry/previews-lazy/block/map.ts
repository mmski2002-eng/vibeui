// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "map-001": dynamic(() =>
    import("@/registry/blocks/map/map-001/map-001").then((module) => module.Map001),
  ),
  "map-002": dynamic(() =>
    import("@/registry/blocks/map/map-002/map-002").then((module) => module.Map002),
  ),
  "map-003": dynamic(() =>
    import("@/registry/blocks/map/map-003/map-003").then((module) => module.Map003),
  ),
  "map-004": dynamic(() =>
    import("@/registry/blocks/map/map-004/map-004").then((module) => module.Map004),
  ),
  "map-005": dynamic(() =>
    import("@/registry/blocks/map/map-005/map-005").then((module) => module.Map005),
  ),
  "map-006": dynamic(() =>
    import("@/registry/blocks/map/map-006/map-006").then((module) => module.Map006),
  ),
} satisfies PreviewMap
