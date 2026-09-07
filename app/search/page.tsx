import { SearchPage } from "@/components/pages/search-page"
import { getDictionary } from "@/lib/i18n"

export const metadata = {
  title: getDictionary("ru").search.metaTitle,
  description: getDictionary("ru").search.hint,
}

/**
 * Выдача зависит от запроса в адресе, поэтому страница считается по запросу,
 * а не собирается заранее. Это единственная динамическая страница каталога:
 * поиск по полутора тысячам items занимает миллисекунды, индекс живёт в
 * памяти процесса.
 */
export const dynamic = "force-dynamic"

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { q } = await searchParams
  const query = Array.isArray(q) ? (q[0] ?? "") : (q ?? "")

  return <SearchPage locale="ru" query={query} />
}
