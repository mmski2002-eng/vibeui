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
} satisfies PreviewLoaderMap
