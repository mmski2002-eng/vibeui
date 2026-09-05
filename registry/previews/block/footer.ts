// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "footer-001": () =>
    import("@/registry/blocks/footer/footer-001/footer-001").then((module) => module.Footer001),
  "footer-002": () =>
    import("@/registry/blocks/footer/footer-002/footer-002").then((module) => module.Footer002),
  "footer-003": () =>
    import("@/registry/blocks/footer/footer-003/footer-003").then((module) => module.Footer003),
  "footer-004": () =>
    import("@/registry/blocks/footer/footer-004/footer-004").then((module) => module.Footer004),
  "footer-005": () =>
    import("@/registry/blocks/footer/footer-005/footer-005").then((module) => module.Footer005),
  "footer-006": () =>
    import("@/registry/blocks/footer/footer-006/footer-006").then((module) => module.Footer006),
  "footer-007": () =>
    import("@/registry/blocks/footer/footer-007/footer-007").then((module) => module.Footer007),
  "footer-008": () =>
    import("@/registry/blocks/footer/footer-008/footer-008").then((module) => module.Footer008),
} satisfies PreviewLoaderMap
