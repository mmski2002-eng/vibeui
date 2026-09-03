// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Sheet001 } from "@/registry/components/sheet/sheet-001/sheet-001"
import { Sheet002 } from "@/registry/components/sheet/sheet-002/sheet-002"
import { Sheet003 } from "@/registry/components/sheet/sheet-003/sheet-003"
import { Sheet004 } from "@/registry/components/sheet/sheet-004/sheet-004"
import { Sheet005 } from "@/registry/components/sheet/sheet-005/sheet-005"
import { Sheet006 } from "@/registry/components/sheet/sheet-006/sheet-006"
import { Sheet007 } from "@/registry/components/sheet/sheet-007/sheet-007"
import { Menu007 } from "@/registry/components/sheet/menu-007/menu-007"
import { Sheet008 } from "@/registry/components/sheet/sheet-008/sheet-008"
import { Sheet009 } from "@/registry/components/sheet/sheet-009/sheet-009"
import { Sheet010 } from "@/registry/components/sheet/sheet-010/sheet-010"

export const PREVIEWS = {
  "sheet-001": Sheet001,
  "sheet-002": Sheet002,
  "sheet-003": Sheet003,
  "sheet-004": Sheet004,
  "sheet-005": Sheet005,
  "sheet-006": Sheet006,
  "sheet-007": Sheet007,
  "menu-007": Menu007,
  "sheet-008": Sheet008,
  "sheet-009": Sheet009,
  "sheet-010": Sheet010,
} satisfies Record<string, ComponentType<PreviewProps>>
