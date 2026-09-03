// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Banner001 } from "@/registry/components/banner/banner-001/banner-001"
import { Banner002 } from "@/registry/components/banner/banner-002/banner-002"
import { Banner003 } from "@/registry/components/banner/banner-003/banner-003"
import { Banner004 } from "@/registry/components/banner/banner-004/banner-004"
import { Banner005 } from "@/registry/components/banner/banner-005/banner-005"
import { Banner006 } from "@/registry/components/banner/banner-006/banner-006"
import { Banner007 } from "@/registry/components/banner/banner-007/banner-007"
import { Banner008 } from "@/registry/components/banner/banner-008/banner-008"
import { Banner009 } from "@/registry/components/banner/banner-009/banner-009"
import { Banner010 } from "@/registry/components/banner/banner-010/banner-010"

export const PREVIEWS = {
  "banner-001": Banner001,
  "banner-002": Banner002,
  "banner-003": Banner003,
  "banner-004": Banner004,
  "banner-005": Banner005,
  "banner-006": Banner006,
  "banner-007": Banner007,
  "banner-008": Banner008,
  "banner-009": Banner009,
  "banner-010": Banner010,
} satisfies Record<string, ComponentType<PreviewProps>>
