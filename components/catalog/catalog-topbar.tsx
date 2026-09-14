"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Search, UserRound } from "lucide-react"

import { LocaleSwitch } from "@/components/catalog/locale-switch"
import { ThemeSwitch } from "@/components/catalog/theme-switch"
import { useSession } from "@/lib/auth-client"
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
  const { data: session } = useSession()
  // До монтирования показываем гостевой вариант — тот же, что отдал сервер:
  // разметка кабинета статическая и сессии не знает, а `useSession` на
  // клиенте отдаёт её из куки сразу. Без этой задержки первый клиентский
  // рендер расходится с серверным (кнопка «Кабинет» вместо «Войти») и React
  // перерисовывает страницу целиком (hydration mismatch, ошибка #418).
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const authed = mounted && Boolean(session)
  const sections = [
    { href: "/components", label: t.topbar.components },
    { href: "/blocks", label: t.topbar.blocks },
    { href: "/animations", label: t.topbar.animations, pro: true },
    // Сценарии — вход со стороны задачи, а не ещё один список компонентов.
    // Из одинаковых подписей это не читается, поэтому у пункта метка.
    { href: "/scenarios", label: t.topbar.scenarios, marked: true, pro: true },
    { href: "/pricing", label: t.topbar.pricing },
  ]

  return (
    <header className="border-shell-border bg-shell-panel sticky top-0 z-30 border-b">
      <div className="mx-auto grid h-[95px] w-full max-w-[1440px] grid-cols-[auto_1fr] grid-rows-[55px_40px] items-center gap-x-3 px-4 lg:h-[55px] lg:grid-cols-[auto_1fr_auto] lg:grid-rows-1 lg:gap-x-8 lg:px-6">
        <div className="flex items-center gap-6">
          <Link
            href={localePath(locale, "/")}
            aria-label={en ? "VibeUI home" : "VibeUI — главная"}
            className="wordmark text-shell-fg focus-visible:ring-shell-ring flex items-center gap-2 rounded text-lg focus-visible:ring-2 focus-visible:outline-none"
          >
            {/* Эквалайзер вместо иконки: имя обещает vibe, и знак должен его
                показывать, а не просто называть. */}
            <span className="wordmark-eq" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>
              Vibe<span className="text-shell-accent">UI</span>
            </span>
          </Link>
          {/* Счётчик каталога, а не версия продукта: моноширинный, тише
              знака и отодвинут от него — вплотную «VibeUI 1572» читалось
              как номер сборки. */}
          <span className="type-label text-shell-muted hidden tabular-nums xl:inline">
            {t.topbar.items(itemCount)}
          </span>
        </div>

        <div className="col-span-2 row-start-2 flex min-w-0 items-center justify-between gap-1 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:justify-start lg:gap-4">
          <nav
            aria-label={en ? "Main navigation" : "Основная навигация"}
            // На узком экране пять разделов в строку не помещаются, поэтому
            // ряд прокручивается вбок. Прятать пункт нельзя: тарифы — как
            // раз то, что человек ищет глазами, а не находит в подвале.
            className="nav-scroll flex min-w-0 items-center gap-0.5 overflow-x-auto lg:gap-1"
          >
            {sections.map(({ href, label, marked, pro }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={localePath(locale, href)}
                  aria-current={active ? "page" : undefined}
                  className={`focus-visible:ring-shell-ring relative flex h-9 shrink-0 items-center rounded-lg px-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:outline-none sm:px-3 sm:text-sm ${active ? "bg-shell-elevated text-shell-fg shadow-[inset_0_-2px_0_var(--shell-accent)]" : "text-shell-muted hover:bg-shell-panel hover:text-shell-fg"}`}
                >
                  {marked ? (
                    <span
                      className="bg-shell-accent mr-1.5 size-1.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                  ) : null}
                  {label}
                  {pro ? (
                    <span
                      className="bg-shell-accent text-shell-accent-fg ml-1.5 inline-flex shrink-0 items-center rounded px-1 text-[0.5625rem] leading-[1.5] font-bold uppercase"
                      aria-hidden="true"
                    >
                      Pro
                    </span>
                  ) : null}
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
          </div>
        </div>

        <div className="col-start-2 row-start-1 flex items-center justify-end gap-2 lg:col-start-3 lg:gap-3">
          <ThemeSwitch />
          <LocaleSwitch locale={locale} />
          <span
            className="bg-shell-border mx-0.5 hidden h-5 w-px sm:block"
            aria-hidden="true"
          />
          <Link
            href={authed ? "/account" : "/signin"}
            className="border-shell-border-strong bg-shell-elevated text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <UserRound className="hidden size-4 sm:block" aria-hidden="true" />
            {authed ? (en ? "Account" : "Кабинет") : en ? "Sign in" : "Войти"}
          </Link>
        </div>
      </div>
    </header>
  )
}
