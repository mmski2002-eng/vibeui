// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "avatar-anim-001": () =>
    import("@/registry/animations/avatar/avatar-anim-001/avatar-anim-001").then((module) => module.AvatarAnim001),
  "avatar-anim-002": () =>
    import("@/registry/animations/avatar/avatar-anim-002/avatar-anim-002").then((module) => module.AvatarAnim002),
  "avatar-anim-003": () =>
    import("@/registry/animations/avatar/avatar-anim-003/avatar-anim-003").then((module) => module.AvatarAnim003),
} satisfies PreviewLoaderMap
