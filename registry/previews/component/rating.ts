// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Rating001 } from "@/registry/components/rating/rating-001/rating-001"
import { Rating002 } from "@/registry/components/rating/rating-002/rating-002"
import { Rating003 } from "@/registry/components/rating/rating-003/rating-003"
import { Rating004 } from "@/registry/components/rating/rating-004/rating-004"
import { Rating005 } from "@/registry/components/rating/rating-005/rating-005"
import { Rating006 } from "@/registry/components/rating/rating-006/rating-006"
import { Rating007 } from "@/registry/components/rating/rating-007/rating-007"
import { Rating008 } from "@/registry/components/rating/rating-008/rating-008"
import { Rating009 } from "@/registry/components/rating/rating-009/rating-009"

export const PREVIEWS = {
  "rating-001": Rating001,
  "rating-002": Rating002,
  "rating-003": Rating003,
  "rating-004": Rating004,
  "rating-005": Rating005,
  "rating-006": Rating006,
  "rating-007": Rating007,
  "rating-008": Rating008,
  "rating-009": Rating009,
} satisfies Record<string, ComponentType<PreviewProps>>
