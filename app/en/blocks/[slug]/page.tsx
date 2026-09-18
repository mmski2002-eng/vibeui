import { CategoryPage } from "@/components/pages/category-page"
import { ItemPage } from "@/components/pages/item-page"
import { catalogSlugMetadata } from "@/lib/seo"
import {
  getCatalogItem,
  getCategoryCards,
  getItemsByKind,
} from "@/registry/index"

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return catalogSlugMetadata({ kind: "block", locale: "en", slug })
}

export function generateStaticParams() {
  return [
    ...getItemsByKind("block").map((item) => ({ slug: item.name })),
    ...getCategoryCards("block").map((category) => ({
      slug: category.slug,
    })),
  ]
}

export default async function EnBlockDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!getCatalogItem(slug)) {
    return <CategoryPage locale="en" kind="block" category={slug} />
  }

  return <ItemPage locale="en" slug={slug} />
}
