// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "status-001": dynamic(() =>
    import("@/registry/animations/status/status-001/status-001").then((module) => module.Status001),
  ),
  "status-002": dynamic(() =>
    import("@/registry/animations/status/status-002/status-002").then((module) => module.Status002),
  ),
} satisfies PreviewMap
