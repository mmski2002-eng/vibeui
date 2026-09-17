// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "background-001": dynamic(() =>
    import("@/registry/animations/background/background-001/background-001").then((module) => module.Background001),
  ),
  "background-002": dynamic(() =>
    import("@/registry/animations/background/background-002/background-002").then((module) => module.Background002),
  ),
  "background-003": dynamic(() =>
    import("@/registry/animations/background/background-003/background-003").then((module) => module.Background003),
  ),
  "background-004": dynamic(() =>
    import("@/registry/animations/background/background-004/background-004").then((module) => module.Background004),
  ),
  "background-005": dynamic(() =>
    import("@/registry/animations/background/background-005/background-005").then((module) => module.Background005),
  ),
  "background-006": dynamic(() =>
    import("@/registry/animations/background/background-006/background-006").then((module) => module.Background006),
  ),
} satisfies PreviewMap
