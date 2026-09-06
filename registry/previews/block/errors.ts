// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "errorpage-001": () =>
    import("@/registry/blocks/errors/errorpage-001/errorpage-001").then((module) => module.Errorpage001),
  "errorpage-002": () =>
    import("@/registry/blocks/errors/errorpage-002/errorpage-002").then((module) => module.Errorpage002),
  "errorpage-003": () =>
    import("@/registry/blocks/errors/errorpage-003/errorpage-003").then((module) => module.Errorpage003),
  "errorpage-004": () =>
    import("@/registry/blocks/errors/errorpage-004/errorpage-004").then((module) => module.Errorpage004),
  "errorpage-005": () =>
    import("@/registry/blocks/errors/errorpage-005/errorpage-005").then((module) => module.Errorpage005),
  "errorpage-006": () =>
    import("@/registry/blocks/errors/errorpage-006/errorpage-006").then((module) => module.Errorpage006),
} satisfies PreviewLoaderMap
