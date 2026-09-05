// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "logos-001": dynamic(() =>
    import("@/registry/animations/logos/logos-001/logos-001").then((module) => module.Logos001),
  ),
} satisfies PreviewMap
