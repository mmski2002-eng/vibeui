// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "team-001": dynamic(() =>
    import("@/registry/animations/team/team-001/team-001").then((module) => module.Team001),
  ),
} satisfies PreviewMap
