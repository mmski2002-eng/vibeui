// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "about-001": dynamic(() =>
    import("@/registry/blocks/about/about-001/about-001").then((module) => module.About001),
  ),
  "about-002": dynamic(() =>
    import("@/registry/blocks/about/about-002/about-002").then((module) => module.About002),
  ),
  "about-003": dynamic(() =>
    import("@/registry/blocks/about/about-003/about-003").then((module) => module.About003),
  ),
  "about-004": dynamic(() =>
    import("@/registry/blocks/about/about-004/about-004").then((module) => module.About004),
  ),
  "about-005": dynamic(() =>
    import("@/registry/blocks/about/about-005/about-005").then((module) => module.About005),
  ),
  "about-006": dynamic(() =>
    import("@/registry/blocks/about/about-006/about-006").then((module) => module.About006),
  ),
  "about-007": dynamic(() =>
    import("@/registry/blocks/about/about-007/about-007").then((module) => module.About007),
  ),
  "about-008": dynamic(() =>
    import("@/registry/blocks/about/about-008/about-008").then((module) => module.About008),
  ),
} satisfies PreviewMap
