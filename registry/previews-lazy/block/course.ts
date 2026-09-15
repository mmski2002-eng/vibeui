// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "course-001": dynamic(() =>
    import("@/registry/blocks/course/course-001/course-001").then((module) => module.Course001),
  ),
  "course-002": dynamic(() =>
    import("@/registry/blocks/course/course-002/course-002").then((module) => module.Course002),
  ),
  "course-003": dynamic(() =>
    import("@/registry/blocks/course/course-003/course-003").then((module) => module.Course003),
  ),
  "course-004": dynamic(() =>
    import("@/registry/blocks/course/course-004/course-004").then((module) => module.Course004),
  ),
} satisfies PreviewMap
