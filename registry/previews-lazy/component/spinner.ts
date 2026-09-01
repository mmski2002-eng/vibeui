// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "spinner-001": dynamic(() =>
    import("@/registry/components/spinner/spinner-001/spinner-001").then(
      (module) => module.Spinner001,
    ),
  ),
  "spinner-002": dynamic(() =>
    import("@/registry/components/spinner/spinner-002/spinner-002").then(
      (module) => module.Spinner002,
    ),
  ),
  "spinner-003": dynamic(() =>
    import("@/registry/components/spinner/spinner-003/spinner-003").then(
      (module) => module.Spinner003,
    ),
  ),
  "spinner-004": dynamic(() =>
    import("@/registry/components/spinner/spinner-004/spinner-004").then(
      (module) => module.Spinner004,
    ),
  ),
  "spinner-005": dynamic(() =>
    import("@/registry/components/spinner/spinner-005/spinner-005").then(
      (module) => module.Spinner005,
    ),
  ),
  "spinner-006": dynamic(() =>
    import("@/registry/components/spinner/spinner-006/spinner-006").then(
      (module) => module.Spinner006,
    ),
  ),
  "spinner-007": dynamic(() =>
    import("@/registry/components/spinner/spinner-007/spinner-007").then(
      (module) => module.Spinner007,
    ),
  ),
  "spinner-008": dynamic(() =>
    import("@/registry/components/spinner/spinner-008/spinner-008").then(
      (module) => module.Spinner008,
    ),
  ),
  "spinner-009": dynamic(() =>
    import("@/registry/components/spinner/spinner-009/spinner-009").then(
      (module) => module.Spinner009,
    ),
  ),
  "spinner-010": dynamic(() =>
    import("@/registry/components/spinner/spinner-010/spinner-010").then(
      (module) => module.Spinner010,
    ),
  ),
  "spinner-011": dynamic(() =>
    import("@/registry/components/spinner/spinner-011/spinner-011").then(
      (module) => module.Spinner011,
    ),
  ),
  "spinner-012": dynamic(() =>
    import("@/registry/components/spinner/spinner-012/spinner-012").then(
      (module) => module.Spinner012,
    ),
  ),
} satisfies PreviewMap
