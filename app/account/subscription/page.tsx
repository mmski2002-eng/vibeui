import { AccountBilling } from "@/components/pages/account/billing"

const LOCALE = "ru" as const

export const metadata = {
  title: "Тариф и оплата",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountBilling locale={LOCALE} />
}
