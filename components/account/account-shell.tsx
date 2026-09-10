import Link from "next/link"
import type { ReactNode } from "react"

import { AccountNav } from "@/components/account/account-nav"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { isAdmin } from "@/lib/admin"
import { localePath, type Locale } from "@/lib/i18n"
import { getSubscriptionState, isProState } from "@/lib/subscription-state"
import { requireUser } from "@/lib/session"

/**
 * Оболочка кабинета: колонка разделов и рабочая область.
 *
 * Профиль ужат до карточки в колонке. Раньше он занимал широкую полосу над
 * содержимым — самое заметное место экрана уходило на имя, почту и кнопку
 * выхода, то есть на то, что человек и так про себя знает.
 */
export async function AccountShell({
  locale,
  children,
}: {
  locale: Locale
  children: ReactNode
}) {
  const user = await requireUser(locale)
  const [state, admin] = await Promise.all([
    getSubscriptionState(user.id),
    isAdmin(),
  ])
  const t = ACCOUNT_TEXTS[locale]

  const planLabel =
    state.kind === "bonus"
      ? t.plan.bonus
      : isProState(state)
        ? t.plan.pro
        : t.plan.free

  return (
    <CatalogShell locale={locale}>
      <div className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
          <div className="lg:w-60 lg:shrink-0">
            <div className="border-shell-border bg-shell-panel mb-4 flex items-center gap-3 rounded-xl border p-3">
              {/* Инициал вместо аватара: загружать картинку некуда, а пустой
                  кружок читался бы как незагруженное изображение. */}
              <span
                aria-hidden="true"
                className="bg-shell-elevated text-shell-fg flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
              >
                {(user.name || user.email).slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-shell-fg block truncate text-sm font-medium">
                  {user.name || user.email}
                </span>
                <span className="text-shell-muted flex items-center gap-1.5 text-xs">
                  <span
                    className={
                      isProState(state) ? "text-shell-accent-text font-medium" : ""
                    }
                  >
                    {planLabel}
                  </span>
                </span>
              </span>
              <SignOutButton locale={locale} compact />
            </div>

            <AccountNav locale={locale} admin={admin} />

            <Link
              href={localePath(locale, "/components")}
              className="text-shell-muted hover:text-shell-fg mt-4 block text-sm transition-colors lg:hidden"
            >
              {t.nav.catalog}
            </Link>
          </div>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </CatalogShell>
  )
}
