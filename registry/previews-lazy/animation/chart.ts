// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "chart-anim-001": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-001/chart-anim-001").then((module) => module.ChartAnim001),
  ),
  "chart-anim-002": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-002/chart-anim-002").then((module) => module.ChartAnim002),
  ),
  "chart-anim-003": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-003/chart-anim-003").then((module) => module.ChartAnim003),
  ),
  "chart-anim-004": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-004/chart-anim-004").then((module) => module.ChartAnim004),
  ),
  "chart-anim-005": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-005/chart-anim-005").then((module) => module.ChartAnim005),
  ),
  "chart-anim-006": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-006/chart-anim-006").then((module) => module.ChartAnim006),
  ),
  "chart-anim-007": dynamic(() =>
    import("@/registry/animations/chart/chart-anim-007/chart-anim-007").then((module) => module.ChartAnim007),
  ),
} satisfies PreviewMap
