// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "opensource-001": () =>
    import("@/registry/blocks/opensource/opensource-001/opensource-001").then((module) => module.Opensource001),
} satisfies PreviewLoaderMap
