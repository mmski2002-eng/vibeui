import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("ru").components.metaTitle,
  description: getDictionary("ru").components.description,
}

export default function ComponentsPage() {
  return <CatalogPage locale="ru" variant="components" />
}
