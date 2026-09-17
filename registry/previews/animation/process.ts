// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "process-001": () =>
    import("@/registry/animations/process/process-001/process-001").then((module) => module.Process001),
} satisfies PreviewLoaderMap
