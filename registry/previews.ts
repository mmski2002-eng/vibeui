// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import { Hero001 } from "@/registry/blocks/hero/hero-001/hero-001"
import { Hero002 } from "@/registry/blocks/hero/hero-002/hero-002"
import { Hero003 } from "@/registry/blocks/hero/hero-003/hero-003"
import { Features001 } from "@/registry/blocks/features/features-001/features-001"
import { Pricing001 } from "@/registry/blocks/pricing/pricing-001/pricing-001"
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
import { Input001 } from "@/registry/components/inputs/input-001/input-001"
import { Input002 } from "@/registry/components/inputs/input-002/input-002"
import { Textarea001 } from "@/registry/components/inputs/textarea-001/textarea-001"
import { Select001 } from "@/registry/components/inputs/select-001/select-001"
import { Checkbox001 } from "@/registry/components/inputs/checkbox-001/checkbox-001"
import { Switch001 } from "@/registry/components/inputs/switch-001/switch-001"

/**
 * Карта slug -> React-компонент. Из неё рендерятся и миниатюра каталога,
 * и `/preview/[slug]` — тот же файл, который получает пользователь.
 *
 * Файл называется previews.ts, а не components.ts, чтобы не конфликтовать
 * с директорией registry/components/ (мелкие компоненты).
 */
export const CATALOG_PREVIEWS: Record<string, ComponentType> = {
  "hero-001": Hero001,
  "hero-002": Hero002,
  "hero-003": Hero003,
  "features-001": Features001,
  "pricing-001": Pricing001,
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
  "input-001": Input001,
  "input-002": Input002,
  "textarea-001": Textarea001,
  "select-001": Select001,
  "checkbox-001": Checkbox001,
  "switch-001": Switch001,
}
