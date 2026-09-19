// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "event-001": dynamic(() =>
    import("@/registry/blocks/events/event-001/event-001").then((module) => module.Event001),
  ),
  "event-002": dynamic(() =>
    import("@/registry/blocks/events/event-002/event-002").then((module) => module.Event002),
  ),
  "event-003": dynamic(() =>
    import("@/registry/blocks/events/event-003/event-003").then((module) => module.Event003),
  ),
  "event-004": dynamic(() =>
    import("@/registry/blocks/events/event-004/event-004").then((module) => module.Event004),
  ),
  "event-005": dynamic(() =>
    import("@/registry/blocks/events/event-005/event-005").then((module) => module.Event005),
  ),
  "event-006": dynamic(() =>
    import("@/registry/blocks/events/event-006/event-006").then((module) => module.Event006),
  ),
  "event-007": dynamic(() =>
    import("@/registry/blocks/events/event-007/event-007").then((module) => module.Event007),
  ),
  "event-008": dynamic(() =>
    import("@/registry/blocks/events/event-008/event-008").then((module) => module.Event008),
  ),
  "event-009": dynamic(() =>
    import("@/registry/blocks/events/event-009/event-009").then((module) => module.Event009),
  ),
  "event-010": dynamic(() =>
    import("@/registry/blocks/events/event-010/event-010").then((module) => module.Event010),
  ),
  "event-011": dynamic(() =>
    import("@/registry/blocks/events/event-011/event-011").then((module) => module.Event011),
  ),
  "event-012": dynamic(() =>
    import("@/registry/blocks/events/event-012/event-012").then((module) => module.Event012),
  ),
  "event-013": dynamic(() =>
    import("@/registry/blocks/events/event-013/event-013").then((module) => module.Event013),
  ),
  "event-014": dynamic(() =>
    import("@/registry/blocks/events/event-014/event-014").then((module) => module.Event014),
  ),
  "event-025": dynamic(() =>
    import("@/registry/blocks/events/event-025/event-025").then((module) => module.Event025),
  ),
  "event-026": dynamic(() =>
    import("@/registry/blocks/events/event-026/event-026").then((module) => module.Event026),
  ),
} satisfies PreviewMap
