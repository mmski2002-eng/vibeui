// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "browser-001": () =>
    import("@/registry/animations/browser/browser-001/browser-001").then((module) => module.Browser001),
  "browser-002": () =>
    import("@/registry/animations/browser/browser-002/browser-002").then((module) => module.Browser002),
  "browser-003": () =>
    import("@/registry/animations/browser/browser-003/browser-003").then((module) => module.Browser003),
} satisfies PreviewLoaderMap
