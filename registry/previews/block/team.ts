// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "people-001": () =>
    import("@/registry/blocks/team/people-001/people-001").then((module) => module.People001),
  "people-002": () =>
    import("@/registry/blocks/team/people-002/people-002").then((module) => module.People002),
  "people-003": () =>
    import("@/registry/blocks/team/people-003/people-003").then((module) => module.People003),
  "people-004": () =>
    import("@/registry/blocks/team/people-004/people-004").then((module) => module.People004),
  "people-005": () =>
    import("@/registry/blocks/team/people-005/people-005").then((module) => module.People005),
  "people-006": () =>
    import("@/registry/blocks/team/people-006/people-006").then((module) => module.People006),
  "people-007": () =>
    import("@/registry/blocks/team/people-007/people-007").then((module) => module.People007),
  "people-008": () =>
    import("@/registry/blocks/team/people-008/people-008").then((module) => module.People008),
  "people-009": () =>
    import("@/registry/blocks/team/people-009/people-009").then((module) => module.People009),
  "people-010": () =>
    import("@/registry/blocks/team/people-010/people-010").then((module) => module.People010),
  "people-011": () =>
    import("@/registry/blocks/team/people-011/people-011").then((module) => module.People011),
} satisfies PreviewLoaderMap
