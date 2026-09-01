// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Scrollarea001 } from "@/registry/components/scroll-area/scrollarea-001/scrollarea-001"
import { Scrollarea002 } from "@/registry/components/scroll-area/scrollarea-002/scrollarea-002"
import { Scrollarea003 } from "@/registry/components/scroll-area/scrollarea-003/scrollarea-003"
import { Scrollarea004 } from "@/registry/components/scroll-area/scrollarea-004/scrollarea-004"
import { Scrollarea005 } from "@/registry/components/scroll-area/scrollarea-005/scrollarea-005"
import { Scrollarea006 } from "@/registry/components/scroll-area/scrollarea-006/scrollarea-006"
import { Scrollarea007 } from "@/registry/components/scroll-area/scrollarea-007/scrollarea-007"

export const PREVIEWS = {
  "scrollarea-001": Scrollarea001,
  "scrollarea-002": Scrollarea002,
  "scrollarea-003": Scrollarea003,
  "scrollarea-004": Scrollarea004,
  "scrollarea-005": Scrollarea005,
  "scrollarea-006": Scrollarea006,
  "scrollarea-007": Scrollarea007,
} satisfies Record<string, ComponentType<PreviewProps>>
