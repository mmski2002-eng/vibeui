// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "ai-anim-001": () =>
    import("@/registry/animations/ai/ai-anim-001/ai-anim-001").then((module) => module.AiAnim001),
  "ai-anim-002": () =>
    import("@/registry/animations/ai/ai-anim-002/ai-anim-002").then((module) => module.AiAnim002),
  "ai-anim-003": () =>
    import("@/registry/animations/ai/ai-anim-003/ai-anim-003").then((module) => module.AiAnim003),
  "ai-anim-004": () =>
    import("@/registry/animations/ai/ai-anim-004/ai-anim-004").then((module) => module.AiAnim004),
  "ai-anim-005": () =>
    import("@/registry/animations/ai/ai-anim-005/ai-anim-005").then((module) => module.AiAnim005),
  "ai-anim-006": () =>
    import("@/registry/animations/ai/ai-anim-006/ai-anim-006").then((module) => module.AiAnim006),
} satisfies PreviewLoaderMap
