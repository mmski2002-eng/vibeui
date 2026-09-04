// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "otp-001": dynamic(() =>
    import("@/registry/components/input-otp/otp-001/otp-001").then(
      (module) => module.Otp001,
    ),
  ),
  "otp-002": dynamic(() =>
    import("@/registry/components/input-otp/otp-002/otp-002").then(
      (module) => module.Otp002,
    ),
  ),
  "otp-003": dynamic(() =>
    import("@/registry/components/input-otp/otp-003/otp-003").then(
      (module) => module.Otp003,
    ),
  ),
  "otp-004": dynamic(() =>
    import("@/registry/components/input-otp/otp-004/otp-004").then(
      (module) => module.Otp004,
    ),
  ),
  "otp-005": dynamic(() =>
    import("@/registry/components/input-otp/otp-005/otp-005").then(
      (module) => module.Otp005,
    ),
  ),
  "otp-006": dynamic(() =>
    import("@/registry/components/input-otp/otp-006/otp-006").then(
      (module) => module.Otp006,
    ),
  ),
  "otp-007": dynamic(() =>
    import("@/registry/components/input-otp/otp-007/otp-007").then(
      (module) => module.Otp007,
    ),
  ),
  "otp-008": dynamic(() =>
    import("@/registry/components/input-otp/otp-008/otp-008").then(
      (module) => module.Otp008,
    ),
  ),
  "otp-009": dynamic(() =>
    import("@/registry/components/input-otp/otp-009/otp-009").then(
      (module) => module.Otp009,
    ),
  ),
  "otp-010": dynamic(() =>
    import("@/registry/components/input-otp/otp-010/otp-010").then(
      (module) => module.Otp010,
    ),
  ),
  "otp-011": dynamic(() =>
    import("@/registry/components/input-otp/otp-011/otp-011").then(
      (module) => module.Otp011,
    ),
  ),
} satisfies PreviewMap
