import { AccountReferrals } from "@/components/pages/account/referrals"

const LOCALE = "en" as const

export const metadata = {
  title: "Referrals",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ before?: string; period?: string }>
}) {
  const { before, period } = await searchParams

  return <AccountReferrals locale={LOCALE} before={before} period={period === "90" ? 90 : 30} />
}
