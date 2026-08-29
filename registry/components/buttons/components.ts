import type { ComponentType } from "react"

// TODO: сейчас поддерживаются два параллельных индекса — registry.json (metadata)
// и эта карта (React-компонент для preview). При десятках items карту нужно
// генерировать из registry.json, а не вести руками.

import { Button001 } from "@/registry/components/buttons/button-001/button-001"
import { Button002 } from "@/registry/components/buttons/button-002/button-002"
import { Button003 } from "@/registry/components/buttons/button-003/button-003"
import { Button004 } from "@/registry/components/buttons/button-004/button-004"
import { Button005 } from "@/registry/components/buttons/button-005/button-005"
import { Button006 } from "@/registry/components/buttons/button-006/button-006"
import { Button007 } from "@/registry/components/buttons/button-007/button-007"
import { Button008 } from "@/registry/components/buttons/button-008/button-008"
import { Button009 } from "@/registry/components/buttons/button-009/button-009"
import { Button010 } from "@/registry/components/buttons/button-010/button-010"
import { Button011 } from "@/registry/components/buttons/button-011/button-011"

export const BUTTONS_COMPONENTS: Record<string, ComponentType> = {
  "button-001": Button001,
  "button-002": Button002,
  "button-003": Button003,
  "button-004": Button004,
  "button-005": Button005,
  "button-006": Button006,
  "button-007": Button007,
  "button-008": Button008,
  "button-009": Button009,
  "button-010": Button010,
  "button-011": Button011,
}
