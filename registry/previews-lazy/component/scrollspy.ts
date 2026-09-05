// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "scrollspy-001": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-001/scrollspy-001").then((module) => module.Scrollspy001),
  ),
  "scrollspy-002": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-002/scrollspy-002").then((module) => module.Scrollspy002),
  ),
  "scrollspy-003": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-003/scrollspy-003").then((module) => module.Scrollspy003),
  ),
  "scrollspy-004": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-004/scrollspy-004").then((module) => module.Scrollspy004),
  ),
  "scrollspy-005": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-005/scrollspy-005").then((module) => module.Scrollspy005),
  ),
  "scrollspy-006": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-006/scrollspy-006").then((module) => module.Scrollspy006),
  ),
  "scrollspy-007": dynamic(() =>
    import("@/registry/components/scrollspy/scrollspy-007/scrollspy-007").then((module) => module.Scrollspy007),
  ),
} satisfies PreviewMap
