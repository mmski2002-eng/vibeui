// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "accordion-001": dynamic(() =>
    import("@/registry/components/accordion/accordion-001/accordion-001").then((module) => module.Accordion001),
  ),
  "accordion-002": dynamic(() =>
    import("@/registry/components/accordion/accordion-002/accordion-002").then((module) => module.Accordion002),
  ),
  "accordion-003": dynamic(() =>
    import("@/registry/components/accordion/accordion-003/accordion-003").then((module) => module.Accordion003),
  ),
  "accordion-004": dynamic(() =>
    import("@/registry/components/accordion/accordion-004/accordion-004").then((module) => module.Accordion004),
  ),
  "accordion-005": dynamic(() =>
    import("@/registry/components/accordion/accordion-005/accordion-005").then((module) => module.Accordion005),
  ),
  "accordion-006": dynamic(() =>
    import("@/registry/components/accordion/accordion-006/accordion-006").then((module) => module.Accordion006),
  ),
  "accordion-007": dynamic(() =>
    import("@/registry/components/accordion/accordion-007/accordion-007").then((module) => module.Accordion007),
  ),
  "accordion-008": dynamic(() =>
    import("@/registry/components/accordion/accordion-008/accordion-008").then((module) => module.Accordion008),
  ),
  "accordion-009": dynamic(() =>
    import("@/registry/components/accordion/accordion-009/accordion-009").then((module) => module.Accordion009),
  ),
  "accordion-010": dynamic(() =>
    import("@/registry/components/accordion/accordion-010/accordion-010").then((module) => module.Accordion010),
  ),
  "accordion-011": dynamic(() =>
    import("@/registry/components/accordion/accordion-011/accordion-011").then((module) => module.Accordion011),
  ),
  "accordion-012": dynamic(() =>
    import("@/registry/components/accordion/accordion-012/accordion-012").then((module) => module.Accordion012),
  ),
  "accordion-013": dynamic(() =>
    import("@/registry/components/accordion/accordion-013/accordion-013").then((module) => module.Accordion013),
  ),
  "accordion-014": dynamic(() =>
    import("@/registry/components/accordion/accordion-014/accordion-014").then((module) => module.Accordion014),
  ),
} satisfies PreviewMap
