// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "iconstack-001": () =>
    import("@/registry/components/icon-stack/iconstack-001/iconstack-001").then((module) => module.Iconstack001),
  "iconstack-002": () =>
    import("@/registry/components/icon-stack/iconstack-002/iconstack-002").then((module) => module.Iconstack002),
  "iconstack-003": () =>
    import("@/registry/components/icon-stack/iconstack-003/iconstack-003").then((module) => module.Iconstack003),
  "iconstack-004": () =>
    import("@/registry/components/icon-stack/iconstack-004/iconstack-004").then((module) => module.Iconstack004),
  "iconstack-005": () =>
    import("@/registry/components/icon-stack/iconstack-005/iconstack-005").then((module) => module.Iconstack005),
  "iconstack-006": () =>
    import("@/registry/components/icon-stack/iconstack-006/iconstack-006").then((module) => module.Iconstack006),
} satisfies PreviewLoaderMap
