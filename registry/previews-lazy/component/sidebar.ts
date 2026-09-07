// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "sidebar-002": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-002/sidebar-002").then((module) => module.Sidebar002),
  ),
  "sidebar-003": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-003/sidebar-003").then((module) => module.Sidebar003),
  ),
  "sidebar-004": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-004/sidebar-004").then((module) => module.Sidebar004),
  ),
  "sidebar-005": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-005/sidebar-005").then((module) => module.Sidebar005),
  ),
  "sidebar-006": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-006/sidebar-006").then((module) => module.Sidebar006),
  ),
  "sidebar-007": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-007/sidebar-007").then((module) => module.Sidebar007),
  ),
  "sidebar-008": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-008/sidebar-008").then((module) => module.Sidebar008),
  ),
  "sidebar-009": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-009/sidebar-009").then((module) => module.Sidebar009),
  ),
  "sidebar-010": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-010/sidebar-010").then((module) => module.Sidebar010),
  ),
  "sidebar-011": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-011/sidebar-011").then((module) => module.Sidebar011),
  ),
  "sidebar-012": dynamic(() =>
    import("@/registry/components/sidebar/sidebar-012/sidebar-012").then((module) => module.Sidebar012),
  ),
} satisfies PreviewMap
