// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "pagination-001": dynamic(() =>
    import("@/registry/components/pagination/pagination-001/pagination-001").then(
      (module) => module.Pagination001,
    ),
  ),
  "pagination-002": dynamic(() =>
    import("@/registry/components/pagination/pagination-002/pagination-002").then(
      (module) => module.Pagination002,
    ),
  ),
  "pagination-003": dynamic(() =>
    import("@/registry/components/pagination/pagination-003/pagination-003").then(
      (module) => module.Pagination003,
    ),
  ),
  "pagination-004": dynamic(() =>
    import("@/registry/components/pagination/pagination-004/pagination-004").then(
      (module) => module.Pagination004,
    ),
  ),
  "pagination-005": dynamic(() =>
    import("@/registry/components/pagination/pagination-005/pagination-005").then(
      (module) => module.Pagination005,
    ),
  ),
  "pagination-006": dynamic(() =>
    import("@/registry/components/pagination/pagination-006/pagination-006").then(
      (module) => module.Pagination006,
    ),
  ),
  "pagination-007": dynamic(() =>
    import("@/registry/components/pagination/pagination-007/pagination-007").then(
      (module) => module.Pagination007,
    ),
  ),
  "pagination-008": dynamic(() =>
    import("@/registry/components/pagination/pagination-008/pagination-008").then(
      (module) => module.Pagination008,
    ),
  ),
  "pagination-009": dynamic(() =>
    import("@/registry/components/pagination/pagination-009/pagination-009").then(
      (module) => module.Pagination009,
    ),
  ),
  "pagination-010": dynamic(() =>
    import("@/registry/components/pagination/pagination-010/pagination-010").then(
      (module) => module.Pagination010,
    ),
  ),
  "pagination-011": dynamic(() =>
    import("@/registry/components/pagination/pagination-011/pagination-011").then(
      (module) => module.Pagination011,
    ),
  ),
  "pagination-012": dynamic(() =>
    import("@/registry/components/pagination/pagination-012/pagination-012").then(
      (module) => module.Pagination012,
    ),
  ),
  "pagination-013": dynamic(() =>
    import("@/registry/components/pagination/pagination-013/pagination-013").then(
      (module) => module.Pagination013,
    ),
  ),
  "pagination-014": dynamic(() =>
    import("@/registry/components/pagination/pagination-014/pagination-014").then(
      (module) => module.Pagination014,
    ),
  ),
  "pagination-015": dynamic(() =>
    import("@/registry/components/pagination/pagination-015/pagination-015").then(
      (module) => module.Pagination015,
    ),
  ),
} satisfies PreviewMap
