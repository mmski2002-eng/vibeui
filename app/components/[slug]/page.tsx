import { CategoryPage } from "@/components/pages/category-page"
import { ItemPage } from "@/components/pages/item-page"
import { localizeItem } from "@/lib/localize"
import {
  getCatalogItem,
  getCatalogItems,
  getCategoryCards,
  getCategoryLabel,
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
  const found = getCatalogItem(slug)

  if (!found) {
    const category = getCategoryCards("component").find(
      (entry) => entry.slug === slug,
    )

    return category ? { title: getCategoryLabel(category.slug) } : {}
  }

  const block = localizeItem(found, "ru")

  return {
    title: block.title ?? block.name,
    description: block.description,
  }
}

export function generateStaticParams() {
  return [
    ...getCatalogItems().map((item) => ({ slug: item.name })),
    ...getCategoryCards("component").map((category) => ({
      slug: category.slug,
    })),
  ]
}

export default async function ComponentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params

  if (!getCatalogItem(slug)) {
    return <CategoryPage locale="ru" kind="component" category={slug} />
  }

  return <ItemPage locale="ru" slug={slug} query={await searchParams} />
}
