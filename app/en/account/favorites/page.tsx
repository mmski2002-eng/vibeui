import { AccountFavorites } from "@/components/pages/account/favorites"
import { pageNumber } from "@/components/account/ui/pager"

const LOCALE = "en" as const

export const metadata = {
  title: "Favourites",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; kind?: string }>
}) {
  const { page, q, kind } = await searchParams

  return (
    <AccountFavorites
      locale={LOCALE}
      page={pageNumber(page)}
      query={q ?? ""}
      kind={kind ?? "all"}
    />
  )
}
