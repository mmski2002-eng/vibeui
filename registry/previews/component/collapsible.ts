// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "collapsible-001": () =>
    import("@/registry/components/collapsible/collapsible-001/collapsible-001").then((module) => module.Collapsible001),
  "collapsible-002": () =>
    import("@/registry/components/collapsible/collapsible-002/collapsible-002").then((module) => module.Collapsible002),
  "collapsible-003": () =>
    import("@/registry/components/collapsible/collapsible-003/collapsible-003").then((module) => module.Collapsible003),
  "collapsible-004": () =>
    import("@/registry/components/collapsible/collapsible-004/collapsible-004").then((module) => module.Collapsible004),
  "collapsible-005": () =>
    import("@/registry/components/collapsible/collapsible-005/collapsible-005").then((module) => module.Collapsible005),
  "collapsible-006": () =>
    import("@/registry/components/collapsible/collapsible-006/collapsible-006").then((module) => module.Collapsible006),
  "collapsible-008": () =>
    import("@/registry/components/collapsible/collapsible-008/collapsible-008").then((module) => module.Collapsible008),
  "collapsible-009": () =>
    import("@/registry/components/collapsible/collapsible-009/collapsible-009").then((module) => module.Collapsible009),
  "collapsible-010": () =>
    import("@/registry/components/collapsible/collapsible-010/collapsible-010").then((module) => module.Collapsible010),
} satisfies PreviewLoaderMap
