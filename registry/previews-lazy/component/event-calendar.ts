// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "eventcalendar-001": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-001/eventcalendar-001").then((module) => module.Eventcalendar001),
  ),
  "eventcalendar-002": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-002/eventcalendar-002").then((module) => module.Eventcalendar002),
  ),
  "eventcalendar-003": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-003/eventcalendar-003").then((module) => module.Eventcalendar003),
  ),
  "eventcalendar-004": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-004/eventcalendar-004").then((module) => module.Eventcalendar004),
  ),
  "eventcalendar-005": dynamic(() =>
    import("@/registry/components/event-calendar/eventcalendar-005/eventcalendar-005").then((module) => module.Eventcalendar005),
  ),
} satisfies PreviewMap
