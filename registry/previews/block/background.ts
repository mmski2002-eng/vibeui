// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "surface-001": () =>
    import("@/registry/blocks/background/surface-001/surface-001").then((module) => module.Surface001),
  "surface-002": () =>
    import("@/registry/blocks/background/surface-002/surface-002").then((module) => module.Surface002),
  "surface-003": () =>
    import("@/registry/blocks/background/surface-003/surface-003").then((module) => module.Surface003),
} satisfies PreviewLoaderMap
