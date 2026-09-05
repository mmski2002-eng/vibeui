// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "progress-001": dynamic(() =>
    import("@/registry/components/progress/progress-001/progress-001").then((module) => module.Progress001),
  ),
  "progress-002": dynamic(() =>
    import("@/registry/components/progress/progress-002/progress-002").then((module) => module.Progress002),
  ),
  "progress-003": dynamic(() =>
    import("@/registry/components/progress/progress-003/progress-003").then((module) => module.Progress003),
  ),
  "progress-004": dynamic(() =>
    import("@/registry/components/progress/progress-004/progress-004").then((module) => module.Progress004),
  ),
  "progress-005": dynamic(() =>
    import("@/registry/components/progress/progress-005/progress-005").then((module) => module.Progress005),
  ),
  "progress-006": dynamic(() =>
    import("@/registry/components/progress/progress-006/progress-006").then((module) => module.Progress006),
  ),
  "progress-007": dynamic(() =>
    import("@/registry/components/progress/progress-007/progress-007").then((module) => module.Progress007),
  ),
  "progress-008": dynamic(() =>
    import("@/registry/components/progress/progress-008/progress-008").then((module) => module.Progress008),
  ),
  "progress-009": dynamic(() =>
    import("@/registry/components/progress/progress-009/progress-009").then((module) => module.Progress009),
  ),
} satisfies PreviewMap
