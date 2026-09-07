// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "switch-001": dynamic(() =>
    import("@/registry/components/switch/switch-001/switch-001").then((module) => module.Switch001),
  ),
  "switch-002": dynamic(() =>
    import("@/registry/components/switch/switch-002/switch-002").then((module) => module.Switch002),
  ),
  "switch-003": dynamic(() =>
    import("@/registry/components/switch/switch-003/switch-003").then((module) => module.Switch003),
  ),
  "switch-004": dynamic(() =>
    import("@/registry/components/switch/switch-004/switch-004").then((module) => module.Switch004),
  ),
  "switch-005": dynamic(() =>
    import("@/registry/components/switch/switch-005/switch-005").then((module) => module.Switch005),
  ),
  "switch-006": dynamic(() =>
    import("@/registry/components/switch/switch-006/switch-006").then((module) => module.Switch006),
  ),
  "switch-007": dynamic(() =>
    import("@/registry/components/switch/switch-007/switch-007").then((module) => module.Switch007),
  ),
  "switch-008": dynamic(() =>
    import("@/registry/components/switch/switch-008/switch-008").then((module) => module.Switch008),
  ),
  "switch-009": dynamic(() =>
    import("@/registry/components/switch/switch-009/switch-009").then((module) => module.Switch009),
  ),
  "switch-010": dynamic(() =>
    import("@/registry/components/switch/switch-010/switch-010").then((module) => module.Switch010),
  ),
  "switch-011": dynamic(() =>
    import("@/registry/components/switch/switch-011/switch-011").then((module) => module.Switch011),
  ),
  "switch-012": dynamic(() =>
    import("@/registry/components/switch/switch-012/switch-012").then((module) => module.Switch012),
  ),
  "switch-013": dynamic(() =>
    import("@/registry/components/switch/switch-013/switch-013").then((module) => module.Switch013),
  ),
  "switch-014": dynamic(() =>
    import("@/registry/components/switch/switch-014/switch-014").then((module) => module.Switch014),
  ),
  "switch-015": dynamic(() =>
    import("@/registry/components/switch/switch-015/switch-015").then((module) => module.Switch015),
  ),
  "switch-016": dynamic(() =>
    import("@/registry/components/switch/switch-016/switch-016").then((module) => module.Switch016),
  ),
} satisfies PreviewMap
