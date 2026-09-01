// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "drawer-001": dynamic(() =>
    import("@/registry/components/drawer/drawer-001/drawer-001").then(
      (module) => module.Drawer001,
    ),
  ),
  "drawer-002": dynamic(() =>
    import("@/registry/components/drawer/drawer-002/drawer-002").then(
      (module) => module.Drawer002,
    ),
  ),
  "drawer-003": dynamic(() =>
    import("@/registry/components/drawer/drawer-003/drawer-003").then(
      (module) => module.Drawer003,
    ),
  ),
  "drawer-004": dynamic(() =>
    import("@/registry/components/drawer/drawer-004/drawer-004").then(
      (module) => module.Drawer004,
    ),
  ),
  "drawer-005": dynamic(() =>
    import("@/registry/components/drawer/drawer-005/drawer-005").then(
      (module) => module.Drawer005,
    ),
  ),
  "drawer-006": dynamic(() =>
    import("@/registry/components/drawer/drawer-006/drawer-006").then(
      (module) => module.Drawer006,
    ),
  ),
  "drawer-007": dynamic(() =>
    import("@/registry/components/drawer/drawer-007/drawer-007").then(
      (module) => module.Drawer007,
    ),
  ),
  "drawer-008": dynamic(() =>
    import("@/registry/components/drawer/drawer-008/drawer-008").then(
      (module) => module.Drawer008,
    ),
  ),
} satisfies PreviewMap
