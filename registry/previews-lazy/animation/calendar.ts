// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "calendar-anim-001": dynamic(() =>
    import("@/registry/animations/calendar/calendar-anim-001/calendar-anim-001").then((module) => module.CalendarAnim001),
  ),
  "calendar-anim-002": dynamic(() =>
    import("@/registry/animations/calendar/calendar-anim-002/calendar-anim-002").then((module) => module.CalendarAnim002),
  ),
  "calendar-anim-003": dynamic(() =>
    import("@/registry/animations/calendar/calendar-anim-003/calendar-anim-003").then((module) => module.CalendarAnim003),
  ),
} satisfies PreviewMap
