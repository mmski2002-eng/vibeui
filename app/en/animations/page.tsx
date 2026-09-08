import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/animations",
  title: getDictionary("en").animations.metaTitle,
  description: getDictionary("en").animations.description,
})

export default function EnAnimationsPage() {
  return <CatalogPage locale="en" variant="animations" />
}
