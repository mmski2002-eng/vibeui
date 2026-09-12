"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

import { CatalogChrome, type NavCategory } from "@/components/catalog/catalog-chrome"
import type { Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"
import { catalogBasePath } from "@/registry/index"

/**
 * Живёт в layout раздела, поэтому переживает переходы между категориями:
 * меню слева не монтируется заново, а только получает новый `active`.
 *
 * Под тем же сегментом лежат страницы item'ов. Их страница несёт свою
 * разметку целиком, и обвязка витрины ей не нужна: по пути отличаем
 * категорию от item'а и для item'а отдаём children как есть.
 */
export function CatalogFrame({
  locale,
  kind,
  categories,
  total,
  children,
}: {
  locale: Locale
  kind: ItemKind
  categories: NavCategory[]
  total: number
  children: ReactNode
}) {
  const pathname = usePathname()
  const base = catalogBasePath(kind)
  const prefix = locale === "ru" ? base : `/${locale}${base}`
  const rest = pathname.startsWith(prefix)
    ? pathname.slice(prefix.length).replace(/^\/|\/$/g, "")
    : ""
  const active = rest === "" ? null : rest
  const isCategory =
    active === null || categories.some((category) => category.slug === active)

  if (!isCategory) {
    return children
  }

  return (
    <CatalogChrome
      locale={locale}
      kind={kind}
      categories={categories}
      total={total}
      active={active}
    >
      {children}
    </CatalogChrome>
  )
}
