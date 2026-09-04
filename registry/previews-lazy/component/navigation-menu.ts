// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "navmenu-001": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-001/navmenu-001").then(
      (module) => module.Navmenu001,
    ),
  ),
  "navmenu-002": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-002/navmenu-002").then(
      (module) => module.Navmenu002,
    ),
  ),
  "navmenu-003": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-003/navmenu-003").then(
      (module) => module.Navmenu003,
    ),
  ),
  "navmenu-004": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-004/navmenu-004").then(
      (module) => module.Navmenu004,
    ),
  ),
  "navmenu-005": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-005/navmenu-005").then(
      (module) => module.Navmenu005,
    ),
  ),
  "navmenu-006": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-006/navmenu-006").then(
      (module) => module.Navmenu006,
    ),
  ),
  "navmenu-008": dynamic(() =>
    import("@/registry/components/navigation-menu/navmenu-008/navmenu-008").then(
      (module) => module.Navmenu008,
    ),
  ),
} satisfies PreviewMap
