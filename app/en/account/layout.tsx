import type { ReactNode } from "react"

import { AccountShell } from "@/components/account/account-shell"

const LOCALE = "en" as const

export const metadata = {
  title: { default: "Account", template: "%s — VibeUI" },
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountShell locale={LOCALE}>{children}</AccountShell>
}
