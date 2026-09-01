import { CategoryPage } from "@/components/pages/category-page"
import { getCategoryCards, getCategoryLabel } from "@/registry/index"

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  return { title: getCategoryLabel(category) }
}

export function generateStaticParams() {
  return getCategoryCards("block").map((category) => ({
    category: category.slug,
  }))
}

export default async function EnBlockCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await params

  return <CategoryPage locale="en" kind="block" category={category} />
}
