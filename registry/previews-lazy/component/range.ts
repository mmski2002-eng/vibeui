// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "range-001": dynamic(() =>
    import("@/registry/components/range/range-001/range-001").then(
      (module) => module.Range001,
    ),
  ),
  "range-002": dynamic(() =>
    import("@/registry/components/range/range-002/range-002").then(
      (module) => module.Range002,
    ),
  ),
  "range-003": dynamic(() =>
    import("@/registry/components/range/range-003/range-003").then(
      (module) => module.Range003,
    ),
  ),
  "range-004": dynamic(() =>
    import("@/registry/components/range/range-004/range-004").then(
      (module) => module.Range004,
    ),
  ),
  "range-005": dynamic(() =>
    import("@/registry/components/range/range-005/range-005").then(
      (module) => module.Range005,
    ),
  ),
  "range-006": dynamic(() =>
    import("@/registry/components/range/range-006/range-006").then(
      (module) => module.Range006,
    ),
  ),
  "range-007": dynamic(() =>
    import("@/registry/components/range/range-007/range-007").then(
      (module) => module.Range007,
    ),
  ),
} satisfies PreviewMap
