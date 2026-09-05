// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "auth-anim-001": dynamic(() =>
    import("@/registry/animations/auth/auth-anim-001/auth-anim-001").then((module) => module.AuthAnim001),
  ),
} satisfies PreviewMap
