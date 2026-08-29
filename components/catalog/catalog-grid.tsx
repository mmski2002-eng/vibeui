import { CatalogCard } from "@/components/catalog/catalog-card"
import { CATEGORIES, KINDS } from "@/registry/categories"
import { getItemKind } from "@/registry/index"
import type { CatalogItem } from "@/registry/meta"

// Правила фильтра выводятся из таксономии, а не пишутся руками: клиент
// переключает только data-catalog-filter на обёртке сетки. Фильтр
// одномерный — активен либо тип, либо категория.
const FILTER_STYLES = [
  ...KINDS.map(
    (kind) =>
      `[data-catalog-filter="kind:${kind.slug}"] li[data-kind]:not([data-kind="${kind.slug}"]){display:none}`,
  ),
  ...CATEGORIES.map(
    (category) =>
      `[data-catalog-filter="${category.slug}"] li[data-category]:not([data-category="${category.slug}"]){display:none}`,
  ),
].join("")

export function CatalogGrid({ items }: { items: CatalogItem[] }) {
  return (
    <>
      <style href="vibeui-catalog-filter" precedence="medium">
        {FILTER_STYLES}
      </style>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.name}
            data-kind={getItemKind(item.name)}
            data-category={item.categories?.[0]}
          >
            <CatalogCard item={item} />
          </li>
        ))}
      </ul>
    </>
  )
}
