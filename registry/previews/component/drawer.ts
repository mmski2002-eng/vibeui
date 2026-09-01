// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Drawer001 } from "@/registry/components/drawer/drawer-001/drawer-001"
import { Drawer002 } from "@/registry/components/drawer/drawer-002/drawer-002"
import { Drawer003 } from "@/registry/components/drawer/drawer-003/drawer-003"
import { Drawer004 } from "@/registry/components/drawer/drawer-004/drawer-004"
import { Drawer005 } from "@/registry/components/drawer/drawer-005/drawer-005"
import { Drawer006 } from "@/registry/components/drawer/drawer-006/drawer-006"
import { Drawer007 } from "@/registry/components/drawer/drawer-007/drawer-007"
import { Drawer008 } from "@/registry/components/drawer/drawer-008/drawer-008"

export const PREVIEWS = {
  "drawer-001": Drawer001,
  "drawer-002": Drawer002,
  "drawer-003": Drawer003,
  "drawer-004": Drawer004,
  "drawer-005": Drawer005,
  "drawer-006": Drawer006,
  "drawer-007": Drawer007,
  "drawer-008": Drawer008,
} satisfies Record<string, ComponentType<PreviewProps>>
