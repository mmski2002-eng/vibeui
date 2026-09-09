import type { ReactNode } from "react"

import { AccountNav } from "@/components/account/account-nav"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { getSubscription } from "@/lib/entitlements"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
}

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireUser()
  const plan = await getSubscription(user.id)

  return (
    <CatalogShell locale="ru">
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 lg:px-6 lg:py-12">
        <header className="border-shell-border mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-center gap-3">
            {/* Инициал вместо аватара: загружать картинку некуда, а пустой
                кружок-заглушка выглядел бы как незагруженное изображение. */}
            <span
              aria-hidden="true"
              className="bg-shell-elevated text-shell-fg flex size-11 shrink-0 items-center justify-center rounded-xl text-lg font-semibold"
            >
              {(user.name || user.email).slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="text-shell-fg block truncate font-medium">
                {user.name || "Без имени"}
              </span>
              <span className="text-shell-muted block truncate text-sm">
                {user.email}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-lg px-2.5 py-1 text-sm font-medium ${
                plan
                  ? "bg-shell-accent text-shell-accent-fg"
                  : "border-shell-border text-shell-muted border"
              }`}
            >
              {plan ? "Pro" : "Бесплатный"}
            </span>
            <SignOutButton />
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <AccountNav />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </CatalogShell>
  )
}
