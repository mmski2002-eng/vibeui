// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "kanban-anim-001": dynamic(() =>
    import("@/registry/animations/kanban/kanban-anim-001/kanban-anim-001").then((module) => module.KanbanAnim001),
  ),
} satisfies PreviewMap
