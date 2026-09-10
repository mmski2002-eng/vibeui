import { AccountHistory } from "@/components/pages/account/history"

const LOCALE = "en" as const

export const metadata = {
  title: "History",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountHistory locale={LOCALE} />
}
