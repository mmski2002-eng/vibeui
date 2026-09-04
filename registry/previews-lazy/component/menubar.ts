// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "menubar-001": dynamic(() =>
    import("@/registry/components/menubar/menubar-001/menubar-001").then(
      (module) => module.Menubar001,
    ),
  ),
  "menubar-002": dynamic(() =>
    import("@/registry/components/menubar/menubar-002/menubar-002").then(
      (module) => module.Menubar002,
    ),
  ),
  "menubar-003": dynamic(() =>
    import("@/registry/components/menubar/menubar-003/menubar-003").then(
      (module) => module.Menubar003,
    ),
  ),
  "menubar-004": dynamic(() =>
    import("@/registry/components/menubar/menubar-004/menubar-004").then(
      (module) => module.Menubar004,
    ),
  ),
  "menubar-005": dynamic(() =>
    import("@/registry/components/menubar/menubar-005/menubar-005").then(
      (module) => module.Menubar005,
    ),
  ),
  "menubar-006": dynamic(() =>
    import("@/registry/components/menubar/menubar-006/menubar-006").then(
      (module) => module.Menubar006,
    ),
  ),
  "menubar-007": dynamic(() =>
    import("@/registry/components/menubar/menubar-007/menubar-007").then(
      (module) => module.Menubar007,
    ),
  ),
  "menubar-008": dynamic(() =>
    import("@/registry/components/menubar/menubar-008/menubar-008").then(
      (module) => module.Menubar008,
    ),
  ),
} satisfies PreviewMap
