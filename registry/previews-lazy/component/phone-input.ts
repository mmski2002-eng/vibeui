// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "phoneinput-001": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-001/phoneinput-001").then(
      (module) => module.Phoneinput001,
    ),
  ),
  "phoneinput-002": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-002/phoneinput-002").then(
      (module) => module.Phoneinput002,
    ),
  ),
  "phoneinput-003": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-003/phoneinput-003").then(
      (module) => module.Phoneinput003,
    ),
  ),
  "phoneinput-004": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-004/phoneinput-004").then(
      (module) => module.Phoneinput004,
    ),
  ),
  "phoneinput-005": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-005/phoneinput-005").then(
      (module) => module.Phoneinput005,
    ),
  ),
  "phoneinput-006": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-006/phoneinput-006").then(
      (module) => module.Phoneinput006,
    ),
  ),
  "phoneinput-007": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-007/phoneinput-007").then(
      (module) => module.Phoneinput007,
    ),
  ),
  "phoneinput-008": dynamic(() =>
    import("@/registry/components/phone-input/phoneinput-008/phoneinput-008").then(
      (module) => module.Phoneinput008,
    ),
  ),
} satisfies PreviewMap
