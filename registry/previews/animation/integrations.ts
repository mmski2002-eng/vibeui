// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "integrations-001": () =>
    import("@/registry/animations/integrations/integrations-001/integrations-001").then((module) => module.Integrations001),
  "integrations-002": () =>
    import("@/registry/animations/integrations/integrations-002/integrations-002").then((module) => module.Integrations002),
} satisfies PreviewLoaderMap
