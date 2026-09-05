// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "scrollarea-001": () =>
    import("@/registry/components/scroll-area/scrollarea-001/scrollarea-001").then((module) => module.Scrollarea001),
  "scrollarea-002": () =>
    import("@/registry/components/scroll-area/scrollarea-002/scrollarea-002").then((module) => module.Scrollarea002),
  "scrollarea-003": () =>
    import("@/registry/components/scroll-area/scrollarea-003/scrollarea-003").then((module) => module.Scrollarea003),
  "scrollarea-004": () =>
    import("@/registry/components/scroll-area/scrollarea-004/scrollarea-004").then((module) => module.Scrollarea004),
  "scrollarea-005": () =>
    import("@/registry/components/scroll-area/scrollarea-005/scrollarea-005").then((module) => module.Scrollarea005),
  "scrollarea-006": () =>
    import("@/registry/components/scroll-area/scrollarea-006/scrollarea-006").then((module) => module.Scrollarea006),
  "scrollarea-007": () =>
    import("@/registry/components/scroll-area/scrollarea-007/scrollarea-007").then((module) => module.Scrollarea007),
} satisfies PreviewLoaderMap
