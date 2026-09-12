// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "auth-001": () =>
    import("@/registry/blocks/auth/auth-001/auth-001").then((module) => module.Auth001),
  "auth-002": () =>
    import("@/registry/blocks/auth/auth-002/auth-002").then((module) => module.Auth002),
  "auth-003": () =>
    import("@/registry/blocks/auth/auth-003/auth-003").then((module) => module.Auth003),
  "auth-004": () =>
    import("@/registry/blocks/auth/auth-004/auth-004").then((module) => module.Auth004),
  "auth-005": () =>
    import("@/registry/blocks/auth/auth-005/auth-005").then((module) => module.Auth005),
  "auth-006": () =>
    import("@/registry/blocks/auth/auth-006/auth-006").then((module) => module.Auth006),
  "auth-007": () =>
    import("@/registry/blocks/auth/auth-007/auth-007").then((module) => module.Auth007),
  "auth-008": () =>
    import("@/registry/blocks/auth/auth-008/auth-008").then((module) => module.Auth008),
  "auth-009": () =>
    import("@/registry/blocks/auth/auth-009/auth-009").then((module) => module.Auth009),
  "auth-010": () =>
    import("@/registry/blocks/auth/auth-010/auth-010").then((module) => module.Auth010),
} satisfies PreviewLoaderMap
