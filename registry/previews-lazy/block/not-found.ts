// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "not-found-001": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-001/not-found-001").then((module) => module.NotFound001),
  ),
  "not-found-002": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-002/not-found-002").then((module) => module.NotFound002),
  ),
  "not-found-003": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-003/not-found-003").then((module) => module.NotFound003),
  ),
  "not-found-004": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-004/not-found-004").then((module) => module.NotFound004),
  ),
  "not-found-005": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-005/not-found-005").then((module) => module.NotFound005),
  ),
  "not-found-006": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-006/not-found-006").then((module) => module.NotFound006),
  ),
  "not-found-007": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-007/not-found-007").then((module) => module.NotFound007),
  ),
  "not-found-008": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-008/not-found-008").then((module) => module.NotFound008),
  ),
  "not-found-009": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-009/not-found-009").then((module) => module.NotFound009),
  ),
  "not-found-010": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-010/not-found-010").then((module) => module.NotFound010),
  ),
  "not-found-011": dynamic(() =>
    import("@/registry/blocks/not-found/not-found-011/not-found-011").then((module) => module.NotFound011),
  ),
} satisfies PreviewMap
