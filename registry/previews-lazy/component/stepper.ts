// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "stepper-001": dynamic(() =>
    import("@/registry/components/stepper/stepper-001/stepper-001").then((module) => module.Stepper001),
  ),
  "stepper-002": dynamic(() =>
    import("@/registry/components/stepper/stepper-002/stepper-002").then((module) => module.Stepper002),
  ),
  "stepper-003": dynamic(() =>
    import("@/registry/components/stepper/stepper-003/stepper-003").then((module) => module.Stepper003),
  ),
  "stepper-004": dynamic(() =>
    import("@/registry/components/stepper/stepper-004/stepper-004").then((module) => module.Stepper004),
  ),
  "stepper-005": dynamic(() =>
    import("@/registry/components/stepper/stepper-005/stepper-005").then((module) => module.Stepper005),
  ),
  "stepper-006": dynamic(() =>
    import("@/registry/components/stepper/stepper-006/stepper-006").then((module) => module.Stepper006),
  ),
  "stepper-007": dynamic(() =>
    import("@/registry/components/stepper/stepper-007/stepper-007").then((module) => module.Stepper007),
  ),
  "stepper-008": dynamic(() =>
    import("@/registry/components/stepper/stepper-008/stepper-008").then((module) => module.Stepper008),
  ),
  "stepper-009": dynamic(() =>
    import("@/registry/components/stepper/stepper-009/stepper-009").then((module) => module.Stepper009),
  ),
  "stepper-010": dynamic(() =>
    import("@/registry/components/stepper/stepper-010/stepper-010").then((module) => module.Stepper010),
  ),
  "stepper-011": dynamic(() =>
    import("@/registry/components/stepper/stepper-011/stepper-011").then((module) => module.Stepper011),
  ),
  "stepper-012": dynamic(() =>
    import("@/registry/components/stepper/stepper-012/stepper-012").then((module) => module.Stepper012),
  ),
  "stepper-013": dynamic(() =>
    import("@/registry/components/stepper/stepper-013/stepper-013").then((module) => module.Stepper013),
  ),
  "stepper-014": dynamic(() =>
    import("@/registry/components/stepper/stepper-014/stepper-014").then((module) => module.Stepper014),
  ),
  "stepper-015": dynamic(() =>
    import("@/registry/components/stepper/stepper-015/stepper-015").then((module) => module.Stepper015),
  ),
} satisfies PreviewMap
