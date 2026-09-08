// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "text-001": () =>
    import("@/registry/animations/text/text-001/text-001").then((module) => module.Text001),
  "text-002": () =>
    import("@/registry/animations/text/text-002/text-002").then((module) => module.Text002),
  "text-003": () =>
    import("@/registry/animations/text/text-003/text-003").then((module) => module.Text003),
} satisfies PreviewLoaderMap
