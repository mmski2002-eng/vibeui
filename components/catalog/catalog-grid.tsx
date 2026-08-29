import { CatalogCard } from "@/components/catalog/catalog-card"
import { CATEGORIES } from "@/registry/categories"
import type { BlockItem } from "@/registry/meta"

// Правила фильтра выводятся из списка категорий, а не пишутся руками:
// клиент переключает только data-catalog-filter на обёртке сетки.
const FILTER_STYLES = CATEGORIES.map(
  (category) =>
    `[data-catalog-filter="${category.slug}"] li[data-category]:not([data-category="${category.slug}"]){display:none}`,
).join("")

export function CatalogGrid({ blocks }: { blocks: BlockItem[] }) {
  return (
    <>
      <style href="vibeui-catalog-filter" precedence="medium">
        {FILTER_STYLES}
      </style>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => (
          <li key={block.name} data-category={block.categories?.[0]}>
            <CatalogCard block={block} />
          </li>
        ))}
      </ul>
    </>
  )
}
