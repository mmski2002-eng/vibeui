// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "table-anim-001": () =>
    import("@/registry/animations/table/table-anim-001/table-anim-001").then((module) => module.TableAnim001),
} satisfies PreviewLoaderMap
