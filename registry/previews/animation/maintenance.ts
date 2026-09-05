// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "maintenance-001": () =>
    import("@/registry/animations/maintenance/maintenance-001/maintenance-001").then((module) => module.Maintenance001),
} satisfies PreviewLoaderMap
