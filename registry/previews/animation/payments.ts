// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "payments-001": () =>
    import("@/registry/animations/payments/payments-001/payments-001").then((module) => module.Payments001),
  "payments-002": () =>
    import("@/registry/animations/payments/payments-002/payments-002").then((module) => module.Payments002),
  "payments-003": () =>
    import("@/registry/animations/payments/payments-003/payments-003").then((module) => module.Payments003),
} satisfies PreviewLoaderMap
