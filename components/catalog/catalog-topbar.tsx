"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FlaskConical, Search, UserRound, X } from "lucide-react"
import { useRef } from "react"

import { LocaleSwitch } from "@/components/catalog/locale-switch"
import { ThemeSwitch } from "@/components/catalog/theme-switch"
import { getDictionary, localePath, stripLocale, type Locale } from "@/lib/i18n"

const ICON_LINK =
  "text-shell-muted hover:text-shell-fg hover:bg-shell-elevated focus-visible:ring-shell-ring flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"

export function CatalogTopbar({
  itemCount,
  locale,
}: {
  itemCount: number
  locale: Locale
}) {
  const t = getDictionary(locale)
  const en = locale === "en"
  const pathname = stripLocale(usePathname())
  const accountDialog = useRef<HTMLDialogElement>(null)
  const sections = [
    { href: "/components", label: t.topbar.components },
    { href: "/blocks", label: t.topbar.blocks },
    { href: "/animations", label: t.topbar.animations },
    { href: "/scenarios", label: t.topbar.scenarios },
  ]

  return (
    <header className="border-shell-border bg-shell sticky top-0 z-30 border-b">
      <div className="mx-auto grid h-[95px] w-full max-w-[1440px] grid-cols-[auto_1fr] grid-rows-[55px_40px] items-center gap-x-3 px-4 lg:h-[55px] lg:grid-cols-[auto_1fr_auto] lg:grid-rows-1 lg:gap-x-8 lg:px-6">
        <div className="flex items-center gap-3">
          <Link
            href={localePath(locale, "/")}
            aria-label={en ? "VibeUI home" : "VibeUI — главная"}
            className="text-shell-fg focus-visible:ring-shell-ring rounded text-lg font-semibold tracking-tight focus-visible:ring-2 focus-visible:outline-none"
          >
            Vibe<span className="text-shell-accent">UI</span>
          </Link>
          <span className="border-shell-border text-shell-muted hidden rounded-full border px-2 py-1 text-[11px] tabular-nums xl:inline">
            {t.topbar.items(itemCount)}
          </span>
        </div>

        <div className="col-span-2 row-start-2 flex min-w-0 items-center justify-between gap-1 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-start lg:gap-4">
          <nav
            aria-label={en ? "Main navigation" : "Основная навигация"}
            className="flex min-w-0 items-center gap-0.5 lg:gap-1"
          >
            {sections.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={localePath(locale, href)}
                  aria-current={active ? "page" : undefined}
                  className={`focus-visible:ring-shell-ring relative flex h-9 items-center rounded-lg px-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3 sm:text-sm ${active ? "bg-shell-elevated text-shell-fg after:bg-shell-accent after:absolute after:right-3 after:bottom-0 after:left-3 after:h-0.5 after:rounded-full" : "text-shell-muted hover:bg-shell-panel hover:text-shell-fg"}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="flex shrink-0 items-center gap-0.5 lg:ml-auto">
            <Link
              href={localePath(locale, "/search")}
              aria-label={en ? "Search the library" : "Поиск по библиотеке"}
              title={en ? "Search the library" : "Поиск по библиотеке"}
              className={ICON_LINK}
            >
              <Search className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/lab"
              aria-label={en ? "Workspace" : "Рабочая область"}
              title={en ? "Workspace" : "Рабочая область"}
              className={ICON_LINK}
            >
              <FlaskConical className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 lg:col-start-3 lg:gap-3">
          <ThemeSwitch />
          <LocaleSwitch locale={locale} />
          <span
            className="bg-shell-border mx-0.5 hidden h-5 w-px sm:block"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={() => accountDialog.current?.showModal()}
            aria-haspopup="dialog"
            className="border-shell-border-strong bg-shell-elevated text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <UserRound className="hidden size-4 sm:block" aria-hidden="true" />
            {en ? "Sign in" : "Войти"}
          </button>
        </div>
      </div>

      <dialog
        ref={accountDialog}
        aria-labelledby="account-title"
        aria-describedby="account-description"
        className="border-shell-border bg-shell-panel text-shell-fg fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border p-7 shadow-2xl backdrop:bg-black/60"
        onClick={(event) => {
          if (event.target === event.currentTarget)
            accountDialog.current?.close()
        }}
      >
        <button
          type="button"
          autoFocus
          onClick={() => accountDialog.current?.close()}
          aria-label={en ? "Close" : "Закрыть"}
          className={`${ICON_LINK} absolute top-3 right-3`}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
        <div className="bg-shell-elevated text-shell-accent mb-5 flex size-11 items-center justify-center rounded-xl">
          <UserRound className="size-5" aria-hidden="true" />
        </div>
        <h2 id="account-title" className="text-xl font-semibold tracking-tight">
          {en ? "Your account is coming soon" : "Личный кабинет скоро появится"}
        </h2>
        <p
          id="account-description"
          className="text-shell-muted mt-3 text-sm leading-relaxed"
        >
          {en
            ? "For now, explore designs and copy components for AI without signing in."
            : "А пока выбирай дизайн и копируй компоненты для ИИ без регистрации."}
        </p>
      </dialog>
    </header>
  )
}
