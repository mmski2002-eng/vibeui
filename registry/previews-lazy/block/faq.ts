// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "faq-001": dynamic(() =>
    import("@/registry/blocks/faq/faq-001/faq-001").then(
      (module) => module.Faq001,
    ),
  ),
  "faq-002": dynamic(() =>
    import("@/registry/blocks/faq/faq-002/faq-002").then(
      (module) => module.Faq002,
    ),
  ),
  "faq-003": dynamic(() =>
    import("@/registry/blocks/faq/faq-003/faq-003").then(
      (module) => module.Faq003,
    ),
  ),
  "faq-004": dynamic(() =>
    import("@/registry/blocks/faq/faq-004/faq-004").then(
      (module) => module.Faq004,
    ),
  ),
  "faq-005": dynamic(() =>
    import("@/registry/blocks/faq/faq-005/faq-005").then(
      (module) => module.Faq005,
    ),
  ),
  "faq-006": dynamic(() =>
    import("@/registry/blocks/faq/faq-006/faq-006").then(
      (module) => module.Faq006,
    ),
  ),
} satisfies PreviewMap
