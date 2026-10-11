import { AccountReferralsGuide } from "@/components/pages/account/referrals-guide"

export const metadata = {
  title: "Инструкция партнёра",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountReferralsGuide locale="ru" />
}
