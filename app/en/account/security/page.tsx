import { AccountProfile } from "@/components/pages/account/profile"

const LOCALE = "en" as const

export const metadata = {
  title: "Profile and security",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountProfile locale={LOCALE} />
}
