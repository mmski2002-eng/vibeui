// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "field-001": dynamic(() =>
    import("@/registry/components/field/field-001/field-001").then(
      (module) => module.Field001,
    ),
  ),
  "field-002": dynamic(() =>
    import("@/registry/components/field/field-002/field-002").then(
      (module) => module.Field002,
    ),
  ),
  "field-003": dynamic(() =>
    import("@/registry/components/field/field-003/field-003").then(
      (module) => module.Field003,
    ),
  ),
  "field-004": dynamic(() =>
    import("@/registry/components/field/field-004/field-004").then(
      (module) => module.Field004,
    ),
  ),
  "field-005": dynamic(() =>
    import("@/registry/components/field/field-005/field-005").then(
      (module) => module.Field005,
    ),
  ),
  "field-006": dynamic(() =>
    import("@/registry/components/field/field-006/field-006").then(
      (module) => module.Field006,
    ),
  ),
  "field-007": dynamic(() =>
    import("@/registry/components/field/field-007/field-007").then(
      (module) => module.Field007,
    ),
  ),
  "field-008": dynamic(() =>
    import("@/registry/components/field/field-008/field-008").then(
      (module) => module.Field008,
    ),
  ),
  "field-009": dynamic(() =>
    import("@/registry/components/field/field-009/field-009").then(
      (module) => module.Field009,
    ),
  ),
  "field-010": dynamic(() =>
    import("@/registry/components/field/field-010/field-010").then(
      (module) => module.Field010,
    ),
  ),
  "field-011": dynamic(() =>
    import("@/registry/components/field/field-011/field-011").then(
      (module) => module.Field011,
    ),
  ),
  "field-012": dynamic(() =>
    import("@/registry/components/field/field-012/field-012").then(
      (module) => module.Field012,
    ),
  ),
} satisfies PreviewMap
