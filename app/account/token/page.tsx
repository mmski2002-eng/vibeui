import { AccountConnect } from "@/components/pages/account/connect"

const LOCALE = "ru" as const

export const metadata = {
  title: "Подключение к проекту",
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountConnect locale={LOCALE} />
}
