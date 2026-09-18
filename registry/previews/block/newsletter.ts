// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "subscribe-001": () =>
    import("@/registry/blocks/newsletter/subscribe-001/subscribe-001").then((module) => module.Subscribe001),
  "subscribe-002": () =>
    import("@/registry/blocks/newsletter/subscribe-002/subscribe-002").then((module) => module.Subscribe002),
  "subscribe-003": () =>
    import("@/registry/blocks/newsletter/subscribe-003/subscribe-003").then((module) => module.Subscribe003),
  "subscribe-004": () =>
    import("@/registry/blocks/newsletter/subscribe-004/subscribe-004").then((module) => module.Subscribe004),
  "subscribe-005": () =>
    import("@/registry/blocks/newsletter/subscribe-005/subscribe-005").then((module) => module.Subscribe005),
  "subscribe-006": () =>
    import("@/registry/blocks/newsletter/subscribe-006/subscribe-006").then((module) => module.Subscribe006),
  "subscribe-007": () =>
    import("@/registry/blocks/newsletter/subscribe-007/subscribe-007").then((module) => module.Subscribe007),
  "subscribe-008": () =>
    import("@/registry/blocks/newsletter/subscribe-008/subscribe-008").then((module) => module.Subscribe008),
} satisfies PreviewLoaderMap
