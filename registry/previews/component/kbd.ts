// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Kbd001 } from "@/registry/components/kbd/kbd-001/kbd-001"
import { Kbd002 } from "@/registry/components/kbd/kbd-002/kbd-002"
import { Kbd003 } from "@/registry/components/kbd/kbd-003/kbd-003"
import { Kbd004 } from "@/registry/components/kbd/kbd-004/kbd-004"
import { Kbd005 } from "@/registry/components/kbd/kbd-005/kbd-005"
import { Kbd006 } from "@/registry/components/kbd/kbd-006/kbd-006"

export const PREVIEWS = {
  "kbd-001": Kbd001,
  "kbd-002": Kbd002,
  "kbd-003": Kbd003,
  "kbd-004": Kbd004,
  "kbd-005": Kbd005,
  "kbd-006": Kbd006,
} satisfies Record<string, ComponentType<PreviewProps>>
