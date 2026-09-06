// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "waitlist-001": dynamic(() =>
    import("@/registry/blocks/waitlist/waitlist-001/waitlist-001").then((module) => module.Waitlist001),
  ),
  "waitlist-002": dynamic(() =>
    import("@/registry/blocks/waitlist/waitlist-002/waitlist-002").then((module) => module.Waitlist002),
  ),
  "waitlist-003": dynamic(() =>
    import("@/registry/blocks/waitlist/waitlist-003/waitlist-003").then((module) => module.Waitlist003),
  ),
} satisfies PreviewMap
