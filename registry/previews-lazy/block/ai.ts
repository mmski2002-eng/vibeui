// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "ai-001": dynamic(() =>
    import("@/registry/blocks/ai/ai-001/ai-001").then((module) => module.Ai001),
  ),
  "ai-002": dynamic(() =>
    import("@/registry/blocks/ai/ai-002/ai-002").then((module) => module.Ai002),
  ),
  "ai-003": dynamic(() =>
    import("@/registry/blocks/ai/ai-003/ai-003").then((module) => module.Ai003),
  ),
  "ai-004": dynamic(() =>
    import("@/registry/blocks/ai/ai-004/ai-004").then((module) => module.Ai004),
  ),
  "ai-005": dynamic(() =>
    import("@/registry/blocks/ai/ai-005/ai-005").then((module) => module.Ai005),
  ),
  "ai-006": dynamic(() =>
    import("@/registry/blocks/ai/ai-006/ai-006").then((module) => module.Ai006),
  ),
  "ai-007": dynamic(() =>
    import("@/registry/blocks/ai/ai-007/ai-007").then((module) => module.Ai007),
  ),
  "ai-008": dynamic(() =>
    import("@/registry/blocks/ai/ai-008/ai-008").then((module) => module.Ai008),
  ),
  "ai-009": dynamic(() =>
    import("@/registry/blocks/ai/ai-009/ai-009").then((module) => module.Ai009),
  ),
  "ai-010": dynamic(() =>
    import("@/registry/blocks/ai/ai-010/ai-010").then((module) => module.Ai010),
  ),
  "ai-011": dynamic(() =>
    import("@/registry/blocks/ai/ai-011/ai-011").then((module) => module.Ai011),
  ),
  "ai-012": dynamic(() =>
    import("@/registry/blocks/ai/ai-012/ai-012").then((module) => module.Ai012),
  ),
  "ai-013": dynamic(() =>
    import("@/registry/blocks/ai/ai-013/ai-013").then((module) => module.Ai013),
  ),
  "ai-014": dynamic(() =>
    import("@/registry/blocks/ai/ai-014/ai-014").then((module) => module.Ai014),
  ),
  "ai-015": dynamic(() =>
    import("@/registry/blocks/ai/ai-015/ai-015").then((module) => module.Ai015),
  ),
  "ai-016": dynamic(() =>
    import("@/registry/blocks/ai/ai-016/ai-016").then((module) => module.Ai016),
  ),
  "ai-017": dynamic(() =>
    import("@/registry/blocks/ai/ai-017/ai-017").then((module) => module.Ai017),
  ),
  "ai-018": dynamic(() =>
    import("@/registry/blocks/ai/ai-018/ai-018").then((module) => module.Ai018),
  ),
  "ai-019": dynamic(() =>
    import("@/registry/blocks/ai/ai-019/ai-019").then((module) => module.Ai019),
  ),
} satisfies PreviewMap
