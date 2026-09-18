// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "podcast-001": () =>
    import("@/registry/blocks/podcast/podcast-001/podcast-001").then((module) => module.Podcast001),
  "podcast-002": () =>
    import("@/registry/blocks/podcast/podcast-002/podcast-002").then((module) => module.Podcast002),
  "podcast-003": () =>
    import("@/registry/blocks/podcast/podcast-003/podcast-003").then((module) => module.Podcast003),
  "podcast-004": () =>
    import("@/registry/blocks/podcast/podcast-004/podcast-004").then((module) => module.Podcast004),
  "podcast-005": () =>
    import("@/registry/blocks/podcast/podcast-005/podcast-005").then((module) => module.Podcast005),
  "podcast-006": () =>
    import("@/registry/blocks/podcast/podcast-006/podcast-006").then((module) => module.Podcast006),
  "podcast-007": () =>
    import("@/registry/blocks/podcast/podcast-007/podcast-007").then((module) => module.Podcast007),
} satisfies PreviewLoaderMap
