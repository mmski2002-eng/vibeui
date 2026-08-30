import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("en").components.metaTitle,
  description: getDictionary("en").components.description,
}

export default function EnComponentsPage() {
  return <CatalogPage locale="en" variant="components" />
}
