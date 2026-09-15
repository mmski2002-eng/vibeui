// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "realty-001": dynamic(() =>
    import("@/registry/blocks/realty/realty-001/realty-001").then((module) => module.Realty001),
  ),
  "realty-002": dynamic(() =>
    import("@/registry/blocks/realty/realty-002/realty-002").then((module) => module.Realty002),
  ),
  "realty-003": dynamic(() =>
    import("@/registry/blocks/realty/realty-003/realty-003").then((module) => module.Realty003),
  ),
  "realty-004": dynamic(() =>
    import("@/registry/blocks/realty/realty-004/realty-004").then((module) => module.Realty004),
  ),
  "realty-005": dynamic(() =>
    import("@/registry/blocks/realty/realty-005/realty-005").then((module) => module.Realty005),
  ),
  "realty-006": dynamic(() =>
    import("@/registry/blocks/realty/realty-006/realty-006").then((module) => module.Realty006),
  ),
  "realty-007": dynamic(() =>
    import("@/registry/blocks/realty/realty-007/realty-007").then((module) => module.Realty007),
  ),
  "realty-008": dynamic(() =>
    import("@/registry/blocks/realty/realty-008/realty-008").then((module) => module.Realty008),
  ),
  "realty-009": dynamic(() =>
    import("@/registry/blocks/realty/realty-009/realty-009").then((module) => module.Realty009),
  ),
  "realty-010": dynamic(() =>
    import("@/registry/blocks/realty/realty-010/realty-010").then((module) => module.Realty010),
  ),
  "realty-011": dynamic(() =>
    import("@/registry/blocks/realty/realty-011/realty-011").then((module) => module.Realty011),
  ),
  "realty-012": dynamic(() =>
    import("@/registry/blocks/realty/realty-012/realty-012").then((module) => module.Realty012),
  ),
} satisfies PreviewMap
