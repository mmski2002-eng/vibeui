"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, ViewTransition } from "react"
import {
  BarChart3,
  ChevronDown,
  Clock,
  Coins,
  CreditCard,
  Handshake,
  Heart,
  LayoutGrid,
  LifeBuoy,
  Plug,
  Receipt,
  ScrollText,
  Shield,
  Users,
  UserPlus,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { localePath, stripLocale, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type Section = { href: string; label: string; icon: LucideIcon }

/**
 * Разделы кабинета двумя группами: сначала работа с библиотекой, потом
 * настройки аккаунта. Один плоский список из семи ссылок читался как
 * служебное меню — «ключ установки» стоял рядом с ежедневным избранным и
 * весил столько же.
 *
 * На телефоне вместо ленты — строка с названием текущего раздела и кнопкой,
 * которая раскрывает список. В ленте активный раздел уезжал за правый край:
 * человек, открывший безопасность по прямой ссылке, не видел, где он.
 */
export function AccountNav({
  locale,
  admin,
  partner,
}: {
  locale: Locale
  /** Право проверено на сервере. Вкладка — удобство, а не защита: каждая
   *  страница админки и каждое её действие спрашивают право заново. */
  admin?: boolean
  /** Партнёр программы: только у него есть раздел с рефералами. */
  partner?: boolean
}) {
  const t = ACCOUNT_TEXTS[locale]
  const pathname = stripLocale(usePathname())
  const [open, setOpen] = useState(false)
  const panel = useRef<HTMLDivElement>(null)

  const groups: { title: string; items: Section[] }[] = [
    {
      title: t.nav.library,
      items: [
        { href: "/account", label: t.nav.overview, icon: LayoutGrid },
        { href: "/account/favorites", label: t.nav.favorites, icon: Heart },
        { href: "/account/history", label: t.nav.history, icon: Clock },
      ],
    },
    {
      title: t.nav.account,
      items: [
        {
          href: "/account/subscription",
          label: t.nav.billing,
          icon: CreditCard,
        },
        { href: "/account/payments", label: t.nav.payments, icon: Receipt },
        { href: "/account/token", label: t.nav.connect, icon: Plug },
        ...(partner
          ? [{ href: "/account/referrals", label: t.nav.referrals, icon: UserPlus }]
          : []),
        { href: "/account/security", label: t.nav.profile, icon: Shield },
        { href: "/account/support", label: t.nav.support, icon: LifeBuoy },
      ],
    },
  ]

  if (admin) {
    groups.push({
      title: ADMIN_TEXTS.nav.group,
      items: [
        {
          href: "/account/admin",
          label: ADMIN_TEXTS.nav.summary,
          icon: BarChart3,
        },
        {
          href: "/account/admin/payments",
          label: ADMIN_TEXTS.nav.payments,
          icon: Wallet,
        },
        {
          href: "/account/admin/reports",
          label: ADMIN_TEXTS.nav.reports,
          icon: LifeBuoy,
        },
        {
          href: "/account/admin/users",
          label: ADMIN_TEXTS.nav.users,
          icon: Users,
        },
        {
          href: "/account/admin/partners",
          label: ADMIN_TEXTS.nav.partners,
          icon: Handshake,
        },
        {
          href: "/account/admin/payouts",
          label: ADMIN_TEXTS.nav.payouts,
          icon: Coins,
        },
        {
          href: "/account/admin/log",
          label: ADMIN_TEXTS.nav.log,
          icon: ScrollText,
        },
      ],
    })
  }

  const all = groups.flatMap((group) => group.items)
  const current =
    all.find((section) => isActive(pathname, section.href)) ?? all[0]

  // Клик мимо раскрытого меню закрывает его: на телефоне «назад» для этого
  // жеста нет, а лишний тап по названию раздела неочевиден.
  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (!panel.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)

    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  return (
    <nav aria-label={t.nav.sections} className="lg:w-60 lg:shrink-0">
      {/* Телефон и планшет */}
      <div ref={panel} className="relative lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-expanded={open}
          aria-controls="account-sections"
          className="border-shell-border bg-shell-panel text-shell-fg focus-visible:ring-shell-ring acc-press acc-shadow flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-sm font-medium focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="flex min-w-0 items-center gap-2">
            <current.icon
              className="text-shell-accent-text size-4 shrink-0"
              aria-hidden="true"
            />
            <span className="truncate">{current.label}</span>
          </span>
          <span className="text-shell-muted flex shrink-0 items-center gap-1 text-xs">
            {t.nav.sections}
            <ChevronDown
              className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>

        <div
          id="account-sections"
          hidden={!open}
          className="border-shell-border bg-shell-panel acc-shadow acc-reveal absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border p-2"
        >
          {groups.map((group) => (
            <div key={group.title} className="mb-2 last:mb-0">
              <p className="text-shell-muted px-2.5 pt-1.5 pb-1 text-[11px] font-medium tracking-wide uppercase">
                {group.title}
              </p>
              <ul>
                {group.items.map((section) => (
                  <li key={section.href}>
                    <NavLink
                      locale={locale}
                      section={section}
                      active={isActive(pathname, section.href)}
                      onNavigate={() => setOpen(false)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: колонка остаётся на месте при прокрутке длинных списков */}
      <div className="hidden lg:sticky lg:top-24 lg:block">
        {groups.map((group) => (
          <div key={group.title} className="mb-5 last:mb-0">
            <p className="text-shell-muted mb-1.5 px-3 text-[11px] font-medium tracking-wide uppercase">
              {group.title}
            </p>
            <ul className="grid gap-0.5">
              {group.items.map((section) => (
                <li key={section.href}>
                  <NavLink
                    locale={locale}
                    section={section}
                    active={isActive(pathname, section.href)}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}

        <Link
          href={localePath(locale, "/components")}
          className="text-shell-muted hover:text-shell-fg mt-6 inline-flex items-center gap-1.5 px-3 text-sm transition-colors"
        >
          {t.nav.catalog}
        </Link>
      </div>
    </nav>
  )
}

function NavLink({
  locale,
  section,
  active,
  onNavigate,
}: {
  locale: Locale
  section: Section
  active: boolean
  /** Закрыть раскрытое меню. Нужен только мобильной версии: там список
   *  перекрывает содержимое, и оставлять его открытым после перехода
   *  нельзя. Эффект по адресу для этого не нужен — переход начинается
   *  здесь же, по нажатию. */
  onNavigate?: () => void
}) {
  const Icon = section.icon

  return (
    <Link
      href={localePath(locale, section.href)}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "focus-visible:ring-shell-ring relative isolate flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none",
        active
          ? "text-shell-fg font-medium"
          : "text-shell-muted hover:bg-shell-elevated/60 hover:text-shell-fg",
      )}
    >
      {/* Подложка активного пункта — один элемент на всё меню: при
          переходе браузер перемещает её к новому пункту, а не рисует
          заново. Оранжевая риска слева — знак «вы здесь». */}
      {active ? (
        <ViewTransition name="acc-nav-pill" share="acc-pill" default="none">
          <span
            aria-hidden="true"
            className="bg-shell-elevated absolute inset-0 -z-10 rounded-lg"
          >
            <span className="bg-shell-accent absolute top-2 bottom-2 left-0 w-0.5 rounded-full" />
          </span>
        </ViewTransition>
      ) : null}
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          active && "text-shell-accent-text",
        )}
        aria-hidden="true"
      />
      <span className="truncate">{section.label}</span>
    </Link>
  )
}

/**
 * Корневые страницы («Обзор», «Сводка») активны только по точному адресу:
 * иначе «Сводка» подсвечивалась на каждой странице админки вместе с
 * настоящим разделом.
 */
function isActive(pathname: string, href: string) {
  return href === "/account" || href === "/account/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)
}
