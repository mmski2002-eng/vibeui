import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("ru").animations.metaTitle,
  description: getDictionary("ru").animations.description,
}

export default function AnimationsPage() {
  return <CatalogPage locale="ru" variant="animations" />
}
