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
  "subscribe-007": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-007/subscribe-007").then((module) => module.Subscribe007),
  ),
  "subscribe-008": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-008/subscribe-008").then((module) => module.Subscribe008),
  ),
  "subscribe-011": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-011/subscribe-011").then((module) => module.Subscribe011),
  ),
  "subscribe-020": dynamic(() =>
    import("@/registry/blocks/newsletter/subscribe-020/subscribe-020").then((module) => module.Subscribe020),
  ),
} satisfies PreviewMap
