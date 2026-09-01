// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Tree001 } from "@/registry/components/tree/tree-001/tree-001"
import { Tree002 } from "@/registry/components/tree/tree-002/tree-002"
import { Tree003 } from "@/registry/components/tree/tree-003/tree-003"
import { Tree004 } from "@/registry/components/tree/tree-004/tree-004"
import { Tree005 } from "@/registry/components/tree/tree-005/tree-005"
import { Tree006 } from "@/registry/components/tree/tree-006/tree-006"
import { Tree007 } from "@/registry/components/tree/tree-007/tree-007"
import { Tree008 } from "@/registry/components/tree/tree-008/tree-008"

export const PREVIEWS = {
  "tree-001": Tree001,
  "tree-002": Tree002,
  "tree-003": Tree003,
  "tree-004": Tree004,
  "tree-005": Tree005,
  "tree-006": Tree006,
  "tree-007": Tree007,
  "tree-008": Tree008,
} satisfies Record<string, ComponentType<PreviewProps>>
