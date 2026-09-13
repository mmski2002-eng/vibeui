// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "sketch-001": dynamic(() =>
    import("@/registry/animations/sketch/sketch-001/sketch-001").then((module) => module.Sketch001),
  ),
  "sketch-002": dynamic(() =>
    import("@/registry/animations/sketch/sketch-002/sketch-002").then((module) => module.Sketch002),
  ),
  "sketch-003": dynamic(() =>
    import("@/registry/animations/sketch/sketch-003/sketch-003").then((module) => module.Sketch003),
  ),
  "sketch-004": dynamic(() =>
    import("@/registry/animations/sketch/sketch-004/sketch-004").then((module) => module.Sketch004),
  ),
  "sketch-005": dynamic(() =>
    import("@/registry/animations/sketch/sketch-005/sketch-005").then((module) => module.Sketch005),
  ),
  "sketch-006": dynamic(() =>
    import("@/registry/animations/sketch/sketch-006/sketch-006").then((module) => module.Sketch006),
  ),
  "sketch-007": dynamic(() =>
    import("@/registry/animations/sketch/sketch-007/sketch-007").then((module) => module.Sketch007),
  ),
  "sketch-008": dynamic(() =>
    import("@/registry/animations/sketch/sketch-008/sketch-008").then((module) => module.Sketch008),
  ),
  "sketch-009": dynamic(() =>
    import("@/registry/animations/sketch/sketch-009/sketch-009").then((module) => module.Sketch009),
  ),
  "sketch-010": dynamic(() =>
    import("@/registry/animations/sketch/sketch-010/sketch-010").then((module) => module.Sketch010),
  ),
  "sketch-011": dynamic(() =>
    import("@/registry/animations/sketch/sketch-011/sketch-011").then((module) => module.Sketch011),
  ),
  "sketch-012": dynamic(() =>
    import("@/registry/animations/sketch/sketch-012/sketch-012").then((module) => module.Sketch012),
  ),
  "sketch-013": dynamic(() =>
    import("@/registry/animations/sketch/sketch-013/sketch-013").then((module) => module.Sketch013),
  ),
  "sketch-014": dynamic(() =>
    import("@/registry/animations/sketch/sketch-014/sketch-014").then((module) => module.Sketch014),
  ),
  "sketch-015": dynamic(() =>
    import("@/registry/animations/sketch/sketch-015/sketch-015").then((module) => module.Sketch015),
  ),
} satisfies PreviewMap
