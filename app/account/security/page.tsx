import { AccountProfile } from "@/components/pages/account/profile"

const LOCALE = "ru" as const

export const metadata = {
  title: "Профиль и безопасность",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountProfile locale={LOCALE} />
}
