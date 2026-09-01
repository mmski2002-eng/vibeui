// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "skeleton-001": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-001/skeleton-001").then(
      (module) => module.Skeleton001,
    ),
  ),
  "skeleton-002": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-002/skeleton-002").then(
      (module) => module.Skeleton002,
    ),
  ),
  "skeleton-003": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-003/skeleton-003").then(
      (module) => module.Skeleton003,
    ),
  ),
  "skeleton-004": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-004/skeleton-004").then(
      (module) => module.Skeleton004,
    ),
  ),
  "skeleton-005": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-005/skeleton-005").then(
      (module) => module.Skeleton005,
    ),
  ),
  "skeleton-006": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-006/skeleton-006").then(
      (module) => module.Skeleton006,
    ),
  ),
  "skeleton-007": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-007/skeleton-007").then(
      (module) => module.Skeleton007,
    ),
  ),
  "skeleton-008": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-008/skeleton-008").then(
      (module) => module.Skeleton008,
    ),
  ),
  "skeleton-009": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-009/skeleton-009").then(
      (module) => module.Skeleton009,
    ),
  ),
  "skeleton-010": dynamic(() =>
    import("@/registry/components/skeleton/skeleton-010/skeleton-010").then(
      (module) => module.Skeleton010,
    ),
  ),
} satisfies PreviewMap
