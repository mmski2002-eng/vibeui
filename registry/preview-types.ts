// Сгенерировано `npm run indexes` из registry/**/registry.json.
// Не править руками: правки затрёт следующая сборка.

import type { ComponentType } from "react"

export type PreviewProps = Record<string, unknown>
export type PreviewMap = Record<string, ComponentType<PreviewProps>>
export type PreviewMapModule = {
  PREVIEWS: PreviewMap
}

/**
 * Карта slug -> загрузчик компонента. Серверному рендеру превью нужен
 * из категории один item, а статические импорты тянули за собой всю
 * категорию — до девяноста компонентов ради одного.
 */
export type PreviewLoaderMap = Record<
  string,
  () => Promise<ComponentType<PreviewProps>>
>
