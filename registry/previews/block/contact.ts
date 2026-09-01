// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Contact001 } from "@/registry/blocks/contact/contact-001/contact-001"
import { Contact002 } from "@/registry/blocks/contact/contact-002/contact-002"
import { Contact003 } from "@/registry/blocks/contact/contact-003/contact-003"
import { Contact004 } from "@/registry/blocks/contact/contact-004/contact-004"
import { Contact005 } from "@/registry/blocks/contact/contact-005/contact-005"
import { Contact006 } from "@/registry/blocks/contact/contact-006/contact-006"

export const PREVIEWS = {
  "contact-001": Contact001,
  "contact-002": Contact002,
  "contact-003": Contact003,
  "contact-004": Contact004,
  "contact-005": Contact005,
  "contact-006": Contact006,
} satisfies Record<string, ComponentType<PreviewProps>>
