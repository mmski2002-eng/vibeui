// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "scrollspy-001": () =>
    import("@/registry/components/scrollspy/scrollspy-001/scrollspy-001").then((module) => module.Scrollspy001),
  "scrollspy-002": () =>
    import("@/registry/components/scrollspy/scrollspy-002/scrollspy-002").then((module) => module.Scrollspy002),
  "scrollspy-003": () =>
    import("@/registry/components/scrollspy/scrollspy-003/scrollspy-003").then((module) => module.Scrollspy003),
  "scrollspy-004": () =>
    import("@/registry/components/scrollspy/scrollspy-004/scrollspy-004").then((module) => module.Scrollspy004),
  "scrollspy-005": () =>
    import("@/registry/components/scrollspy/scrollspy-005/scrollspy-005").then((module) => module.Scrollspy005),
  "scrollspy-006": () =>
    import("@/registry/components/scrollspy/scrollspy-006/scrollspy-006").then((module) => module.Scrollspy006),
  "scrollspy-007": () =>
    import("@/registry/components/scrollspy/scrollspy-007/scrollspy-007").then((module) => module.Scrollspy007),
} satisfies PreviewLoaderMap
