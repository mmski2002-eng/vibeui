import { AccountPayments } from "@/components/pages/account/payments"
import { pageNumber } from "@/components/account/ui/pager"

const LOCALE = "en" as const

export const metadata = {
  title: "Payments",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams

  return <AccountPayments locale={LOCALE} page={pageNumber(page)} />
}
