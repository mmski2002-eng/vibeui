import { AccountReferrals } from "@/components/pages/account/referrals"

const LOCALE = "ru" as const

export const metadata = {
  title: "Рефералы",
  robots: { index: false, follow: false },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ before?: string }>
}) {
  const { before } = await searchParams

  return <AccountReferrals locale={LOCALE} before={before} />
}
