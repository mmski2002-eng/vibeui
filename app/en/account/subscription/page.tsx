import { AccountBilling } from "@/components/pages/account/billing"

const LOCALE = "en" as const

export const metadata = {
  title: "Plan and billing",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountBilling locale={LOCALE} />
}
