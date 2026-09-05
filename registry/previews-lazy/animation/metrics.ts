// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "metrics-001": dynamic(() =>
    import("@/registry/animations/metrics/metrics-001/metrics-001").then((module) => module.Metrics001),
  ),
  "metrics-002": dynamic(() =>
    import("@/registry/animations/metrics/metrics-002/metrics-002").then((module) => module.Metrics002),
  ),
  "metrics-003": dynamic(() =>
    import("@/registry/animations/metrics/metrics-003/metrics-003").then((module) => module.Metrics003),
  ),
} satisfies PreviewMap
