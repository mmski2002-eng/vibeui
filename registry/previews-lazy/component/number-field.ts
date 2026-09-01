// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "number-001": dynamic(() =>
    import("@/registry/components/number-field/number-001/number-001").then(
      (module) => module.Number001,
    ),
  ),
  "number-002": dynamic(() =>
    import("@/registry/components/number-field/number-002/number-002").then(
      (module) => module.Number002,
    ),
  ),
  "number-003": dynamic(() =>
    import("@/registry/components/number-field/number-003/number-003").then(
      (module) => module.Number003,
    ),
  ),
  "number-004": dynamic(() =>
    import("@/registry/components/number-field/number-004/number-004").then(
      (module) => module.Number004,
    ),
  ),
  "number-005": dynamic(() =>
    import("@/registry/components/number-field/number-005/number-005").then(
      (module) => module.Number005,
    ),
  ),
  "number-006": dynamic(() =>
    import("@/registry/components/number-field/number-006/number-006").then(
      (module) => module.Number006,
    ),
  ),
  "number-007": dynamic(() =>
    import("@/registry/components/number-field/number-007/number-007").then(
      (module) => module.Number007,
    ),
  ),
  "number-008": dynamic(() =>
    import("@/registry/components/number-field/number-008/number-008").then(
      (module) => module.Number008,
    ),
  ),
} satisfies PreviewMap
