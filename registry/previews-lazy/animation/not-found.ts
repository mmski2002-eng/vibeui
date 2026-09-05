// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "not-found-001": dynamic(() =>
    import("@/registry/animations/not-found/not-found-001/not-found-001").then((module) => module.NotFound001),
  ),
} satisfies PreviewMap
