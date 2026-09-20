// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "errorpage-001": dynamic(() =>
    import("@/registry/blocks/errors/errorpage-001/errorpage-001").then((module) => module.Errorpage001),
  ),
  "errorpage-002": dynamic(() =>
    import("@/registry/blocks/errors/errorpage-002/errorpage-002").then((module) => module.Errorpage002),
  ),
  "errorpage-003": dynamic(() =>
    import("@/registry/blocks/errors/errorpage-003/errorpage-003").then((module) => module.Errorpage003),
  ),
  "errorpage-004": dynamic(() =>
    import("@/registry/blocks/errors/errorpage-004/errorpage-004").then((module) => module.Errorpage004),
  ),
  "errorpage-005": dynamic(() =>
    import("@/registry/blocks/errors/errorpage-005/errorpage-005").then((module) => module.Errorpage005),
  ),
  "errorpage-006": dynamic(() =>
    import("@/registry/blocks/errors/errorpage-006/errorpage-006").then((module) => module.Errorpage006),
  ),
  "consent-001": dynamic(() =>
    import("@/registry/blocks/errors/consent-001/consent-001").then((module) => module.Consent001),
  ),
  "consent-002": dynamic(() =>
    import("@/registry/blocks/errors/consent-002/consent-002").then((module) => module.Consent002),
  ),
  "consent-003": dynamic(() =>
    import("@/registry/blocks/errors/consent-003/consent-003").then((module) => module.Consent003),
  ),
} satisfies PreviewMap
