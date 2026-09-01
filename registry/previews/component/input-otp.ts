// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Otp001 } from "@/registry/components/input-otp/otp-001/otp-001"
import { Otp002 } from "@/registry/components/input-otp/otp-002/otp-002"
import { Otp003 } from "@/registry/components/input-otp/otp-003/otp-003"
import { Otp004 } from "@/registry/components/input-otp/otp-004/otp-004"
import { Otp005 } from "@/registry/components/input-otp/otp-005/otp-005"
import { Otp006 } from "@/registry/components/input-otp/otp-006/otp-006"
import { Otp007 } from "@/registry/components/input-otp/otp-007/otp-007"

export const PREVIEWS = {
  "otp-001": Otp001,
  "otp-002": Otp002,
  "otp-003": Otp003,
  "otp-004": Otp004,
  "otp-005": Otp005,
  "otp-006": Otp006,
  "otp-007": Otp007,
} satisfies Record<string, ComponentType<PreviewProps>>
