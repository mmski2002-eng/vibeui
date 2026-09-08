import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/animations",
  title: getDictionary("ru").animations.metaTitle,
  description: getDictionary("ru").animations.description,
})

export default function AnimationsPage() {
  return <CatalogPage locale="ru" variant="animations" />
}
