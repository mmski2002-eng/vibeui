// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "maintenance-001": dynamic(() =>
    import("@/registry/animations/maintenance/maintenance-001/maintenance-001").then((module) => module.Maintenance001),
  ),
} satisfies PreviewMap
