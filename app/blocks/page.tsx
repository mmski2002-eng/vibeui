import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/blocks",
  title: getDictionary("ru").blocks.metaTitle,
  description: getDictionary("ru").blocks.description,
})

export default function BlocksPage() {
  return <CatalogPage locale="ru" variant="blocks" />
}
