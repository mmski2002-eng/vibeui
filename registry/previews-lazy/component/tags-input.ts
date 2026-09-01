// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "tags-001": dynamic(() =>
    import("@/registry/components/tags-input/tags-001/tags-001").then(
      (module) => module.Tags001,
    ),
  ),
  "tags-002": dynamic(() =>
    import("@/registry/components/tags-input/tags-002/tags-002").then(
      (module) => module.Tags002,
    ),
  ),
  "tags-003": dynamic(() =>
    import("@/registry/components/tags-input/tags-003/tags-003").then(
      (module) => module.Tags003,
    ),
  ),
  "tags-004": dynamic(() =>
    import("@/registry/components/tags-input/tags-004/tags-004").then(
      (module) => module.Tags004,
    ),
  ),
  "tags-005": dynamic(() =>
    import("@/registry/components/tags-input/tags-005/tags-005").then(
      (module) => module.Tags005,
    ),
  ),
  "tags-006": dynamic(() =>
    import("@/registry/components/tags-input/tags-006/tags-006").then(
      (module) => module.Tags006,
    ),
  ),
  "tags-007": dynamic(() =>
    import("@/registry/components/tags-input/tags-007/tags-007").then(
      (module) => module.Tags007,
    ),
  ),
} satisfies PreviewMap
