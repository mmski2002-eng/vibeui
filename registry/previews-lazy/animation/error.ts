// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "error-001": dynamic(() =>
    import("@/registry/animations/error/error-001/error-001").then((module) => module.Error001),
  ),
  "error-002": dynamic(() =>
    import("@/registry/animations/error/error-002/error-002").then((module) => module.Error002),
  ),
} satisfies PreviewMap
