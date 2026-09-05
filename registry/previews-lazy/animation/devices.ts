// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "devices-001": dynamic(() =>
    import("@/registry/animations/devices/devices-001/devices-001").then((module) => module.Devices001),
  ),
  "devices-002": dynamic(() =>
    import("@/registry/animations/devices/devices-002/devices-002").then((module) => module.Devices002),
  ),
  "devices-003": dynamic(() =>
    import("@/registry/animations/devices/devices-003/devices-003").then((module) => module.Devices003),
  ),
} satisfies PreviewMap
