import { AccountConnect } from "@/components/pages/account/connect"

const LOCALE = "en" as const

export const metadata = {
  title: "Connect your project",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountConnect locale={LOCALE} />
}
