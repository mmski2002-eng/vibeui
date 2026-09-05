// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "contextmenu-001": () =>
    import("@/registry/components/context-menu/contextmenu-001/contextmenu-001").then((module) => module.Contextmenu001),
  "contextmenu-002": () =>
    import("@/registry/components/context-menu/contextmenu-002/contextmenu-002").then((module) => module.Contextmenu002),
  "contextmenu-003": () =>
    import("@/registry/components/context-menu/contextmenu-003/contextmenu-003").then((module) => module.Contextmenu003),
  "contextmenu-004": () =>
    import("@/registry/components/context-menu/contextmenu-004/contextmenu-004").then((module) => module.Contextmenu004),
  "contextmenu-005": () =>
    import("@/registry/components/context-menu/contextmenu-005/contextmenu-005").then((module) => module.Contextmenu005),
  "contextmenu-006": () =>
    import("@/registry/components/context-menu/contextmenu-006/contextmenu-006").then((module) => module.Contextmenu006),
  "contextmenu-007": () =>
    import("@/registry/components/context-menu/contextmenu-007/contextmenu-007").then((module) => module.Contextmenu007),
  "contextmenu-008": () =>
    import("@/registry/components/context-menu/contextmenu-008/contextmenu-008").then((module) => module.Contextmenu008),
  "contextmenu-009": () =>
    import("@/registry/components/context-menu/contextmenu-009/contextmenu-009").then((module) => module.Contextmenu009),
  "contextmenu-010": () =>
    import("@/registry/components/context-menu/contextmenu-010/contextmenu-010").then((module) => module.Contextmenu010),
} satisfies PreviewLoaderMap
