// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "map-001": () =>
    import("@/registry/blocks/map/map-001/map-001").then((module) => module.Map001),
  "map-002": () =>
    import("@/registry/blocks/map/map-002/map-002").then((module) => module.Map002),
  "map-003": () =>
    import("@/registry/blocks/map/map-003/map-003").then((module) => module.Map003),
} satisfies PreviewLoaderMap
