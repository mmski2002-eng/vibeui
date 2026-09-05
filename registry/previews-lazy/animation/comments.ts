// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "comments-001": dynamic(() =>
    import("@/registry/animations/comments/comments-001/comments-001").then((module) => module.Comments001),
  ),
} satisfies PreviewMap
