// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "toggle-001": dynamic(() =>
    import("@/registry/components/toggle/toggle-001/toggle-001").then(
      (module) => module.Toggle001,
    ),
  ),
  "toggle-002": dynamic(() =>
    import("@/registry/components/toggle/toggle-002/toggle-002").then(
      (module) => module.Toggle002,
    ),
  ),
  "toggle-003": dynamic(() =>
    import("@/registry/components/toggle/toggle-003/toggle-003").then(
      (module) => module.Toggle003,
    ),
  ),
  "toggle-004": dynamic(() =>
    import("@/registry/components/toggle/toggle-004/toggle-004").then(
      (module) => module.Toggle004,
    ),
  ),
  "toggle-005": dynamic(() =>
    import("@/registry/components/toggle/toggle-005/toggle-005").then(
      (module) => module.Toggle005,
    ),
  ),
  "toggle-006": dynamic(() =>
    import("@/registry/components/toggle/toggle-006/toggle-006").then(
      (module) => module.Toggle006,
    ),
  ),
  "toggle-007": dynamic(() =>
    import("@/registry/components/toggle/toggle-007/toggle-007").then(
      (module) => module.Toggle007,
    ),
  ),
  "toggle-008": dynamic(() =>
    import("@/registry/components/toggle/toggle-008/toggle-008").then(
      (module) => module.Toggle008,
    ),
  ),
  "toggle-009": dynamic(() =>
    import("@/registry/components/toggle/toggle-009/toggle-009").then(
      (module) => module.Toggle009,
    ),
  ),
  "toggle-010": dynamic(() =>
    import("@/registry/components/toggle/toggle-010/toggle-010").then(
      (module) => module.Toggle010,
    ),
  ),
  "toggle-011": dynamic(() =>
    import("@/registry/components/toggle/toggle-011/toggle-011").then(
      (module) => module.Toggle011,
    ),
  ),
  "toggle-012": dynamic(() =>
    import("@/registry/components/toggle/toggle-012/toggle-012").then(
      (module) => module.Toggle012,
    ),
  ),
  "toggle-013": dynamic(() =>
    import("@/registry/components/toggle/toggle-013/toggle-013").then(
      (module) => module.Toggle013,
    ),
  ),
  "toggle-014": dynamic(() =>
    import("@/registry/components/toggle/toggle-014/toggle-014").then(
      (module) => module.Toggle014,
    ),
  ),
} satisfies PreviewMap
