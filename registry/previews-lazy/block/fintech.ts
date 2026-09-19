// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "fintech-001": dynamic(() =>
    import("@/registry/blocks/fintech/fintech-001/fintech-001").then((module) => module.Fintech001),
  ),
  "fintech-002": dynamic(() =>
    import("@/registry/blocks/fintech/fintech-002/fintech-002").then((module) => module.Fintech002),
  ),
  "fintech-003": dynamic(() =>
    import("@/registry/blocks/fintech/fintech-003/fintech-003").then((module) => module.Fintech003),
  ),
} satisfies PreviewMap
