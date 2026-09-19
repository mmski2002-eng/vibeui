// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "auto-001": () =>
    import("@/registry/blocks/auto/auto-001/auto-001").then((module) => module.Auto001),
  "auto-002": () =>
    import("@/registry/blocks/auto/auto-002/auto-002").then((module) => module.Auto002),
  "auto-003": () =>
    import("@/registry/blocks/auto/auto-003/auto-003").then((module) => module.Auto003),
  "auto-004": () =>
    import("@/registry/blocks/auto/auto-004/auto-004").then((module) => module.Auto004),
} satisfies PreviewLoaderMap
