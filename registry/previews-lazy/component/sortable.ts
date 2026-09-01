// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "sortable-001": dynamic(() =>
    import("@/registry/components/sortable/sortable-001/sortable-001").then(
      (module) => module.Sortable001,
    ),
  ),
  "sortable-002": dynamic(() =>
    import("@/registry/components/sortable/sortable-002/sortable-002").then(
      (module) => module.Sortable002,
    ),
  ),
  "sortable-003": dynamic(() =>
    import("@/registry/components/sortable/sortable-003/sortable-003").then(
      (module) => module.Sortable003,
    ),
  ),
  "sortable-004": dynamic(() =>
    import("@/registry/components/sortable/sortable-004/sortable-004").then(
      (module) => module.Sortable004,
    ),
  ),
  "sortable-005": dynamic(() =>
    import("@/registry/components/sortable/sortable-005/sortable-005").then(
      (module) => module.Sortable005,
    ),
  ),
  "sortable-006": dynamic(() =>
    import("@/registry/components/sortable/sortable-006/sortable-006").then(
      (module) => module.Sortable006,
    ),
  ),
  "sortable-007": dynamic(() =>
    import("@/registry/components/sortable/sortable-007/sortable-007").then(
      (module) => module.Sortable007,
    ),
  ),
  "sortable-008": dynamic(() =>
    import("@/registry/components/sortable/sortable-008/sortable-008").then(
      (module) => module.Sortable008,
    ),
  ),
} satisfies PreviewMap
