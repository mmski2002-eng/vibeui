import { AccountReferralsGuide } from "@/components/pages/account/referrals-guide"

export const metadata = {
  title: "Partner guide",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountReferralsGuide locale="en" />
}
