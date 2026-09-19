// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "market-001": dynamic(() =>
    import("@/registry/blocks/market/market-001/market-001").then((module) => module.Market001),
  ),
  "market-002": dynamic(() =>
    import("@/registry/blocks/market/market-002/market-002").then((module) => module.Market002),
  ),
  "market-003": dynamic(() =>
    import("@/registry/blocks/market/market-003/market-003").then((module) => module.Market003),
  ),
} satisfies PreviewMap
