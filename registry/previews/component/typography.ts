// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "heading-001": () =>
    import("@/registry/components/typography/heading-001/heading-001").then((module) => module.Heading001),
  "counter-001": () =>
    import("@/registry/components/typography/counter-001/counter-001").then((module) => module.Counter001),
  "cell-001": () =>
    import("@/registry/components/typography/cell-001/cell-001").then((module) => module.Cell001),
  "caption-001": () =>
    import("@/registry/components/typography/caption-001/caption-001").then((module) => module.Caption001),
} satisfies PreviewLoaderMap
