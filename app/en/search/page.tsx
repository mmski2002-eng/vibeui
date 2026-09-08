import { SearchPage } from "@/components/pages/search-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("en").search.metaTitle,
  description: getDictionary("en").search.hint,
  robots: { index: false, follow: true },
}

export const dynamic = "force-dynamic"

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { q } = await searchParams
  const query = Array.isArray(q) ? (q[0] ?? "") : (q ?? "")

  return <SearchPage locale="en" query={query} />
}
