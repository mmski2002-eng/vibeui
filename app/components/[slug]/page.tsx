import { CategoryPage } from "@/components/pages/category-page"
import { ItemPage } from "@/components/pages/item-page"
import { catalogSlugMetadata } from "@/lib/seo"
import {
  getCatalogItem,
  getCatalogItems,
  getCategoryCards,
  getItemKind,
} from "@/registry/index"

/**
 * Один сегмент на два вида страниц: item и категория. Разводятся по самому
 * слову — у item'ов всегда числовой суффикс (`button-001`), у категорий его
 * нет (`buttons`), поэтому пересечься они не могут.
 */
export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return catalogSlugMetadata({ kind: "component", locale: "ru", slug })
}

export function generateStaticParams() {
  return [
    // Каждый тип держит детали в своём разделе: сюда идут только компоненты,
    // блоки — на /blocks/[slug], анимации — на /animations/[slug].
    ...getCatalogItems()
      .filter((item) => getItemKind(item.name) === "component")
      .map((item) => ({ slug: item.name })),
    ...getCategoryCards("component").map((category) => ({
      slug: category.slug,
    })),
  ]
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!getCatalogItem(slug)) {
    return <CategoryPage locale="ru" kind="component" category={slug} />
  }

  return <ItemPage locale="ru" slug={slug} />
}
