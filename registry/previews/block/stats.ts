// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "stats-001": () =>
    import("@/registry/blocks/stats/stats-001/stats-001").then((module) => module.Stats001),
} satisfies PreviewLoaderMap
