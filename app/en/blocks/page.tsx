import { CatalogPage } from "@/components/pages/catalog-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("en").blocks.metaTitle,
  description: getDictionary("en").blocks.description,
}

export default function EnBlocksPage() {
  return <CatalogPage locale="en" variant="blocks" />
}
