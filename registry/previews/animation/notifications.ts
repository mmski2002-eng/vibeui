// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "notifications-001": () =>
    import("@/registry/animations/notifications/notifications-001/notifications-001").then((module) => module.Notifications001),
  "notifications-002": () =>
    import("@/registry/animations/notifications/notifications-002/notifications-002").then((module) => module.Notifications002),
} satisfies PreviewLoaderMap
