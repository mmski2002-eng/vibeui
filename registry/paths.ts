import type { ItemKind } from "@/registry/categories"

/**
 * База URL каталога (браузер категорий) для типа: блоки, компоненты и
 * анимации живут на разных маршрутах верхнего уровня.
 *
 * Живёт отдельно от `registry/index.ts`: тот тянет metadata всех items
 * (`SOURCES`), и клиентский импорт даже одной функции оттуда уносил в бандл
 * витрины все registry.json целиком.
 */
export function catalogBasePath(kind: ItemKind): string {
  return kind === "block"
    ? "/blocks"
    : kind === "animation"
      ? "/animations"
      : "/components"
}

/**
 * База URL страницы item'а. Каждый тип держит детали в своём разделе —
 * блоки, компоненты и анимации независимы. Совпадает с catalogBasePath.
 */
export function itemBasePath(kind: ItemKind): string {
  return catalogBasePath(kind)
}
