// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "language-001": dynamic(() =>
    import("@/registry/blocks/language/language-001/language-001").then((module) => module.Language001),
  ),
  "language-002": dynamic(() =>
    import("@/registry/blocks/language/language-002/language-002").then((module) => module.Language002),
  ),
  "language-003": dynamic(() =>
    import("@/registry/blocks/language/language-003/language-003").then((module) => module.Language003),
  ),
} satisfies PreviewMap
