// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "separator-001": () =>
    import("@/registry/components/separator/separator-001/separator-001").then((module) => module.Separator001),
  "separator-002": () =>
    import("@/registry/components/separator/separator-002/separator-002").then((module) => module.Separator002),
  "separator-003": () =>
    import("@/registry/components/separator/separator-003/separator-003").then((module) => module.Separator003),
  "separator-004": () =>
    import("@/registry/components/separator/separator-004/separator-004").then((module) => module.Separator004),
  "separator-005": () =>
    import("@/registry/components/separator/separator-005/separator-005").then((module) => module.Separator005),
  "separator-006": () =>
    import("@/registry/components/separator/separator-006/separator-006").then((module) => module.Separator006),
} satisfies PreviewLoaderMap
