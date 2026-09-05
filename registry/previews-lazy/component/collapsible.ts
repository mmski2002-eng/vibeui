// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "collapsible-001": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-001/collapsible-001").then((module) => module.Collapsible001),
  ),
  "collapsible-002": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-002/collapsible-002").then((module) => module.Collapsible002),
  ),
  "collapsible-003": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-003/collapsible-003").then((module) => module.Collapsible003),
  ),
  "collapsible-004": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-004/collapsible-004").then((module) => module.Collapsible004),
  ),
  "collapsible-005": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-005/collapsible-005").then((module) => module.Collapsible005),
  ),
  "collapsible-006": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-006/collapsible-006").then((module) => module.Collapsible006),
  ),
  "collapsible-008": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-008/collapsible-008").then((module) => module.Collapsible008),
  ),
  "collapsible-009": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-009/collapsible-009").then((module) => module.Collapsible009),
  ),
  "collapsible-010": dynamic(() =>
    import("@/registry/components/collapsible/collapsible-010/collapsible-010").then((module) => module.Collapsible010),
  ),
} satisfies PreviewMap
