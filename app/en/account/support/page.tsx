import { AccountSupport } from "@/components/pages/account/support"
import { pageNumber } from "@/components/account/ui/pager"

const LOCALE = "en" as const

export const metadata = {
  title: "Support",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams

  return <AccountSupport locale={LOCALE} page={pageNumber(page)} />
}
