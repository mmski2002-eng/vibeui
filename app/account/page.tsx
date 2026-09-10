import { AccountOverview } from "@/components/pages/account/overview"

const LOCALE = "ru" as const

export const metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountOverview locale={LOCALE} />
}
