// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "dashboard-anim-001": () =>
    import("@/registry/animations/dashboard/dashboard-anim-001/dashboard-anim-001").then((module) => module.DashboardAnim001),
  "dashboard-anim-002": () =>
    import("@/registry/animations/dashboard/dashboard-anim-002/dashboard-anim-002").then((module) => module.DashboardAnim002),
} satisfies PreviewLoaderMap
