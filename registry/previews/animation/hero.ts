// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "hero-anim-001": () =>
    import("@/registry/animations/hero/hero-anim-001/hero-anim-001").then((module) => module.HeroAnim001),
} satisfies PreviewLoaderMap
