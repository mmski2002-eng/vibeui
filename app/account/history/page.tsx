import { AccountHistory } from "@/components/pages/account/history"

const LOCALE = "ru" as const

export const metadata = {
  title: "История",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountHistory locale={LOCALE} />
}
