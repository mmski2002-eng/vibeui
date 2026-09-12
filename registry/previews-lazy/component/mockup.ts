// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "mockup-001": dynamic(() =>
    import("@/registry/components/mockup/mockup-001/mockup-001").then((module) => module.Mockup001),
  ),
  "mockup-002": dynamic(() =>
    import("@/registry/components/mockup/mockup-002/mockup-002").then((module) => module.Mockup002),
  ),
  "mockup-003": dynamic(() =>
    import("@/registry/components/mockup/mockup-003/mockup-003").then((module) => module.Mockup003),
  ),
  "mockup-004": dynamic(() =>
    import("@/registry/components/mockup/mockup-004/mockup-004").then((module) => module.Mockup004),
  ),
  "mockup-005": dynamic(() =>
    import("@/registry/components/mockup/mockup-005/mockup-005").then((module) => module.Mockup005),
  ),
  "mockup-006": dynamic(() =>
    import("@/registry/components/mockup/mockup-006/mockup-006").then((module) => module.Mockup006),
  ),
  "mockup-007": dynamic(() =>
    import("@/registry/components/mockup/mockup-007/mockup-007").then((module) => module.Mockup007),
  ),
  "mockup-008": dynamic(() =>
    import("@/registry/components/mockup/mockup-008/mockup-008").then((module) => module.Mockup008),
  ),
  "mockup-009": dynamic(() =>
    import("@/registry/components/mockup/mockup-009/mockup-009").then((module) => module.Mockup009),
  ),
} satisfies PreviewMap
