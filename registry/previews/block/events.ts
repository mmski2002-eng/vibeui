// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "event-001": () =>
    import("@/registry/blocks/events/event-001/event-001").then((module) => module.Event001),
  "event-002": () =>
    import("@/registry/blocks/events/event-002/event-002").then((module) => module.Event002),
  "event-003": () =>
    import("@/registry/blocks/events/event-003/event-003").then((module) => module.Event003),
  "event-004": () =>
    import("@/registry/blocks/events/event-004/event-004").then((module) => module.Event004),
  "event-005": () =>
    import("@/registry/blocks/events/event-005/event-005").then((module) => module.Event005),
  "event-006": () =>
    import("@/registry/blocks/events/event-006/event-006").then((module) => module.Event006),
  "event-007": () =>
    import("@/registry/blocks/events/event-007/event-007").then((module) => module.Event007),
  "event-008": () =>
    import("@/registry/blocks/events/event-008/event-008").then((module) => module.Event008),
  "event-009": () =>
    import("@/registry/blocks/events/event-009/event-009").then((module) => module.Event009),
} satisfies PreviewLoaderMap
