// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "team-001": () =>
    import("@/registry/animations/team/team-001/team-001").then((module) => module.Team001),
} satisfies PreviewLoaderMap
