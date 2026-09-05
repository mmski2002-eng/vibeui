// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "navbar-anim-001": dynamic(() =>
    import("@/registry/animations/navbar/navbar-anim-001/navbar-anim-001").then((module) => module.NavbarAnim001),
  ),
} satisfies PreviewMap
