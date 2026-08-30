import type { ReactNode } from "react"

import { CatalogTopbar } from "@/components/catalog/catalog-topbar"
import type { Locale } from "@/lib/i18n"
import { getCatalogItems } from "@/registry/index"

/**
 * Тёмная app-оболочка каталога. Палитра живёт в локальных токенах
 * `--shell-*` (см. `.catalog-shell` в globals.css), а не в глобальной теме:
 * сайт остаётся светлым, поэтому registry-блоки внутри миниатюр и preview
 * не перекрашиваются от контекста каталога.
 *
 * Дети — колонки контентной области: `CatalogSidebar` и `<main>`.
 */
export function CatalogShell({
  children,
  locale,
}: {
  children: ReactNode
  locale: Locale
}) {
  return (
    <div className="catalog-shell bg-shell text-shell-fg flex min-h-screen flex-col">
      <CatalogTopbar itemCount={getCatalogItems().length} locale={locale} />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 lg:flex-row lg:gap-8 lg:px-6">
        {children}
      </div>
    </div>
  )
}
