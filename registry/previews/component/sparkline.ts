// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Sparkline001 } from "@/registry/components/sparkline/sparkline-001/sparkline-001"
import { Sparkline002 } from "@/registry/components/sparkline/sparkline-002/sparkline-002"
import { Sparkline003 } from "@/registry/components/sparkline/sparkline-003/sparkline-003"
import { Sparkline004 } from "@/registry/components/sparkline/sparkline-004/sparkline-004"
import { Sparkline005 } from "@/registry/components/sparkline/sparkline-005/sparkline-005"

export const PREVIEWS = {
  "sparkline-001": Sparkline001,
  "sparkline-002": Sparkline002,
  "sparkline-003": Sparkline003,
  "sparkline-004": Sparkline004,
  "sparkline-005": Sparkline005,
} satisfies Record<string, ComponentType<PreviewProps>>
