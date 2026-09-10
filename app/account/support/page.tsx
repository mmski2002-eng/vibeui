import { AccountSupport } from "@/components/pages/account/support"

const LOCALE = "ru" as const

export const metadata = {
  title: "Поддержка",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountSupport locale={LOCALE} />
}
