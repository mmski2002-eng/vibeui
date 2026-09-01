// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Progress001 } from "@/registry/components/progress/progress-001/progress-001"
import { Progress002 } from "@/registry/components/progress/progress-002/progress-002"
import { Progress003 } from "@/registry/components/progress/progress-003/progress-003"
import { Progress004 } from "@/registry/components/progress/progress-004/progress-004"
import { Progress005 } from "@/registry/components/progress/progress-005/progress-005"
import { Progress006 } from "@/registry/components/progress/progress-006/progress-006"
import { Progress007 } from "@/registry/components/progress/progress-007/progress-007"
import { Progress008 } from "@/registry/components/progress/progress-008/progress-008"
import { Progress009 } from "@/registry/components/progress/progress-009/progress-009"

export const PREVIEWS = {
  "progress-001": Progress001,
  "progress-002": Progress002,
  "progress-003": Progress003,
  "progress-004": Progress004,
  "progress-005": Progress005,
  "progress-006": Progress006,
  "progress-007": Progress007,
  "progress-008": Progress008,
  "progress-009": Progress009,
} satisfies Record<string, ComponentType<PreviewProps>>
