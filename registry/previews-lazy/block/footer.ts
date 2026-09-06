// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "footer-001": dynamic(() =>
    import("@/registry/blocks/footer/footer-001/footer-001").then((module) => module.Footer001),
  ),
  "footer-002": dynamic(() =>
    import("@/registry/blocks/footer/footer-002/footer-002").then((module) => module.Footer002),
  ),
  "footer-003": dynamic(() =>
    import("@/registry/blocks/footer/footer-003/footer-003").then((module) => module.Footer003),
  ),
  "footer-004": dynamic(() =>
    import("@/registry/blocks/footer/footer-004/footer-004").then((module) => module.Footer004),
  ),
  "footer-005": dynamic(() =>
    import("@/registry/blocks/footer/footer-005/footer-005").then((module) => module.Footer005),
  ),
  "footer-006": dynamic(() =>
    import("@/registry/blocks/footer/footer-006/footer-006").then((module) => module.Footer006),
  ),
  "footer-007": dynamic(() =>
    import("@/registry/blocks/footer/footer-007/footer-007").then((module) => module.Footer007),
  ),
  "footer-008": dynamic(() =>
    import("@/registry/blocks/footer/footer-008/footer-008").then((module) => module.Footer008),
  ),
  "footer-009": dynamic(() =>
    import("@/registry/blocks/footer/footer-009/footer-009").then((module) => module.Footer009),
  ),
  "footer-010": dynamic(() =>
    import("@/registry/blocks/footer/footer-010/footer-010").then((module) => module.Footer010),
  ),
  "footer-011": dynamic(() =>
    import("@/registry/blocks/footer/footer-011/footer-011").then((module) => module.Footer011),
  ),
  "footer-012": dynamic(() =>
    import("@/registry/blocks/footer/footer-012/footer-012").then((module) => module.Footer012),
  ),
  "footer-013": dynamic(() =>
    import("@/registry/blocks/footer/footer-013/footer-013").then((module) => module.Footer013),
  ),
  "footer-014": dynamic(() =>
    import("@/registry/blocks/footer/footer-014/footer-014").then((module) => module.Footer014),
  ),
  "footer-015": dynamic(() =>
    import("@/registry/blocks/footer/footer-015/footer-015").then((module) => module.Footer015),
  ),
} satisfies PreviewMap
