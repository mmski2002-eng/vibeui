// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "tabs-001": dynamic(() =>
    import("@/registry/components/tabs/tabs-001/tabs-001").then((module) => module.Tabs001),
  ),
  "tabs-014": dynamic(() =>
    import("@/registry/components/tabs/tabs-014/tabs-014").then((module) => module.Tabs014),
  ),
  "tabs-002": dynamic(() =>
    import("@/registry/components/tabs/tabs-002/tabs-002").then((module) => module.Tabs002),
  ),
  "tabs-003": dynamic(() =>
    import("@/registry/components/tabs/tabs-003/tabs-003").then((module) => module.Tabs003),
  ),
  "tabs-004": dynamic(() =>
    import("@/registry/components/tabs/tabs-004/tabs-004").then((module) => module.Tabs004),
  ),
  "tabs-005": dynamic(() =>
    import("@/registry/components/tabs/tabs-005/tabs-005").then((module) => module.Tabs005),
  ),
  "tabs-006": dynamic(() =>
    import("@/registry/components/tabs/tabs-006/tabs-006").then((module) => module.Tabs006),
  ),
  "tabs-007": dynamic(() =>
    import("@/registry/components/tabs/tabs-007/tabs-007").then((module) => module.Tabs007),
  ),
  "tabs-008": dynamic(() =>
    import("@/registry/components/tabs/tabs-008/tabs-008").then((module) => module.Tabs008),
  ),
  "tabs-009": dynamic(() =>
    import("@/registry/components/tabs/tabs-009/tabs-009").then((module) => module.Tabs009),
  ),
  "tabs-010": dynamic(() =>
    import("@/registry/components/tabs/tabs-010/tabs-010").then((module) => module.Tabs010),
  ),
  "tabs-011": dynamic(() =>
    import("@/registry/components/tabs/tabs-011/tabs-011").then((module) => module.Tabs011),
  ),
  "tabs-013": dynamic(() =>
    import("@/registry/components/tabs/tabs-013/tabs-013").then((module) => module.Tabs013),
  ),
} satisfies PreviewMap
