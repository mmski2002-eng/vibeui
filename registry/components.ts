import type { ComponentType } from "react"

import { FEATURES_COMPONENTS } from "@/registry/blocks/features/components"
import { HERO_COMPONENTS } from "@/registry/blocks/hero/components"

// TODO: карта ведётся руками параллельно с registry.json. При десятках блоков
// её нужно генерировать. Тогда же измерить вес /components: сейчас блоки —
// Server Components, но первый же Client Component в блоке добавит client JS.
export const BLOCK_COMPONENTS: Record<string, ComponentType> = {
  ...HERO_COMPONENTS,
  ...FEATURES_COMPONENTS,
}
