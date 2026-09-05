// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "aspect-001": () =>
    import("@/registry/components/aspect-ratio/aspect-001/aspect-001").then((module) => module.Aspect001),
  "aspect-002": () =>
    import("@/registry/components/aspect-ratio/aspect-002/aspect-002").then((module) => module.Aspect002),
  "aspect-003": () =>
    import("@/registry/components/aspect-ratio/aspect-003/aspect-003").then((module) => module.Aspect003),
  "aspect-004": () =>
    import("@/registry/components/aspect-ratio/aspect-004/aspect-004").then((module) => module.Aspect004),
  "aspect-005": () =>
    import("@/registry/components/aspect-ratio/aspect-005/aspect-005").then((module) => module.Aspect005),
  "aspect-006": () =>
    import("@/registry/components/aspect-ratio/aspect-006/aspect-006").then((module) => module.Aspect006),
  "aspect-007": () =>
    import("@/registry/components/aspect-ratio/aspect-007/aspect-007").then((module) => module.Aspect007),
  "aspect-008": () =>
    import("@/registry/components/aspect-ratio/aspect-008/aspect-008").then((module) => module.Aspect008),
} satisfies PreviewLoaderMap
