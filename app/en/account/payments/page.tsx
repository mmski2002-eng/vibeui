import { AccountPayments } from "@/components/pages/account/payments"

const LOCALE = "en" as const

export const metadata = {
  title: "Payments",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountPayments locale={LOCALE} />
}
