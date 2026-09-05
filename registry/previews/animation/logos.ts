// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "logos-001": () =>
    import("@/registry/animations/logos/logos-001/logos-001").then((module) => module.Logos001),
} satisfies PreviewLoaderMap
