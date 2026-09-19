// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "bento-001": dynamic(() =>
    import("@/registry/blocks/bento/bento-001/bento-001").then((module) => module.Bento001),
  ),
  "bento-002": dynamic(() =>
    import("@/registry/blocks/bento/bento-002/bento-002").then((module) => module.Bento002),
  ),
  "bento-008": dynamic(() =>
    import("@/registry/blocks/bento/bento-008/bento-008").then((module) => module.Bento008),
  ),
  "bento-009": dynamic(() =>
    import("@/registry/blocks/bento/bento-009/bento-009").then((module) => module.Bento009),
  ),
  "bento-010": dynamic(() =>
    import("@/registry/blocks/bento/bento-010/bento-010").then((module) => module.Bento010),
  ),
  "bento-011": dynamic(() =>
    import("@/registry/blocks/bento/bento-011/bento-011").then((module) => module.Bento011),
  ),
  "bento-012": dynamic(() =>
    import("@/registry/blocks/bento/bento-012/bento-012").then((module) => module.Bento012),
  ),
  "bento-014": dynamic(() =>
    import("@/registry/blocks/bento/bento-014/bento-014").then((module) => module.Bento014),
  ),
} satisfies PreviewMap
