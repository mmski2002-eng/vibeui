// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "banner-001": dynamic(() =>
    import("@/registry/components/banner/banner-001/banner-001").then(
      (module) => module.Banner001,
    ),
  ),
  "banner-002": dynamic(() =>
    import("@/registry/components/banner/banner-002/banner-002").then(
      (module) => module.Banner002,
    ),
  ),
  "banner-003": dynamic(() =>
    import("@/registry/components/banner/banner-003/banner-003").then(
      (module) => module.Banner003,
    ),
  ),
  "banner-004": dynamic(() =>
    import("@/registry/components/banner/banner-004/banner-004").then(
      (module) => module.Banner004,
    ),
  ),
  "banner-005": dynamic(() =>
    import("@/registry/components/banner/banner-005/banner-005").then(
      (module) => module.Banner005,
    ),
  ),
  "banner-006": dynamic(() =>
    import("@/registry/components/banner/banner-006/banner-006").then(
      (module) => module.Banner006,
    ),
  ),
  "banner-007": dynamic(() =>
    import("@/registry/components/banner/banner-007/banner-007").then(
      (module) => module.Banner007,
    ),
  ),
  "banner-008": dynamic(() =>
    import("@/registry/components/banner/banner-008/banner-008").then(
      (module) => module.Banner008,
    ),
  ),
  "banner-009": dynamic(() =>
    import("@/registry/components/banner/banner-009/banner-009").then(
      (module) => module.Banner009,
    ),
  ),
  "banner-010": dynamic(() =>
    import("@/registry/components/banner/banner-010/banner-010").then(
      (module) => module.Banner010,
    ),
  ),
} satisfies PreviewMap
