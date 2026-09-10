import type { ReactNode } from "react"

import { CatalogTopbar } from "@/components/catalog/catalog-topbar"
import { FavoritesProvider } from "@/components/catalog/favorites-provider"
import type { Locale } from "@/lib/i18n"
import { getCatalogItems } from "@/registry/index"

/**
 * Тёмная app-оболочка каталога. Палитра живёт в локальных токенах
 * `--shell-*` (см. `.catalog-shell` в globals.css), а не в глобальной теме:
 * сайт остаётся светлым, поэтому registry-блоки внутри миниатюр и preview
 * не перекрашиваются от контекста каталога.
 *
 * Оболочка даёт только шапку и фон. Ширину и колонки задаёт содержимое:
 * строка инструментов витрины тянет свою границу на всю ширину окна, а
 * колонки под ней ограничены контейнером.
 */
export function CatalogShell({
  children,
  locale,
  wash = false,
}: {
  children: ReactNode
  locale: Locale
  /** Тёплый налив под первым экраном. Только главная: в каталоге фон
   *  обязан успокоиться, там в фокусе карточки. */
  wash?: boolean
}) {
  return (
    <div
      // Пробел перед подстановкой обязателен: без него сборщик стилей
      // читает последний класс слитно с `${` и утилиту не выпускает.
      className={`catalog-shell bg-shell text-shell-fg flex min-h-screen flex-col [--catalog-header-height:6rem] lg:[--catalog-header-height:3.5rem] ${wash ? "shell-wash" : ""}`}
    >
      <CatalogTopbar itemCount={getCatalogItems().length} locale={locale} />
      {/* Отметки избранного грузятся один раз на страницу и раздаются
          карточкам: каталог статический, персональных данных в нём нет. */}
      <FavoritesProvider>{children}</FavoritesProvider>
    </div>
  )
}
