import { AccountPayments } from "@/components/pages/account/payments"

const LOCALE = "ru" as const

export const metadata = {
  title: "Оплата",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountPayments locale={LOCALE} />
}
