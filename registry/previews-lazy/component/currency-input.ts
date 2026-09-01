// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "currency-001": dynamic(() =>
    import("@/registry/components/currency-input/currency-001/currency-001").then(
      (module) => module.Currency001,
    ),
  ),
  "currency-002": dynamic(() =>
    import("@/registry/components/currency-input/currency-002/currency-002").then(
      (module) => module.Currency002,
    ),
  ),
  "currency-003": dynamic(() =>
    import("@/registry/components/currency-input/currency-003/currency-003").then(
      (module) => module.Currency003,
    ),
  ),
  "currency-004": dynamic(() =>
    import("@/registry/components/currency-input/currency-004/currency-004").then(
      (module) => module.Currency004,
    ),
  ),
  "currency-005": dynamic(() =>
    import("@/registry/components/currency-input/currency-005/currency-005").then(
      (module) => module.Currency005,
    ),
  ),
  "currency-006": dynamic(() =>
    import("@/registry/components/currency-input/currency-006/currency-006").then(
      (module) => module.Currency006,
    ),
  ),
  "currency-007": dynamic(() =>
    import("@/registry/components/currency-input/currency-007/currency-007").then(
      (module) => module.Currency007,
    ),
  ),
} satisfies PreviewMap
