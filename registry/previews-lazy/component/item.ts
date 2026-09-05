// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "item-001": dynamic(() =>
    import("@/registry/components/item/item-001/item-001").then((module) => module.Item001),
  ),
  "item-002": dynamic(() =>
    import("@/registry/components/item/item-002/item-002").then((module) => module.Item002),
  ),
  "item-003": dynamic(() =>
    import("@/registry/components/item/item-003/item-003").then((module) => module.Item003),
  ),
  "item-004": dynamic(() =>
    import("@/registry/components/item/item-004/item-004").then((module) => module.Item004),
  ),
  "item-005": dynamic(() =>
    import("@/registry/components/item/item-005/item-005").then((module) => module.Item005),
  ),
  "item-006": dynamic(() =>
    import("@/registry/components/item/item-006/item-006").then((module) => module.Item006),
  ),
  "item-007": dynamic(() =>
    import("@/registry/components/item/item-007/item-007").then((module) => module.Item007),
  ),
  "item-008": dynamic(() =>
    import("@/registry/components/item/item-008/item-008").then((module) => module.Item008),
  ),
  "item-009": dynamic(() =>
    import("@/registry/components/item/item-009/item-009").then((module) => module.Item009),
  ),
  "item-010": dynamic(() =>
    import("@/registry/components/item/item-010/item-010").then((module) => module.Item010),
  ),
  "item-011": dynamic(() =>
    import("@/registry/components/item/item-011/item-011").then((module) => module.Item011),
  ),
  "item-012": dynamic(() =>
    import("@/registry/components/item/item-012/item-012").then((module) => module.Item012),
  ),
} satisfies PreviewMap
