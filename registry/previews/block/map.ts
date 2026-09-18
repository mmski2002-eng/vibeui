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
  "map-004": () =>
    import("@/registry/blocks/map/map-004/map-004").then((module) => module.Map004),
  "map-005": () =>
    import("@/registry/blocks/map/map-005/map-005").then((module) => module.Map005),
  "map-006": () =>
    import("@/registry/blocks/map/map-006/map-006").then((module) => module.Map006),
  "map-007": () =>
    import("@/registry/blocks/map/map-007/map-007").then((module) => module.Map007),
  "map-008": () =>
    import("@/registry/blocks/map/map-008/map-008").then((module) => module.Map008),
  "map-009": () =>
    import("@/registry/blocks/map/map-009/map-009").then((module) => module.Map009),
  "map-010": () =>
    import("@/registry/blocks/map/map-010/map-010").then((module) => module.Map010),
} satisfies PreviewLoaderMap
