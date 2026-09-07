import { CatalogCard } from "@/components/catalog/catalog-card"
import { CategoryCard } from "@/components/catalog/category-card"
import type { Locale } from "@/lib/i18n"
import type { CategoryCard as Category } from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"

/**
 * Сетка витрины. Колонки считаются от ширины сетки, а не окна: рядом с
 * колонкой категорий окно шире доступного места, и viewport-брейкпоинты
 * давали бы лишнюю колонку.
 */
export function CatalogGrid({
  items,
  locale,
  single = false,
}: {
  items: CatalogItem[]
  locale: Locale
  /** Одна карточка в ряд: блоки — целые секции, вдвоём в ряд им тесно. */
  single?: boolean
}) {
  return (
    <div className="@container/grid">
      <ul className="catalog-grid" data-single={single ? "" : undefined}>
        {items.map((item) => (
          <li key={item.name}>
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
          <li key={category.slug}>
            <CategoryCard card={category} locale={locale} base={base} />
          </li>
        ))}
      </ul>
    </div>
  )
}
