import { AccountSupport } from "@/components/pages/account/support"

const LOCALE = "en" as const

export const metadata = {
  title: "Support",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountSupport locale={LOCALE} />
}
