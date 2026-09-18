// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "bakery-001": () =>
    import("@/registry/blocks/bakery/bakery-001/bakery-001").then((module) => module.Bakery001),
  "bakery-002": () =>
    import("@/registry/blocks/bakery/bakery-002/bakery-002").then((module) => module.Bakery002),
  "bakery-003": () =>
    import("@/registry/blocks/bakery/bakery-003/bakery-003").then((module) => module.Bakery003),
  "bakery-004": () =>
    import("@/registry/blocks/bakery/bakery-004/bakery-004").then((module) => module.Bakery004),
  "bakery-005": () =>
    import("@/registry/blocks/bakery/bakery-005/bakery-005").then((module) => module.Bakery005),
} satisfies PreviewLoaderMap
