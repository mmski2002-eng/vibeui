// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Cta001 } from "@/registry/blocks/cta/cta-001/cta-001"
import { Cta002 } from "@/registry/blocks/cta/cta-002/cta-002"
import { Cta003 } from "@/registry/blocks/cta/cta-003/cta-003"
import { Cta004 } from "@/registry/blocks/cta/cta-004/cta-004"
import { Cta005 } from "@/registry/blocks/cta/cta-005/cta-005"
import { Cta006 } from "@/registry/blocks/cta/cta-006/cta-006"

export const PREVIEWS = {
  "cta-001": Cta001,
  "cta-002": Cta002,
  "cta-003": Cta003,
  "cta-004": Cta004,
  "cta-005": Cta005,
  "cta-006": Cta006,
} satisfies Record<string, ComponentType<PreviewProps>>
