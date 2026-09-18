// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "bento-001": dynamic(() =>
    import("@/registry/blocks/bento/bento-001/bento-001").then((module) => module.Bento001),
  ),
} satisfies PreviewMap
