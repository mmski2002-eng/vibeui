import type { ReactNode } from "react"

import { CatalogFrame } from "@/components/catalog/catalog-frame"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import type { Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"
import { getCategoryCards, getItemsByKind } from "@/registry/index"

/**
 * Обвязка раздела каталога для layout: оболочка, строка инструментов и
 * колонка категорий. Собирается один раз на раздел, а не на страницу —
 * иначе при каждом переходе меню слева пересобиралось бы с нуля.
 */
export function CatalogLayout({
  locale,
  kind,
  children,
}: {
  locale: Locale
  kind: ItemKind
  children: ReactNode
}) {
  return (
    <CatalogShell locale={locale}>
      <CatalogFrame
        locale={locale}
        kind={kind}
        categories={getCategoryCards(kind, locale)}
        total={getItemsByKind(kind).length}
      >
        {children}
      </CatalogFrame>
    </CatalogShell>
  )
}
