import { AccountReferrals } from "@/components/pages/account/referrals"

const LOCALE = "ru" as const

export const metadata = {
  title: "Приглашения",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountReferrals locale={LOCALE} />
}
