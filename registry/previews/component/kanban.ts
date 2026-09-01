// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Kanban001 } from "@/registry/components/kanban/kanban-001/kanban-001"
import { Kanban002 } from "@/registry/components/kanban/kanban-002/kanban-002"
import { Kanban003 } from "@/registry/components/kanban/kanban-003/kanban-003"
import { Kanban004 } from "@/registry/components/kanban/kanban-004/kanban-004"
import { Kanban005 } from "@/registry/components/kanban/kanban-005/kanban-005"
import { Kanban006 } from "@/registry/components/kanban/kanban-006/kanban-006"
import { Kanban007 } from "@/registry/components/kanban/kanban-007/kanban-007"

export const PREVIEWS = {
  "kanban-001": Kanban001,
  "kanban-002": Kanban002,
  "kanban-003": Kanban003,
  "kanban-004": Kanban004,
  "kanban-005": Kanban005,
  "kanban-006": Kanban006,
  "kanban-007": Kanban007,
} satisfies Record<string, ComponentType<PreviewProps>>
