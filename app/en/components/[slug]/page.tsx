import { CategoryPage } from "@/components/pages/category-page"
import { ItemPage } from "@/components/pages/item-page"
import { catalogSlugMetadata } from "@/lib/seo"
import {
  getCatalogItem,
  getCatalogItems,
  getCategoryCards,
  getItemKind,
} from "@/registry/index"

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return catalogSlugMetadata({ kind: "component", locale: "en", slug })
}

export function generateStaticParams() {
  return [
    ...getCatalogItems()
      .filter((item) => getItemKind(item.name) === "component")
      .map((item) => ({ slug: item.name })),
    ...getCategoryCards("component").map((category) => ({
      slug: category.slug,
    })),
  ]
}

export default async function EnComponentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params

  if (!getCatalogItem(slug)) {
    return <CategoryPage locale="en" kind="component" category={slug} />
  }

  return <ItemPage locale="en" slug={slug} query={await searchParams} />
}
