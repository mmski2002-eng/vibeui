// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Faq001 } from "@/registry/blocks/faq/faq-001/faq-001"
import { Faq002 } from "@/registry/blocks/faq/faq-002/faq-002"
import { Faq003 } from "@/registry/blocks/faq/faq-003/faq-003"
import { Faq004 } from "@/registry/blocks/faq/faq-004/faq-004"
import { Faq005 } from "@/registry/blocks/faq/faq-005/faq-005"
import { Faq006 } from "@/registry/blocks/faq/faq-006/faq-006"

export const PREVIEWS = {
  "faq-001": Faq001,
  "faq-002": Faq002,
  "faq-003": Faq003,
  "faq-004": Faq004,
  "faq-005": Faq005,
  "faq-006": Faq006,
} satisfies Record<string, ComponentType<PreviewProps>>
