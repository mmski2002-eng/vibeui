// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "command-001": dynamic(() =>
    import("@/registry/components/command/command-001/command-001").then(
      (module) => module.Command001,
    ),
  ),
  "command-002": dynamic(() =>
    import("@/registry/components/command/command-002/command-002").then(
      (module) => module.Command002,
    ),
  ),
  "command-003": dynamic(() =>
    import("@/registry/components/command/command-003/command-003").then(
      (module) => module.Command003,
    ),
  ),
  "command-004": dynamic(() =>
    import("@/registry/components/command/command-004/command-004").then(
      (module) => module.Command004,
    ),
  ),
  "command-005": dynamic(() =>
    import("@/registry/components/command/command-005/command-005").then(
      (module) => module.Command005,
    ),
  ),
  "command-006": dynamic(() =>
    import("@/registry/components/command/command-006/command-006").then(
      (module) => module.Command006,
    ),
  ),
  "command-007": dynamic(() =>
    import("@/registry/components/command/command-007/command-007").then(
      (module) => module.Command007,
    ),
  ),
  "command-008": dynamic(() =>
    import("@/registry/components/command/command-008/command-008").then(
      (module) => module.Command008,
    ),
  ),
  "command-009": dynamic(() =>
    import("@/registry/components/command/command-009/command-009").then(
      (module) => module.Command009,
    ),
  ),
  "command-010": dynamic(() =>
    import("@/registry/components/command/command-010/command-010").then(
      (module) => module.Command010,
    ),
  ),
  "command-011": dynamic(() =>
    import("@/registry/components/command/command-011/command-011").then(
      (module) => module.Command011,
    ),
  ),
  "command-012": dynamic(() =>
    import("@/registry/components/command/command-012/command-012").then(
      (module) => module.Command012,
    ),
  ),
} satisfies PreviewMap
