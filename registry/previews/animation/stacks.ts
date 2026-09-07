// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "stack-001": () =>
    import("@/registry/animations/stacks/stack-001/stack-001").then((module) => module.Stack001),
  "stack-002": () =>
    import("@/registry/animations/stacks/stack-002/stack-002").then((module) => module.Stack002),
  "stack-003": () =>
    import("@/registry/animations/stacks/stack-003/stack-003").then((module) => module.Stack003),
  "stack-004": () =>
    import("@/registry/animations/stacks/stack-004/stack-004").then((module) => module.Stack004),
  "stack-005": () =>
    import("@/registry/animations/stacks/stack-005/stack-005").then((module) => module.Stack005),
  "stack-006": () =>
    import("@/registry/animations/stacks/stack-006/stack-006").then((module) => module.Stack006),
  "stack-007": () =>
    import("@/registry/animations/stacks/stack-007/stack-007").then((module) => module.Stack007),
  "stack-008": () =>
    import("@/registry/animations/stacks/stack-008/stack-008").then((module) => module.Stack008),
  "stack-009": () =>
    import("@/registry/animations/stacks/stack-009/stack-009").then((module) => module.Stack009),
  "stack-010": () =>
    import("@/registry/animations/stacks/stack-010/stack-010").then((module) => module.Stack010),
  "stack-011": () =>
    import("@/registry/animations/stacks/stack-011/stack-011").then((module) => module.Stack011),
  "stack-012": () =>
    import("@/registry/animations/stacks/stack-012/stack-012").then((module) => module.Stack012),
} satisfies PreviewLoaderMap
