// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "hovercard-001": () =>
    import("@/registry/components/hover-card/hovercard-001/hovercard-001").then((module) => module.Hovercard001),
  "hovercard-002": () =>
    import("@/registry/components/hover-card/hovercard-002/hovercard-002").then((module) => module.Hovercard002),
  "hovercard-003": () =>
    import("@/registry/components/hover-card/hovercard-003/hovercard-003").then((module) => module.Hovercard003),
  "hovercard-004": () =>
    import("@/registry/components/hover-card/hovercard-004/hovercard-004").then((module) => module.Hovercard004),
  "hovercard-005": () =>
    import("@/registry/components/hover-card/hovercard-005/hovercard-005").then((module) => module.Hovercard005),
  "hovercard-006": () =>
    import("@/registry/components/hover-card/hovercard-006/hovercard-006").then((module) => module.Hovercard006),
  "hovercard-007": () =>
    import("@/registry/components/hover-card/hovercard-007/hovercard-007").then((module) => module.Hovercard007),
  "hovercard-008": () =>
    import("@/registry/components/hover-card/hovercard-008/hovercard-008").then((module) => module.Hovercard008),
} satisfies PreviewLoaderMap
