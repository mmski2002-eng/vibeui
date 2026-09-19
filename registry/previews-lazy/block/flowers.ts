// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "flowers-001": dynamic(() =>
    import("@/registry/blocks/flowers/flowers-001/flowers-001").then((module) => module.Flowers001),
  ),
  "flowers-002": dynamic(() =>
    import("@/registry/blocks/flowers/flowers-002/flowers-002").then((module) => module.Flowers002),
  ),
  "flowers-003": dynamic(() =>
    import("@/registry/blocks/flowers/flowers-003/flowers-003").then((module) => module.Flowers003),
  ),
  "flowers-004": dynamic(() =>
    import("@/registry/blocks/flowers/flowers-004/flowers-004").then((module) => module.Flowers004),
  ),
  "flowers-005": dynamic(() =>
    import("@/registry/blocks/flowers/flowers-005/flowers-005").then((module) => module.Flowers005),
  ),
} satisfies PreviewMap
