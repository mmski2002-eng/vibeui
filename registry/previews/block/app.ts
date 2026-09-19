// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "app-001": () =>
    import("@/registry/blocks/app/app-001/app-001").then((module) => module.App001),
  "app-002": () =>
    import("@/registry/blocks/app/app-002/app-002").then((module) => module.App002),
} satisfies PreviewLoaderMap
