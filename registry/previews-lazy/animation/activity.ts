// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "activity-001": dynamic(() =>
    import("@/registry/animations/activity/activity-001/activity-001").then(
      (module) => module.Activity001,
    ),
  ),
} satisfies PreviewMap
