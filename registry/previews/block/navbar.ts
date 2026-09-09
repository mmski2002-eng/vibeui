// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "navbar-002": () =>
    import("@/registry/blocks/navbar/navbar-002/navbar-002").then((module) => module.Navbar002),
} satisfies PreviewLoaderMap
