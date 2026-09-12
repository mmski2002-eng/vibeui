// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "mockup-001": () =>
    import("@/registry/components/mockup/mockup-001/mockup-001").then((module) => module.Mockup001),
  "mockup-002": () =>
    import("@/registry/components/mockup/mockup-002/mockup-002").then((module) => module.Mockup002),
  "mockup-003": () =>
    import("@/registry/components/mockup/mockup-003/mockup-003").then((module) => module.Mockup003),
  "mockup-004": () =>
    import("@/registry/components/mockup/mockup-004/mockup-004").then((module) => module.Mockup004),
  "mockup-005": () =>
    import("@/registry/components/mockup/mockup-005/mockup-005").then((module) => module.Mockup005),
  "mockup-006": () =>
    import("@/registry/components/mockup/mockup-006/mockup-006").then((module) => module.Mockup006),
  "mockup-007": () =>
    import("@/registry/components/mockup/mockup-007/mockup-007").then((module) => module.Mockup007),
  "mockup-008": () =>
    import("@/registry/components/mockup/mockup-008/mockup-008").then((module) => module.Mockup008),
  "mockup-009": () =>
    import("@/registry/components/mockup/mockup-009/mockup-009").then((module) => module.Mockup009),
} satisfies PreviewLoaderMap
