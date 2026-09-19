// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "fintech-001": () =>
    import("@/registry/blocks/fintech/fintech-001/fintech-001").then((module) => module.Fintech001),
  "fintech-002": () =>
    import("@/registry/blocks/fintech/fintech-002/fintech-002").then((module) => module.Fintech002),
  "fintech-003": () =>
    import("@/registry/blocks/fintech/fintech-003/fintech-003").then((module) => module.Fintech003),
} satisfies PreviewLoaderMap
