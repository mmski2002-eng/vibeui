// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "auth-anim-001": () =>
    import("@/registry/animations/auth/auth-anim-001/auth-anim-001").then((module) => module.AuthAnim001),
} satisfies PreviewLoaderMap
