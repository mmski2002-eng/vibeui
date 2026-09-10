import { AccountOverview } from "@/components/pages/account/overview"

const LOCALE = "en" as const

export const metadata = {
  title: "Account",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountOverview locale={LOCALE} />
}
