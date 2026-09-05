// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "gantt-001": () =>
    import("@/registry/components/gantt/gantt-001/gantt-001").then((module) => module.Gantt001),
  "gantt-002": () =>
    import("@/registry/components/gantt/gantt-002/gantt-002").then((module) => module.Gantt002),
  "gantt-003": () =>
    import("@/registry/components/gantt/gantt-003/gantt-003").then((module) => module.Gantt003),
  "gantt-004": () =>
    import("@/registry/components/gantt/gantt-004/gantt-004").then((module) => module.Gantt004),
  "gantt-005": () =>
    import("@/registry/components/gantt/gantt-005/gantt-005").then((module) => module.Gantt005),
  "gantt-006": () =>
    import("@/registry/components/gantt/gantt-006/gantt-006").then((module) => module.Gantt006),
  "gantt-007": () =>
    import("@/registry/components/gantt/gantt-007/gantt-007").then((module) => module.Gantt007),
  "gantt-008": () =>
    import("@/registry/components/gantt/gantt-008/gantt-008").then((module) => module.Gantt008),
  "gantt-009": () =>
    import("@/registry/components/gantt/gantt-009/gantt-009").then((module) => module.Gantt009),
} satisfies PreviewLoaderMap
