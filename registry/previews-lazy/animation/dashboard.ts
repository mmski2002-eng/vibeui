// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "dashboard-anim-001": dynamic(() =>
    import("@/registry/animations/dashboard/dashboard-anim-001/dashboard-anim-001").then((module) => module.DashboardAnim001),
  ),
  "dashboard-anim-002": dynamic(() =>
    import("@/registry/animations/dashboard/dashboard-anim-002/dashboard-anim-002").then((module) => module.DashboardAnim002),
  ),
} satisfies PreviewMap
