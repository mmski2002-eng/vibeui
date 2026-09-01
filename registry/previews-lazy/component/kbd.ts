// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "kbd-001": dynamic(() =>
    import("@/registry/components/kbd/kbd-001/kbd-001").then(
      (module) => module.Kbd001,
    ),
  ),
  "kbd-002": dynamic(() =>
    import("@/registry/components/kbd/kbd-002/kbd-002").then(
      (module) => module.Kbd002,
    ),
  ),
  "kbd-003": dynamic(() =>
    import("@/registry/components/kbd/kbd-003/kbd-003").then(
      (module) => module.Kbd003,
    ),
  ),
  "kbd-004": dynamic(() =>
    import("@/registry/components/kbd/kbd-004/kbd-004").then(
      (module) => module.Kbd004,
    ),
  ),
  "kbd-005": dynamic(() =>
    import("@/registry/components/kbd/kbd-005/kbd-005").then(
      (module) => module.Kbd005,
    ),
  ),
  "kbd-006": dynamic(() =>
    import("@/registry/components/kbd/kbd-006/kbd-006").then(
      (module) => module.Kbd006,
    ),
  ),
} satisfies PreviewMap
