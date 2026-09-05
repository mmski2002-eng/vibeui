// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "stats-001": dynamic(() =>
    import("@/registry/animations/stats/stats-001/stats-001").then((module) => module.Stats001),
  ),
} satisfies PreviewMap
