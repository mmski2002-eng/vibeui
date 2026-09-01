// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "filters-001": dynamic(() =>
    import("@/registry/components/filters/filters-001/filters-001").then(
      (module) => module.Filters001,
    ),
  ),
  "filters-002": dynamic(() =>
    import("@/registry/components/filters/filters-002/filters-002").then(
      (module) => module.Filters002,
    ),
  ),
  "filters-003": dynamic(() =>
    import("@/registry/components/filters/filters-003/filters-003").then(
      (module) => module.Filters003,
    ),
  ),
  "filters-004": dynamic(() =>
    import("@/registry/components/filters/filters-004/filters-004").then(
      (module) => module.Filters004,
    ),
  ),
  "filters-005": dynamic(() =>
    import("@/registry/components/filters/filters-005/filters-005").then(
      (module) => module.Filters005,
    ),
  ),
  "filters-006": dynamic(() =>
    import("@/registry/components/filters/filters-006/filters-006").then(
      (module) => module.Filters006,
    ),
  ),
  "filters-007": dynamic(() =>
    import("@/registry/components/filters/filters-007/filters-007").then(
      (module) => module.Filters007,
    ),
  ),
  "filters-008": dynamic(() =>
    import("@/registry/components/filters/filters-008/filters-008").then(
      (module) => module.Filters008,
    ),
  ),
  "filters-009": dynamic(() =>
    import("@/registry/components/filters/filters-009/filters-009").then(
      (module) => module.Filters009,
    ),
  ),
  "filters-010": dynamic(() =>
    import("@/registry/components/filters/filters-010/filters-010").then(
      (module) => module.Filters010,
    ),
  ),
  "filters-011": dynamic(() =>
    import("@/registry/components/filters/filters-011/filters-011").then(
      (module) => module.Filters011,
    ),
  ),
  "filters-012": dynamic(() =>
    import("@/registry/components/filters/filters-012/filters-012").then(
      (module) => module.Filters012,
    ),
  ),
} satisfies PreviewMap
