// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "checklist-001": () =>
    import("@/registry/animations/checklist/checklist-001/checklist-001").then((module) => module.Checklist001),
} satisfies PreviewLoaderMap
