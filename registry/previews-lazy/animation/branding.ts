// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "branding-001": dynamic(() =>
    import("@/registry/animations/branding/branding-001/branding-001").then((module) => module.Branding001),
  ),
} satisfies PreviewMap
