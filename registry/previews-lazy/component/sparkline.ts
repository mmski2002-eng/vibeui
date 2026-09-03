// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "sparkline-001": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-001/sparkline-001").then(
      (module) => module.Sparkline001,
    ),
  ),
  "sparkline-002": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-002/sparkline-002").then(
      (module) => module.Sparkline002,
    ),
  ),
  "sparkline-003": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-003/sparkline-003").then(
      (module) => module.Sparkline003,
    ),
  ),
  "sparkline-004": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-004/sparkline-004").then(
      (module) => module.Sparkline004,
    ),
  ),
  "sparkline-005": dynamic(() =>
    import("@/registry/components/sparkline/sparkline-005/sparkline-005").then(
      (module) => module.Sparkline005,
    ),
  ),
} satisfies PreviewMap
