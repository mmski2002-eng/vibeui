import { AccountFavorites } from "@/components/pages/account/favorites"

const LOCALE = "en" as const

export const metadata = {
  title: "Favourites",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountFavorites locale={LOCALE} />
}
