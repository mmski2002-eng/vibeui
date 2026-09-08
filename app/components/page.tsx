import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/components",
  title: getDictionary("ru").components.metaTitle,
  description: getDictionary("ru").components.description,
})

export default function ComponentsPage() {
  return <CatalogPage locale="ru" variant="components" />
}
