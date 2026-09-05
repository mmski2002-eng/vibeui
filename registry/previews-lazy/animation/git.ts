// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "git-001": dynamic(() =>
    import("@/registry/animations/git/git-001/git-001").then((module) => module.Git001),
  ),
  "git-002": dynamic(() =>
    import("@/registry/animations/git/git-002/git-002").then((module) => module.Git002),
  ),
  "git-003": dynamic(() =>
    import("@/registry/animations/git/git-003/git-003").then((module) => module.Git003),
  ),
} satisfies PreviewMap
