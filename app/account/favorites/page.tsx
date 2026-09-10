import { AccountFavorites } from "@/components/pages/account/favorites"

const LOCALE = "ru" as const

export const metadata = {
  title: "Избранное",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountFavorites locale={LOCALE} />
}
