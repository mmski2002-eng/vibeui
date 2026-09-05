// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "timeline-anim-001": () =>
    import("@/registry/animations/timeline/timeline-anim-001/timeline-anim-001").then((module) => module.TimelineAnim001),
} satisfies PreviewLoaderMap
