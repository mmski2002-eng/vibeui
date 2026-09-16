import { AccountHistory } from "@/components/pages/account/history"
import { pageNumber } from "@/components/account/ui/pager"

const LOCALE = "en" as const

export const metadata = {
  title: "History",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; period?: string }>
}) {
  const { page, q, period } = await searchParams

  return (
    <AccountHistory
      locale={LOCALE}
      page={pageNumber(page)}
      query={q ?? ""}
      period={period ?? "all"}
    />
  )
}
