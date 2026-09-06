// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "consent-001": () =>
    import("@/registry/blocks/consent/consent-001/consent-001").then((module) => module.Consent001),
  "consent-002": () =>
    import("@/registry/blocks/consent/consent-002/consent-002").then((module) => module.Consent002),
  "consent-003": () =>
    import("@/registry/blocks/consent/consent-003/consent-003").then((module) => module.Consent003),
} satisfies PreviewLoaderMap
