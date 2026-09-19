// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "api-001": () =>
    import("@/registry/blocks/api/api-001/api-001").then((module) => module.Api001),
  "api-002": () =>
    import("@/registry/blocks/api/api-002/api-002").then((module) => module.Api002),
} satisfies PreviewLoaderMap
