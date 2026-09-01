import { CatalogCard } from "@/components/catalog/catalog-card"
import { CategoryCard } from "@/components/catalog/category-card"
import type { Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import {
  getCategoryLabel,
  type CategoryCard as Category,
} from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"

/**
 * Строка, по которой ищет поле поиска. Лежит атрибутом на элементе списка:
 * так фильтрация не тянет данные items в клиентский бандл — обвязка просто
 * прячет неподошедшие карточки.
 */
function searchText(item: CatalogItem, locale: Locale): string {
  const localized = localizeItem(item, locale)
  const category = localized.categories?.[0]

  return [
    localized.title ?? localized.name,
    localized.name,
    category ? getCategoryLabel(category, locale) : "",
    ...(localized.meta?.tags ?? []),
  ]
    .join(" ")
    .toLowerCase()
}

/**
 * Сетка витрины. Колонки считаются от ширины сетки, а не окна: рядом с
 * колонкой категорий окно шире доступного места, и viewport-брейкпоинты
 * давали бы лишнюю колонку.
 */
export function CatalogGrid({
  items,
  locale,
}: {
  items: CatalogItem[]
  locale: Locale
}) {
  return (
    <div className="@container/grid">
      <ul className="catalog-grid">
        {items.map((item) => (
          <li key={item.name} data-search={searchText(item, locale)}>
            <CatalogCard item={item} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Та же сетка, но карточками категорий: витрина верхнего уровня. */
export function CategoryGrid({
  categories,
  locale,
  base,
}: {
  categories: Category[]
  locale: Locale
  base: string
}) {
  return (
    <div className="@container/grid">
      <ul className="catalog-grid">
        {categories.map((category) => (
          <li key={category.slug} data-search={category.search}>
            <CategoryCard card={category} locale={locale} base={base} />
          </li>
        ))}
      </ul>
    </div>
  )
}
