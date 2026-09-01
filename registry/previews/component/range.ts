// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Range001 } from "@/registry/components/range/range-001/range-001"
import { Range002 } from "@/registry/components/range/range-002/range-002"
import { Range003 } from "@/registry/components/range/range-003/range-003"
import { Range004 } from "@/registry/components/range/range-004/range-004"
import { Range005 } from "@/registry/components/range/range-005/range-005"
import { Range006 } from "@/registry/components/range/range-006/range-006"
import { Range007 } from "@/registry/components/range/range-007/range-007"

export const PREVIEWS = {
  "range-001": Range001,
  "range-002": Range002,
  "range-003": Range003,
  "range-004": Range004,
  "range-005": Range005,
  "range-006": Range006,
  "range-007": Range007,
} satisfies Record<string, ComponentType<PreviewProps>>
