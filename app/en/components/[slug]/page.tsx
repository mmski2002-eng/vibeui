import { ItemPage } from "@/components/pages/item-page"
import { localizeItem } from "@/lib/localize"
import { getCatalogItem, getCatalogItems } from "@/registry/index"

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const found = getCatalogItem(slug)

  if (!found) {
    return {}
  }

  const block = localizeItem(found, "en")

  return {
    title: block.title ?? block.name,
    description: block.description,
  }
}

export function generateStaticParams() {
  return getCatalogItems().map((item) => ({ slug: item.name }))
}

export default async function EnComponentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params

  return <ItemPage locale="en" slug={slug} query={await searchParams} />
}
