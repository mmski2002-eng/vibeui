// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "delivery-001": dynamic(() =>
    import("@/registry/blocks/delivery/delivery-001/delivery-001").then((module) => module.Delivery001),
  ),
  "delivery-002": dynamic(() =>
    import("@/registry/blocks/delivery/delivery-002/delivery-002").then((module) => module.Delivery002),
  ),
  "delivery-003": dynamic(() =>
    import("@/registry/blocks/delivery/delivery-003/delivery-003").then((module) => module.Delivery003),
  ),
  "delivery-004": dynamic(() =>
    import("@/registry/blocks/delivery/delivery-004/delivery-004").then((module) => module.Delivery004),
  ),
  "delivery-005": dynamic(() =>
    import("@/registry/blocks/delivery/delivery-005/delivery-005").then((module) => module.Delivery005),
  ),
} satisfies PreviewMap
