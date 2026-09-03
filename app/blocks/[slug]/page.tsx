import { CategoryPage } from "@/components/pages/category-page"
import { ItemPage } from "@/components/pages/item-page"
import { localizeItem } from "@/lib/localize"
import {
  getCatalogItem,
  getCategoryCards,
  getCategoryLabel,
  getItemsByKind,
} from "@/registry/index"

/**
 * Один сегмент на два вида страниц блоков: item и категория. Разводятся по
 * слову — у item'ов числовой суффикс, у категорий его нет.
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
    const category = getCategoryCards("block").find(
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
    ...getItemsByKind("block").map((item) => ({ slug: item.name })),
    ...getCategoryCards("block").map((category) => ({
      slug: category.slug,
    })),
  ]
}

export default async function BlockDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params

  if (!getCatalogItem(slug)) {
    return <CategoryPage locale="ru" kind="block" category={slug} />
  }

  return <ItemPage locale="ru" slug={slug} query={await searchParams} />
}
