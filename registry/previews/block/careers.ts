// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { PreviewLoaderMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "career-001": () =>
    import("@/registry/blocks/careers/career-001/career-001").then((module) => module.Career001),
  "career-002": () =>
    import("@/registry/blocks/careers/career-002/career-002").then((module) => module.Career002),
  "career-003": () =>
    import("@/registry/blocks/careers/career-003/career-003").then((module) => module.Career003),
} satisfies PreviewLoaderMap
