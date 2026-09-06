// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "video-001": () =>
    import("@/registry/blocks/video/video-001/video-001").then((module) => module.Video001),
  "video-002": () =>
    import("@/registry/blocks/video/video-002/video-002").then((module) => module.Video002),
  "video-003": () =>
    import("@/registry/blocks/video/video-003/video-003").then((module) => module.Video003),
} satisfies PreviewLoaderMap
