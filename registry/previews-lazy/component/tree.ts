// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "tree-001": dynamic(() =>
    import("@/registry/components/tree/tree-001/tree-001").then(
      (module) => module.Tree001,
    ),
  ),
  "tree-002": dynamic(() =>
    import("@/registry/components/tree/tree-002/tree-002").then(
      (module) => module.Tree002,
    ),
  ),
  "tree-003": dynamic(() =>
    import("@/registry/components/tree/tree-003/tree-003").then(
      (module) => module.Tree003,
    ),
  ),
  "tree-004": dynamic(() =>
    import("@/registry/components/tree/tree-004/tree-004").then(
      (module) => module.Tree004,
    ),
  ),
  "tree-005": dynamic(() =>
    import("@/registry/components/tree/tree-005/tree-005").then(
      (module) => module.Tree005,
    ),
  ),
  "tree-006": dynamic(() =>
    import("@/registry/components/tree/tree-006/tree-006").then(
      (module) => module.Tree006,
    ),
  ),
  "tree-007": dynamic(() =>
    import("@/registry/components/tree/tree-007/tree-007").then(
      (module) => module.Tree007,
    ),
  ),
  "tree-008": dynamic(() =>
    import("@/registry/components/tree/tree-008/tree-008").then(
      (module) => module.Tree008,
    ),
  ),
  "tree-009": dynamic(() =>
    import("@/registry/components/tree/tree-009/tree-009").then(
      (module) => module.Tree009,
    ),
  ),
  "tree-010": dynamic(() =>
    import("@/registry/components/tree/tree-010/tree-010").then(
      (module) => module.Tree010,
    ),
  ),
} satisfies PreviewMap
