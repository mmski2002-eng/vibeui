// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "code-block-anim-001": () =>
    import("@/registry/animations/code-block/code-block-anim-001/code-block-anim-001").then((module) => module.CodeBlockAnim001),
  "code-block-anim-002": () =>
    import("@/registry/animations/code-block/code-block-anim-002/code-block-anim-002").then((module) => module.CodeBlockAnim002),
  "code-block-anim-003": () =>
    import("@/registry/animations/code-block/code-block-anim-003/code-block-anim-003").then((module) => module.CodeBlockAnim003),
} satisfies PreviewLoaderMap
