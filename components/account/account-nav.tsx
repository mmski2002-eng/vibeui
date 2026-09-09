"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const SECTIONS = [
  { href: "/account", label: "Обзор" },
  { href: "/account/history", label: "Журнал" },
  { href: "/account/favorites", label: "Избранное" },
  { href: "/account/subscription", label: "Подписка" },
  { href: "/account/token", label: "Ключ установки" },
  { href: "/account/referrals", label: "Приглашения" },
  { href: "/account/security", label: "Безопасность" },
]

/**
 * Разделы кабинета. Текущий раздел подсвечен: без этого человек не понимает,
 * где находится, — единственная навигация в кабинете обязана отвечать на
 * этот вопрос.
 *
 * На узком экране список ложится в строку и прокручивается: вертикальное
 * меню на телефоне съело бы первый экран целиком.
 */
export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Разделы кабинета" className="lg:w-56 lg:shrink-0">
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
        {SECTIONS.map((section) => {
          const active =
            pathname === section.href ||
            (section.href !== "/account" && pathname.startsWith(section.href))

          return (
            <li key={section.href} className="shrink-0">
              <Link
                href={section.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                  active
                    ? "bg-shell-elevated text-shell-fg font-medium"
                    : "text-shell-muted hover:text-shell-fg hover:bg-shell-elevated/60"
                }`}
              >
                {section.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
