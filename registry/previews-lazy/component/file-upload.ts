// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "file-001": dynamic(() =>
    import("@/registry/components/file-upload/file-001/file-001").then((module) => module.File001),
  ),
  "file-002": dynamic(() =>
    import("@/registry/components/file-upload/file-002/file-002").then((module) => module.File002),
  ),
  "file-003": dynamic(() =>
    import("@/registry/components/file-upload/file-003/file-003").then((module) => module.File003),
  ),
  "file-004": dynamic(() =>
    import("@/registry/components/file-upload/file-004/file-004").then((module) => module.File004),
  ),
  "file-005": dynamic(() =>
    import("@/registry/components/file-upload/file-005/file-005").then((module) => module.File005),
  ),
  "file-006": dynamic(() =>
    import("@/registry/components/file-upload/file-006/file-006").then((module) => module.File006),
  ),
  "file-007": dynamic(() =>
    import("@/registry/components/file-upload/file-007/file-007").then((module) => module.File007),
  ),
  "file-008": dynamic(() =>
    import("@/registry/components/file-upload/file-008/file-008").then((module) => module.File008),
  ),
  "file-009": dynamic(() =>
    import("@/registry/components/file-upload/file-009/file-009").then((module) => module.File009),
  ),
  "file-010": dynamic(() =>
    import("@/registry/components/file-upload/file-010/file-010").then((module) => module.File010),
  ),
} satisfies PreviewMap
