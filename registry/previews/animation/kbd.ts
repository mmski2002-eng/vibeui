// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "kbd-anim-001": () =>
    import("@/registry/animations/kbd/kbd-anim-001/kbd-anim-001").then((module) => module.KbdAnim001),
  "kbd-anim-002": () =>
    import("@/registry/animations/kbd/kbd-anim-002/kbd-anim-002").then((module) => module.KbdAnim002),
} satisfies PreviewLoaderMap
