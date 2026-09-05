// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "security-001": () =>
    import("@/registry/animations/security/security-001/security-001").then((module) => module.Security001),
  "security-002": () =>
    import("@/registry/animations/security/security-002/security-002").then((module) => module.Security002),
  "security-003": () =>
    import("@/registry/animations/security/security-003/security-003").then((module) => module.Security003),
} satisfies PreviewLoaderMap
