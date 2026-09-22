// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "heading-001": dynamic(() =>
    import("@/registry/components/typography/heading-001/heading-001").then((module) => module.Heading001),
  ),
  "word-001": dynamic(() =>
    import("@/registry/components/typography/word-001/word-001").then((module) => module.Word001),
  ),
  "counter-001": dynamic(() =>
    import("@/registry/components/typography/counter-001/counter-001").then((module) => module.Counter001),
  ),
  "mark-001": dynamic(() =>
    import("@/registry/components/typography/mark-001/mark-001").then((module) => module.Mark001),
  ),
  "contact-001": dynamic(() =>
    import("@/registry/components/typography/contact-001/contact-001").then((module) => module.Contact001),
  ),
  "cell-001": dynamic(() =>
    import("@/registry/components/typography/cell-001/cell-001").then((module) => module.Cell001),
  ),
  "caption-001": dynamic(() =>
    import("@/registry/components/typography/caption-001/caption-001").then((module) => module.Caption001),
  ),
} satisfies PreviewMap
