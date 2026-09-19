// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "vet-001": dynamic(() =>
    import("@/registry/blocks/vet/vet-001/vet-001").then((module) => module.Vet001),
  ),
  "vet-002": dynamic(() =>
    import("@/registry/blocks/vet/vet-002/vet-002").then((module) => module.Vet002),
  ),
  "vet-003": dynamic(() =>
    import("@/registry/blocks/vet/vet-003/vet-003").then((module) => module.Vet003),
  ),
  "vet-004": dynamic(() =>
    import("@/registry/blocks/vet/vet-004/vet-004").then((module) => module.Vet004),
  ),
} satisfies PreviewMap
