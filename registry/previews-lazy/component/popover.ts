// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "popover-001": dynamic(() =>
    import("@/registry/components/popover/popover-001/popover-001").then(
      (module) => module.Popover001,
    ),
  ),
  "popover-002": dynamic(() =>
    import("@/registry/components/popover/popover-002/popover-002").then(
      (module) => module.Popover002,
    ),
  ),
  "popover-003": dynamic(() =>
    import("@/registry/components/popover/popover-003/popover-003").then(
      (module) => module.Popover003,
    ),
  ),
  "popover-004": dynamic(() =>
    import("@/registry/components/popover/popover-004/popover-004").then(
      (module) => module.Popover004,
    ),
  ),
  "popover-005": dynamic(() =>
    import("@/registry/components/popover/popover-005/popover-005").then(
      (module) => module.Popover005,
    ),
  ),
  "popover-006": dynamic(() =>
    import("@/registry/components/popover/popover-006/popover-006").then(
      (module) => module.Popover006,
    ),
  ),
  "popover-007": dynamic(() =>
    import("@/registry/components/popover/popover-007/popover-007").then(
      (module) => module.Popover007,
    ),
  ),
  "popover-008": dynamic(() =>
    import("@/registry/components/popover/popover-008/popover-008").then(
      (module) => module.Popover008,
    ),
  ),
  "popover-009": dynamic(() =>
    import("@/registry/components/popover/popover-009/popover-009").then(
      (module) => module.Popover009,
    ),
  ),
  "popover-010": dynamic(() =>
    import("@/registry/components/popover/popover-010/popover-010").then(
      (module) => module.Popover010,
    ),
  ),
  "popover-011": dynamic(() =>
    import("@/registry/components/popover/popover-011/popover-011").then(
      (module) => module.Popover011,
    ),
  ),
} satisfies PreviewMap
