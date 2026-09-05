// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "connections-001": () =>
    import("@/registry/animations/connections/connections-001/connections-001").then((module) => module.Connections001),
  "connections-002": () =>
    import("@/registry/animations/connections/connections-002/connections-002").then((module) => module.Connections002),
  "connections-003": () =>
    import("@/registry/animations/connections/connections-003/connections-003").then((module) => module.Connections003),
  "connections-004": () =>
    import("@/registry/animations/connections/connections-004/connections-004").then((module) => module.Connections004),
} satisfies PreviewLoaderMap
