// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Currency001 } from "@/registry/components/currency-input/currency-001/currency-001"
import { Currency002 } from "@/registry/components/currency-input/currency-002/currency-002"
import { Currency003 } from "@/registry/components/currency-input/currency-003/currency-003"
import { Currency004 } from "@/registry/components/currency-input/currency-004/currency-004"
import { Currency005 } from "@/registry/components/currency-input/currency-005/currency-005"
import { Currency006 } from "@/registry/components/currency-input/currency-006/currency-006"
import { Currency007 } from "@/registry/components/currency-input/currency-007/currency-007"

export const PREVIEWS = {
  "currency-001": Currency001,
  "currency-002": Currency002,
  "currency-003": Currency003,
  "currency-004": Currency004,
  "currency-005": Currency005,
  "currency-006": Currency006,
  "currency-007": Currency007,
} satisfies Record<string, ComponentType<PreviewProps>>
