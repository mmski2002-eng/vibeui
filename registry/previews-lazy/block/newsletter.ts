// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "subscribe-001": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-001/subscribe-001").then((module) => module.Subscribe001),
  ),
  "subscribe-002": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-002/subscribe-002").then((module) => module.Subscribe002),
  ),
  "subscribe-003": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-003/subscribe-003").then((module) => module.Subscribe003),
  ),
  "subscribe-004": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-004/subscribe-004").then((module) => module.Subscribe004),
  ),
  "subscribe-005": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-005/subscribe-005").then((module) => module.Subscribe005),
  ),
  "subscribe-006": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-006/subscribe-006").then((module) => module.Subscribe006),
  ),
} satisfies PreviewMap
