// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "portfolio-001": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-001/portfolio-001").then((module) => module.Portfolio001),
  ),
  "portfolio-002": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-002/portfolio-002").then((module) => module.Portfolio002),
  ),
  "portfolio-003": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-003/portfolio-003").then((module) => module.Portfolio003),
  ),
  "portfolio-004": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-004/portfolio-004").then((module) => module.Portfolio004),
  ),
  "portfolio-005": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-005/portfolio-005").then((module) => module.Portfolio005),
  ),
  "portfolio-006": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-006/portfolio-006").then((module) => module.Portfolio006),
  ),
  "portfolio-007": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-007/portfolio-007").then((module) => module.Portfolio007),
  ),
  "portfolio-008": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-008/portfolio-008").then((module) => module.Portfolio008),
  ),
  "portfolio-009": dynamic(() =>
    import("@/registry/blocks/portfolio/portfolio-009/portfolio-009").then((module) => module.Portfolio009),
  ),
} satisfies PreviewMap
