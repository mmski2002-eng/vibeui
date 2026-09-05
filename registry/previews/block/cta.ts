// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "cta-001": () =>
    import("@/registry/blocks/cta/cta-001/cta-001").then((module) => module.Cta001),
  "cta-002": () =>
    import("@/registry/blocks/cta/cta-002/cta-002").then((module) => module.Cta002),
  "cta-003": () =>
    import("@/registry/blocks/cta/cta-003/cta-003").then((module) => module.Cta003),
  "cta-004": () =>
    import("@/registry/blocks/cta/cta-004/cta-004").then((module) => module.Cta004),
  "cta-005": () =>
    import("@/registry/blocks/cta/cta-005/cta-005").then((module) => module.Cta005),
  "cta-006": () =>
    import("@/registry/blocks/cta/cta-006/cta-006").then((module) => module.Cta006),
} satisfies PreviewLoaderMap
