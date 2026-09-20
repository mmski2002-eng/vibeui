// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "portfolio-001": () =>
    import("@/registry/blocks/portfolio/portfolio-001/portfolio-001").then((module) => module.Portfolio001),
  "portfolio-002": () =>
    import("@/registry/blocks/portfolio/portfolio-002/portfolio-002").then((module) => module.Portfolio002),
  "portfolio-003": () =>
    import("@/registry/blocks/portfolio/portfolio-003/portfolio-003").then((module) => module.Portfolio003),
  "portfolio-004": () =>
    import("@/registry/blocks/portfolio/portfolio-004/portfolio-004").then((module) => module.Portfolio004),
  "portfolio-005": () =>
    import("@/registry/blocks/portfolio/portfolio-005/portfolio-005").then((module) => module.Portfolio005),
  "portfolio-006": () =>
    import("@/registry/blocks/portfolio/portfolio-006/portfolio-006").then((module) => module.Portfolio006),
  "portfolio-007": () =>
    import("@/registry/blocks/portfolio/portfolio-007/portfolio-007").then((module) => module.Portfolio007),
  "portfolio-008": () =>
    import("@/registry/blocks/portfolio/portfolio-008/portfolio-008").then((module) => module.Portfolio008),
  "portfolio-009": () =>
    import("@/registry/blocks/portfolio/portfolio-009/portfolio-009").then((module) => module.Portfolio009),
  "portfolio-010": () =>
    import("@/registry/blocks/portfolio/portfolio-010/portfolio-010").then((module) => module.Portfolio010),
  "portfolio-011": () =>
    import("@/registry/blocks/portfolio/portfolio-011/portfolio-011").then((module) => module.Portfolio011),
  "portfolio-012": () =>
    import("@/registry/blocks/portfolio/portfolio-012/portfolio-012").then((module) => module.Portfolio012),
  "case-001": () =>
    import("@/registry/blocks/portfolio/case-001/case-001").then((module) => module.Case001),
  "case-002": () =>
    import("@/registry/blocks/portfolio/case-002/case-002").then((module) => module.Case002),
  "case-003": () =>
    import("@/registry/blocks/portfolio/case-003/case-003").then((module) => module.Case003),
  "case-004": () =>
    import("@/registry/blocks/portfolio/case-004/case-004").then((module) => module.Case004),
  "case-005": () =>
    import("@/registry/blocks/portfolio/case-005/case-005").then((module) => module.Case005),
  "case-006": () =>
    import("@/registry/blocks/portfolio/case-006/case-006").then((module) => module.Case006),
} satisfies PreviewLoaderMap
