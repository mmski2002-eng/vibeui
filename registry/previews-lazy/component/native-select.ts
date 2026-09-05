// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "nativeselect-001": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-001/nativeselect-001").then((module) => module.Nativeselect001),
  ),
  "nativeselect-002": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-002/nativeselect-002").then((module) => module.Nativeselect002),
  ),
  "nativeselect-003": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-003/nativeselect-003").then((module) => module.Nativeselect003),
  ),
  "nativeselect-004": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-004/nativeselect-004").then((module) => module.Nativeselect004),
  ),
  "nativeselect-005": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-005/nativeselect-005").then((module) => module.Nativeselect005),
  ),
  "nativeselect-006": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-006/nativeselect-006").then((module) => module.Nativeselect006),
  ),
  "nativeselect-007": dynamic(() =>
    import("@/registry/components/native-select/nativeselect-007/nativeselect-007").then((module) => module.Nativeselect007),
  ),
} satisfies PreviewMap
