// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "devices-002": () =>
    import("@/registry/animations/devices/devices-002/devices-002").then((module) => module.Devices002),
} satisfies PreviewLoaderMap
