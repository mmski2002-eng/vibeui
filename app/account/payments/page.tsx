import { AccountPayments } from "@/components/pages/account/payments"
import { pageNumber } from "@/components/account/ui/pager"

const LOCALE = "ru" as const

export const metadata = {
  title: "Оплата",
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
