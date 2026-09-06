// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "roadmap-001": () =>
    import("@/registry/blocks/roadmap/roadmap-001/roadmap-001").then((module) => module.Roadmap001),
  "roadmap-002": () =>
    import("@/registry/blocks/roadmap/roadmap-002/roadmap-002").then((module) => module.Roadmap002),
  "roadmap-003": () =>
    import("@/registry/blocks/roadmap/roadmap-003/roadmap-003").then((module) => module.Roadmap003),
} satisfies PreviewLoaderMap
