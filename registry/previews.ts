import type { ComponentType } from "react"

import { FEATURES_COMPONENTS } from "@/registry/blocks/features/components"
import { HERO_COMPONENTS } from "@/registry/blocks/hero/components"
import { PRICING_COMPONENTS } from "@/registry/blocks/pricing/components"
import { BUTTONS_COMPONENTS } from "@/registry/components/buttons/components"

// Карта slug -> React-компонент. Из неё рендерятся и миниатюра каталога,
// и /preview/[slug] — тот же файл, что получает пользователь.
//
// Файл называется previews.ts, а не components.ts, чтобы не конфликтовать
// с директорией registry/components/ (мелкие компоненты): они подключаются
// сюда так же, как категории блоков.
//
// TODO: карта ведётся руками параллельно с registry.json. При десятках items
// её нужно генерировать. Тогда же измерить вес /components: сейчас блоки —
// Server Components, но первый же Client Component добавит client JS.
export const CATALOG_PREVIEWS: Record<string, ComponentType> = {
  ...HERO_COMPONENTS,
  ...FEATURES_COMPONENTS,
  ...PRICING_COMPONENTS,
  ...BUTTONS_COMPONENTS,
}
