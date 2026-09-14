// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "avatar-anim-002": dynamic(() =>
    import("@/registry/animations/avatar/avatar-anim-002/avatar-anim-002").then((module) => module.AvatarAnim002),
  ),
  "avatar-anim-003": dynamic(() =>
    import("@/registry/animations/avatar/avatar-anim-003/avatar-anim-003").then((module) => module.AvatarAnim003),
  ),
  "avatar-anim-004": dynamic(() =>
    import("@/registry/animations/avatar/avatar-anim-004/avatar-anim-004").then((module) => module.AvatarAnim004),
  ),
} satisfies PreviewMap
