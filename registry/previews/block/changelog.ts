// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "changelog-001": () =>
    import("@/registry/blocks/changelog/changelog-001/changelog-001").then((module) => module.Changelog001),
  "changelog-002": () =>
    import("@/registry/blocks/changelog/changelog-002/changelog-002").then((module) => module.Changelog002),
  "changelog-003": () =>
    import("@/registry/blocks/changelog/changelog-003/changelog-003").then((module) => module.Changelog003),
  "changelog-004": () =>
    import("@/registry/blocks/changelog/changelog-004/changelog-004").then((module) => module.Changelog004),
} satisfies PreviewLoaderMap
