// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Sparkline001 } from "@/registry/components/sparkline/sparkline-001/sparkline-001"
import { Sparkline002 } from "@/registry/components/sparkline/sparkline-002/sparkline-002"

export const PREVIEWS = {
  "sparkline-001": Sparkline001,
  "sparkline-002": Sparkline002,
} satisfies Record<string, ComponentType<PreviewProps>>
