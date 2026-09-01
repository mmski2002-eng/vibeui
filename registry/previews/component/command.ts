// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Command001 } from "@/registry/components/command/command-001/command-001"
import { Command002 } from "@/registry/components/command/command-002/command-002"
import { Command003 } from "@/registry/components/command/command-003/command-003"
import { Command004 } from "@/registry/components/command/command-004/command-004"
import { Command005 } from "@/registry/components/command/command-005/command-005"
import { Command006 } from "@/registry/components/command/command-006/command-006"
import { Command007 } from "@/registry/components/command/command-007/command-007"
import { Command008 } from "@/registry/components/command/command-008/command-008"
import { Command009 } from "@/registry/components/command/command-009/command-009"
import { Command010 } from "@/registry/components/command/command-010/command-010"

export const PREVIEWS = {
  "command-001": Command001,
  "command-002": Command002,
  "command-003": Command003,
  "command-004": Command004,
  "command-005": Command005,
  "command-006": Command006,
  "command-007": Command007,
  "command-008": Command008,
  "command-009": Command009,
  "command-010": Command010,
} satisfies Record<string, ComponentType<PreviewProps>>
