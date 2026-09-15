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
} satisfies PreviewMap
