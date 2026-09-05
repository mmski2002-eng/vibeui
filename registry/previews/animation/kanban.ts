// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "kanban-anim-001": () =>
    import("@/registry/animations/kanban/kanban-anim-001/kanban-anim-001").then((module) => module.KanbanAnim001),
} satisfies PreviewLoaderMap
