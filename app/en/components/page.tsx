import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "en",
  path: "/components",
  title: getDictionary("en").components.metaTitle,
  description: getDictionary("en").components.description,
})

export default function EnComponentsPage() {
  return <CatalogPage locale="en" variant="components" />
}
