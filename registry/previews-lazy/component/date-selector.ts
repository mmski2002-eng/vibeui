// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "date-001": dynamic(() =>
    import("@/registry/components/date-selector/date-001/date-001").then(
      (module) => module.Date001,
    ),
  ),
  "date-002": dynamic(() =>
    import("@/registry/components/date-selector/date-002/date-002").then(
      (module) => module.Date002,
    ),
  ),
  "date-003": dynamic(() =>
    import("@/registry/components/date-selector/date-003/date-003").then(
      (module) => module.Date003,
    ),
  ),
  "date-004": dynamic(() =>
    import("@/registry/components/date-selector/date-004/date-004").then(
      (module) => module.Date004,
    ),
  ),
  "date-005": dynamic(() =>
    import("@/registry/components/date-selector/date-005/date-005").then(
      (module) => module.Date005,
    ),
  ),
  "date-006": dynamic(() =>
    import("@/registry/components/date-selector/date-006/date-006").then(
      (module) => module.Date006,
    ),
  ),
  "date-007": dynamic(() =>
    import("@/registry/components/date-selector/date-007/date-007").then(
      (module) => module.Date007,
    ),
  ),
  "date-008": dynamic(() =>
    import("@/registry/components/date-selector/date-008/date-008").then(
      (module) => module.Date008,
    ),
  ),
  "date-009": dynamic(() =>
    import("@/registry/components/date-selector/date-009/date-009").then(
      (module) => module.Date009,
    ),
  ),
  "date-010": dynamic(() =>
    import("@/registry/components/date-selector/date-010/date-010").then(
      (module) => module.Date010,
    ),
  ),
  "date-011": dynamic(() =>
    import("@/registry/components/date-selector/date-011/date-011").then(
      (module) => module.Date011,
    ),
  ),
} satisfies PreviewMap
