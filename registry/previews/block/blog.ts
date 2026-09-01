// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

import type { PreviewProps } from "@/registry/preview-types"

import { Blog001 } from "@/registry/blocks/blog/blog-001/blog-001"
import { Blog002 } from "@/registry/blocks/blog/blog-002/blog-002"
import { Blog003 } from "@/registry/blocks/blog/blog-003/blog-003"
import { Blog004 } from "@/registry/blocks/blog/blog-004/blog-004"
import { Blog005 } from "@/registry/blocks/blog/blog-005/blog-005"
import { Blog006 } from "@/registry/blocks/blog/blog-006/blog-006"

export const PREVIEWS = {
  "blog-001": Blog001,
  "blog-002": Blog002,
  "blog-003": Blog003,
  "blog-004": Blog004,
  "blog-005": Blog005,
  "blog-006": Blog006,
} satisfies Record<string, ComponentType<PreviewProps>>
