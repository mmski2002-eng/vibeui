// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "textarea-001": dynamic(() =>
    import("@/registry/components/textarea/textarea-001/textarea-001").then((module) => module.Textarea001),
  ),
  "textarea-002": dynamic(() =>
    import("@/registry/components/textarea/textarea-002/textarea-002").then((module) => module.Textarea002),
  ),
  "textarea-004": dynamic(() =>
    import("@/registry/components/textarea/textarea-004/textarea-004").then((module) => module.Textarea004),
  ),
  "textarea-005": dynamic(() =>
    import("@/registry/components/textarea/textarea-005/textarea-005").then((module) => module.Textarea005),
  ),
  "textarea-006": dynamic(() =>
    import("@/registry/components/textarea/textarea-006/textarea-006").then((module) => module.Textarea006),
  ),
  "textarea-007": dynamic(() =>
    import("@/registry/components/textarea/textarea-007/textarea-007").then((module) => module.Textarea007),
  ),
  "textarea-008": dynamic(() =>
    import("@/registry/components/textarea/textarea-008/textarea-008").then((module) => module.Textarea008),
  ),
  "textarea-009": dynamic(() =>
    import("@/registry/components/textarea/textarea-009/textarea-009").then((module) => module.Textarea009),
  ),
  "textarea-010": dynamic(() =>
    import("@/registry/components/textarea/textarea-010/textarea-010").then((module) => module.Textarea010),
  ),
} satisfies PreviewMap
