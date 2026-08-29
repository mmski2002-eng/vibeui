import type { ComponentType } from "react"

// TODO: сейчас поддерживаются два параллельных индекса — registry.json (metadata)
// и эта карта (React-компонент для preview). При десятках блоков карту нужно
// генерировать из registry.json, а не вести руками.

import { Hero001 } from "@/registry/blocks/hero/hero-001/hero-001"
import { Hero002 } from "@/registry/blocks/hero/hero-002/hero-002"
import { Hero003 } from "@/registry/blocks/hero/hero-003/hero-003"

export const HERO_COMPONENTS: Record<string, ComponentType> = {
  "hero-001": Hero001,
  "hero-002": Hero002,
  "hero-003": Hero003,
}
