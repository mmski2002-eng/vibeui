// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Aspect001 } from "@/registry/components/aspect-ratio/aspect-001/aspect-001"
import { Aspect002 } from "@/registry/components/aspect-ratio/aspect-002/aspect-002"
import { Aspect003 } from "@/registry/components/aspect-ratio/aspect-003/aspect-003"
import { Aspect004 } from "@/registry/components/aspect-ratio/aspect-004/aspect-004"
import { Aspect005 } from "@/registry/components/aspect-ratio/aspect-005/aspect-005"
import { Aspect006 } from "@/registry/components/aspect-ratio/aspect-006/aspect-006"
import { Aspect007 } from "@/registry/components/aspect-ratio/aspect-007/aspect-007"
import { Aspect008 } from "@/registry/components/aspect-ratio/aspect-008/aspect-008"

export const PREVIEWS = {
  "aspect-001": Aspect001,
  "aspect-002": Aspect002,
  "aspect-003": Aspect003,
  "aspect-004": Aspect004,
  "aspect-005": Aspect005,
  "aspect-006": Aspect006,
  "aspect-007": Aspect007,
  "aspect-008": Aspect008,
} satisfies Record<string, ComponentType<PreviewProps>>
