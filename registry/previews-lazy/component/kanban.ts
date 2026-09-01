// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "kanban-001": dynamic(() =>
    import("@/registry/components/kanban/kanban-001/kanban-001").then(
      (module) => module.Kanban001,
    ),
  ),
  "kanban-002": dynamic(() =>
    import("@/registry/components/kanban/kanban-002/kanban-002").then(
      (module) => module.Kanban002,
    ),
  ),
  "kanban-003": dynamic(() =>
    import("@/registry/components/kanban/kanban-003/kanban-003").then(
      (module) => module.Kanban003,
    ),
  ),
  "kanban-004": dynamic(() =>
    import("@/registry/components/kanban/kanban-004/kanban-004").then(
      (module) => module.Kanban004,
    ),
  ),
  "kanban-005": dynamic(() =>
    import("@/registry/components/kanban/kanban-005/kanban-005").then(
      (module) => module.Kanban005,
    ),
  ),
  "kanban-006": dynamic(() =>
    import("@/registry/components/kanban/kanban-006/kanban-006").then(
      (module) => module.Kanban006,
    ),
  ),
  "kanban-007": dynamic(() =>
    import("@/registry/components/kanban/kanban-007/kanban-007").then(
      (module) => module.Kanban007,
    ),
  ),
} satisfies PreviewMap
