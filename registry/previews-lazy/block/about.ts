// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "about-001": dynamic(() =>
    import("@/registry/blocks/about/about-001/about-001").then((module) => module.About001),
  ),
  "about-002": dynamic(() =>
    import("@/registry/blocks/about/about-002/about-002").then((module) => module.About002),
  ),
  "about-003": dynamic(() =>
    import("@/registry/blocks/about/about-003/about-003").then((module) => module.About003),
  ),
  "about-004": dynamic(() =>
    import("@/registry/blocks/about/about-004/about-004").then((module) => module.About004),
  ),
  "about-005": dynamic(() =>
    import("@/registry/blocks/about/about-005/about-005").then((module) => module.About005),
  ),
  "about-006": dynamic(() =>
    import("@/registry/blocks/about/about-006/about-006").then((module) => module.About006),
  ),
  "about-007": dynamic(() =>
    import("@/registry/blocks/about/about-007/about-007").then((module) => module.About007),
  ),
  "about-008": dynamic(() =>
    import("@/registry/blocks/about/about-008/about-008").then((module) => module.About008),
  ),
  "about-009": dynamic(() =>
    import("@/registry/blocks/about/about-009/about-009").then((module) => module.About009),
  ),
  "about-010": dynamic(() =>
    import("@/registry/blocks/about/about-010/about-010").then((module) => module.About010),
  ),
  "about-011": dynamic(() =>
    import("@/registry/blocks/about/about-011/about-011").then((module) => module.About011),
  ),
  "about-012": dynamic(() =>
    import("@/registry/blocks/about/about-012/about-012").then((module) => module.About012),
  ),
  "about-013": dynamic(() =>
    import("@/registry/blocks/about/about-013/about-013").then((module) => module.About013),
  ),
  "about-014": dynamic(() =>
    import("@/registry/blocks/about/about-014/about-014").then((module) => module.About014),
  ),
  "about-017": dynamic(() =>
    import("@/registry/blocks/about/about-017/about-017").then((module) => module.About017),
  ),
  "stats-001": dynamic(() =>
    import("@/registry/blocks/about/stats-001/stats-001").then((module) => module.Stats001),
  ),
  "stats-002": dynamic(() =>
    import("@/registry/blocks/about/stats-002/stats-002").then((module) => module.Stats002),
  ),
  "stats-012": dynamic(() =>
    import("@/registry/blocks/about/stats-012/stats-012").then((module) => module.Stats012),
  ),
  "video-001": dynamic(() =>
    import("@/registry/blocks/about/video-001/video-001").then((module) => module.Video001),
  ),
  "video-002": dynamic(() =>
    import("@/registry/blocks/about/video-002/video-002").then((module) => module.Video002),
  ),
  "video-003": dynamic(() =>
    import("@/registry/blocks/about/video-003/video-003").then((module) => module.Video003),
  ),
} satisfies PreviewMap
