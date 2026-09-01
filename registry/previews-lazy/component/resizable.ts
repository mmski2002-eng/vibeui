// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "resizable-001": dynamic(() =>
    import("@/registry/components/resizable/resizable-001/resizable-001").then(
      (module) => module.Resizable001,
    ),
  ),
  "resizable-002": dynamic(() =>
    import("@/registry/components/resizable/resizable-002/resizable-002").then(
      (module) => module.Resizable002,
    ),
  ),
  "resizable-003": dynamic(() =>
    import("@/registry/components/resizable/resizable-003/resizable-003").then(
      (module) => module.Resizable003,
    ),
  ),
  "resizable-004": dynamic(() =>
    import("@/registry/components/resizable/resizable-004/resizable-004").then(
      (module) => module.Resizable004,
    ),
  ),
  "resizable-005": dynamic(() =>
    import("@/registry/components/resizable/resizable-005/resizable-005").then(
      (module) => module.Resizable005,
    ),
  ),
  "resizable-006": dynamic(() =>
    import("@/registry/components/resizable/resizable-006/resizable-006").then(
      (module) => module.Resizable006,
    ),
  ),
  "resizable-007": dynamic(() =>
    import("@/registry/components/resizable/resizable-007/resizable-007").then(
      (module) => module.Resizable007,
    ),
  ),
  "resizable-008": dynamic(() =>
    import("@/registry/components/resizable/resizable-008/resizable-008").then(
      (module) => module.Resizable008,
    ),
  ),
  "resizable-009": dynamic(() =>
    import("@/registry/components/resizable/resizable-009/resizable-009").then(
      (module) => module.Resizable009,
    ),
  ),
  "resizable-010": dynamic(() =>
    import("@/registry/components/resizable/resizable-010/resizable-010").then(
      (module) => module.Resizable010,
    ),
  ),
} satisfies PreviewMap
