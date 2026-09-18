// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "people-001": dynamic(() =>
    import("@/registry/blocks/team/people-001/people-001").then((module) => module.People001),
  ),
  "people-002": dynamic(() =>
    import("@/registry/blocks/team/people-002/people-002").then((module) => module.People002),
  ),
  "people-003": dynamic(() =>
    import("@/registry/blocks/team/people-003/people-003").then((module) => module.People003),
  ),
  "people-004": dynamic(() =>
    import("@/registry/blocks/team/people-004/people-004").then((module) => module.People004),
  ),
  "people-005": dynamic(() =>
    import("@/registry/blocks/team/people-005/people-005").then((module) => module.People005),
  ),
  "people-006": dynamic(() =>
    import("@/registry/blocks/team/people-006/people-006").then((module) => module.People006),
  ),
  "people-007": dynamic(() =>
    import("@/registry/blocks/team/people-007/people-007").then((module) => module.People007),
  ),
  "people-008": dynamic(() =>
    import("@/registry/blocks/team/people-008/people-008").then((module) => module.People008),
  ),
  "people-009": dynamic(() =>
    import("@/registry/blocks/team/people-009/people-009").then((module) => module.People009),
  ),
  "people-010": dynamic(() =>
    import("@/registry/blocks/team/people-010/people-010").then((module) => module.People010),
  ),
  "people-011": dynamic(() =>
    import("@/registry/blocks/team/people-011/people-011").then((module) => module.People011),
  ),
  "people-012": dynamic(() =>
    import("@/registry/blocks/team/people-012/people-012").then((module) => module.People012),
  ),
} satisfies PreviewMap
