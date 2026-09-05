// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "devices-001": () =>
    import("@/registry/animations/devices/devices-001/devices-001").then((module) => module.Devices001),
  "devices-002": () =>
    import("@/registry/animations/devices/devices-002/devices-002").then((module) => module.Devices002),
  "devices-003": () =>
    import("@/registry/animations/devices/devices-003/devices-003").then((module) => module.Devices003),
} satisfies PreviewLoaderMap
