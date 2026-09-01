// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Gantt001 } from "@/registry/components/gantt/gantt-001/gantt-001"
import { Gantt002 } from "@/registry/components/gantt/gantt-002/gantt-002"
import { Gantt003 } from "@/registry/components/gantt/gantt-003/gantt-003"
import { Gantt004 } from "@/registry/components/gantt/gantt-004/gantt-004"
import { Gantt005 } from "@/registry/components/gantt/gantt-005/gantt-005"
import { Gantt006 } from "@/registry/components/gantt/gantt-006/gantt-006"
import { Gantt007 } from "@/registry/components/gantt/gantt-007/gantt-007"

export const PREVIEWS = {
  "gantt-001": Gantt001,
  "gantt-002": Gantt002,
  "gantt-003": Gantt003,
  "gantt-004": Gantt004,
  "gantt-005": Gantt005,
  "gantt-006": Gantt006,
  "gantt-007": Gantt007,
} satisfies Record<string, ComponentType<PreviewProps>>
