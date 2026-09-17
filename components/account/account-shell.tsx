import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowUpRight, Sparkles } from "lucide-react"

import { AccountNav } from "@/components/account/account-nav"
import { PageTransition } from "@/components/account/page-transition"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ToastProvider } from "@/components/account/ui/toast"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { isAdmin } from "@/lib/admin"
import { localePath, type Locale } from "@/lib/i18n"
import { isPartner } from "@/lib/partners"
import { getSubscriptionState, isProState } from "@/lib/subscription-state"
import { requireUser } from "@/lib/session"
import { cn } from "@/lib/utils"

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
  const [state, admin, partner] = await Promise.all([
    getSubscriptionState(user.id),
    isAdmin(),
    isPartner(user.id),
  ])
  const t = ACCOUNT_TEXTS[locale]
  const pro = isProState(state)

  const planLabel =
    state.kind === "bonus" ? t.plan.bonus : pro ? t.plan.pro : t.plan.free

  const roleLabel = admin ? t.role.admin : partner ? t.role.partner : t.role.user

  return (
    <CatalogShell locale={locale} className="account-shell">
      <ToastProvider>
        <div className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 lg:px-6 lg:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            <div className="lg:w-60 lg:shrink-0">
              <div className="border-shell-border bg-shell-panel acc-shadow mb-4 flex items-center gap-3 rounded-xl border p-3">
                {/* Инициал вместо аватара: загружать картинку некуда, а пустой
                    кружок читался бы как незагруженное изображение. У Pro
                    инициал стоит на оранжевой подложке — тариф видно сразу. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold",
                    pro
                      ? "bg-shell-accent text-shell-accent-fg"
                      : "bg-shell-elevated text-shell-fg",
                  )}
                >
                  {(user.name || user.email).slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-shell-fg block truncate text-sm font-medium">
                    {user.name || user.email}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                        admin
                          ? "bg-shell-accent text-shell-accent-fg"
                          : partner
                            ? "bg-shell-elevated text-shell-accent-text"
                            : "bg-shell-elevated text-shell-muted",
                      )}
                    >
                      {roleLabel}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs",
                        pro
                          ? "text-shell-accent-text font-medium"
                          : "text-shell-muted",
                      )}
                    >
                      {pro ? (
                        <Sparkles className="size-3" aria-hidden="true" />
                      ) : null}
                      {planLabel}
                    </span>
                  </span>
                </span>
                <SignOutButton locale={locale} compact />
              </div>

              <AccountNav locale={locale} admin={admin} partner={partner} />

              <Link
                href={localePath(locale, "/components")}
                className="text-shell-muted hover:text-shell-fg mt-4 inline-flex items-center gap-1 text-sm transition-colors lg:hidden"
              >
                {t.nav.catalog}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>

            <main className="min-w-0 flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
      </ToastProvider>
    </CatalogShell>
  )
}
