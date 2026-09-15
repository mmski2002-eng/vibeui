// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "realty-003": () =>
    import("@/registry/blocks/realty/realty-003/realty-003").then((module) => module.Realty003),
  "realty-004": () =>
    import("@/registry/blocks/realty/realty-004/realty-004").then((module) => module.Realty004),
  "realty-005": () =>
    import("@/registry/blocks/realty/realty-005/realty-005").then((module) => module.Realty005),
  "realty-006": () =>
    import("@/registry/blocks/realty/realty-006/realty-006").then((module) => module.Realty006),
} satisfies PreviewLoaderMap
