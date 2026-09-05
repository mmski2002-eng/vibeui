// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "api-001": () =>
    import("@/registry/animations/api/api-001/api-001").then((module) => module.Api001),
  "api-002": () =>
    import("@/registry/animations/api/api-002/api-002").then((module) => module.Api002),
  "api-003": () =>
    import("@/registry/animations/api/api-003/api-003").then((module) => module.Api003),
} satisfies PreviewLoaderMap
