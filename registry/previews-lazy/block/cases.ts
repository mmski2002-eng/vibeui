// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "case-001": dynamic(() =>
    import("@/registry/blocks/cases/case-001/case-001").then((module) => module.Case001),
  ),
  "case-002": dynamic(() =>
    import("@/registry/blocks/cases/case-002/case-002").then((module) => module.Case002),
  ),
  "case-003": dynamic(() =>
    import("@/registry/blocks/cases/case-003/case-003").then((module) => module.Case003),
  ),
  "case-004": dynamic(() =>
    import("@/registry/blocks/cases/case-004/case-004").then((module) => module.Case004),
  ),
  "case-005": dynamic(() =>
    import("@/registry/blocks/cases/case-005/case-005").then((module) => module.Case005),
  ),
  "case-006": dynamic(() =>
    import("@/registry/blocks/cases/case-006/case-006").then((module) => module.Case006),
  ),
} satisfies PreviewMap
