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
} satisfies PreviewMap
