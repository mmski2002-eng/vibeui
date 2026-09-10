import { AccountReferrals } from "@/components/pages/account/referrals"

const LOCALE = "en" as const

export const metadata = {
  title: "Invites",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountReferrals locale={LOCALE} />
}
