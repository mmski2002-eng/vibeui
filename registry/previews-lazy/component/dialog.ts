// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "dialog-001": dynamic(() =>
    import("@/registry/components/dialog/dialog-001/dialog-001").then(
      (module) => module.Dialog001,
    ),
  ),
  "dialog-002": dynamic(() =>
    import("@/registry/components/dialog/dialog-002/dialog-002").then(
      (module) => module.Dialog002,
    ),
  ),
  "dialog-003": dynamic(() =>
    import("@/registry/components/dialog/dialog-003/dialog-003").then(
      (module) => module.Dialog003,
    ),
  ),
  "dialog-004": dynamic(() =>
    import("@/registry/components/dialog/dialog-004/dialog-004").then(
      (module) => module.Dialog004,
    ),
  ),
  "dialog-005": dynamic(() =>
    import("@/registry/components/dialog/dialog-005/dialog-005").then(
      (module) => module.Dialog005,
    ),
  ),
  "dialog-006": dynamic(() =>
    import("@/registry/components/dialog/dialog-006/dialog-006").then(
      (module) => module.Dialog006,
    ),
  ),
  "dialog-007": dynamic(() =>
    import("@/registry/components/dialog/dialog-007/dialog-007").then(
      (module) => module.Dialog007,
    ),
  ),
  "dialog-008": dynamic(() =>
    import("@/registry/components/dialog/dialog-008/dialog-008").then(
      (module) => module.Dialog008,
    ),
  ),
  "dialog-009": dynamic(() =>
    import("@/registry/components/dialog/dialog-009/dialog-009").then(
      (module) => module.Dialog009,
    ),
  ),
  "dialog-010": dynamic(() =>
    import("@/registry/components/dialog/dialog-010/dialog-010").then(
      (module) => module.Dialog010,
    ),
  ),
  "dialog-011": dynamic(() =>
    import("@/registry/components/dialog/dialog-011/dialog-011").then(
      (module) => module.Dialog011,
    ),
  ),
  "dialog-012": dynamic(() =>
    import("@/registry/components/dialog/dialog-012/dialog-012").then(
      (module) => module.Dialog012,
    ),
  ),
  "dialog-013": dynamic(() =>
    import("@/registry/components/dialog/dialog-013/dialog-013").then(
      (module) => module.Dialog013,
    ),
  ),
  "dialog-014": dynamic(() =>
    import("@/registry/components/dialog/dialog-014/dialog-014").then(
      (module) => module.Dialog014,
    ),
  ),
} satisfies PreviewMap
