// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "course-001": () =>
    import("@/registry/blocks/course/course-001/course-001").then((module) => module.Course001),
  "course-002": () =>
    import("@/registry/blocks/course/course-002/course-002").then((module) => module.Course002),
  "course-003": () =>
    import("@/registry/blocks/course/course-003/course-003").then((module) => module.Course003),
  "course-004": () =>
    import("@/registry/blocks/course/course-004/course-004").then((module) => module.Course004),
} satisfies PreviewLoaderMap
