// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import dynamic from "next/dynamic"

import type { PreviewMap } from "@/registry/preview-types"

export const PREVIEWS = {
  "process-001": dynamic(() =>
    import("@/registry/blocks/process/process-001/process-001").then((module) => module.Process001),
  ),
} satisfies PreviewMap
