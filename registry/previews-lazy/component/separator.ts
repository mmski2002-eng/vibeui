// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "separator-001": dynamic(() =>
    import("@/registry/components/separator/separator-001/separator-001").then(
      (module) => module.Separator001,
    ),
  ),
  "separator-002": dynamic(() =>
    import("@/registry/components/separator/separator-002/separator-002").then(
      (module) => module.Separator002,
    ),
  ),
  "separator-003": dynamic(() =>
    import("@/registry/components/separator/separator-003/separator-003").then(
      (module) => module.Separator003,
    ),
  ),
  "separator-004": dynamic(() =>
    import("@/registry/components/separator/separator-004/separator-004").then(
      (module) => module.Separator004,
    ),
  ),
  "separator-005": dynamic(() =>
    import("@/registry/components/separator/separator-005/separator-005").then(
      (module) => module.Separator005,
    ),
  ),
  "separator-006": dynamic(() =>
    import("@/registry/components/separator/separator-006/separator-006").then(
      (module) => module.Separator006,
    ),
  ),
} satisfies PreviewMap
