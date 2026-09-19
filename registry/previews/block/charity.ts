// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "charity-001": () =>
    import("@/registry/blocks/charity/charity-001/charity-001").then((module) => module.Charity001),
  "charity-002": () =>
    import("@/registry/blocks/charity/charity-002/charity-002").then((module) => module.Charity002),
  "charity-003": () =>
    import("@/registry/blocks/charity/charity-003/charity-003").then((module) => module.Charity003),
  "charity-004": () =>
    import("@/registry/blocks/charity/charity-004/charity-004").then((module) => module.Charity004),
  "charity-005": () =>
    import("@/registry/blocks/charity/charity-005/charity-005").then((module) => module.Charity005),
} satisfies PreviewLoaderMap
