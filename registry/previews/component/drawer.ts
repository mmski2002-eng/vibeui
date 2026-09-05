// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "drawer-001": () =>
    import("@/registry/components/drawer/drawer-001/drawer-001").then((module) => module.Drawer001),
  "drawer-002": () =>
    import("@/registry/components/drawer/drawer-002/drawer-002").then((module) => module.Drawer002),
  "drawer-003": () =>
    import("@/registry/components/drawer/drawer-003/drawer-003").then((module) => module.Drawer003),
  "drawer-004": () =>
    import("@/registry/components/drawer/drawer-004/drawer-004").then((module) => module.Drawer004),
  "drawer-005": () =>
    import("@/registry/components/drawer/drawer-005/drawer-005").then((module) => module.Drawer005),
  "drawer-006": () =>
    import("@/registry/components/drawer/drawer-006/drawer-006").then((module) => module.Drawer006),
  "drawer-007": () =>
    import("@/registry/components/drawer/drawer-007/drawer-007").then((module) => module.Drawer007),
  "drawer-008": () =>
    import("@/registry/components/drawer/drawer-008/drawer-008").then((module) => module.Drawer008),
  "drawer-009": () =>
    import("@/registry/components/drawer/drawer-009/drawer-009").then((module) => module.Drawer009),
  "drawer-010": () =>
    import("@/registry/components/drawer/drawer-010/drawer-010").then((module) => module.Drawer010),
  "drawer-011": () =>
    import("@/registry/components/drawer/drawer-011/drawer-011").then((module) => module.Drawer011),
} satisfies PreviewLoaderMap
