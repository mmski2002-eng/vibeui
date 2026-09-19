// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "renovation-001": dynamic(() =>
    import("@/registry/blocks/renovation/renovation-001/renovation-001").then((module) => module.Renovation001),
  ),
  "renovation-002": dynamic(() =>
    import("@/registry/blocks/renovation/renovation-002/renovation-002").then((module) => module.Renovation002),
  ),
  "renovation-003": dynamic(() =>
    import("@/registry/blocks/renovation/renovation-003/renovation-003").then((module) => module.Renovation003),
  ),
  "renovation-004": dynamic(() =>
    import("@/registry/blocks/renovation/renovation-004/renovation-004").then((module) => module.Renovation004),
  ),
} satisfies PreviewMap
