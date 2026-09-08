import Link from "next/link"
import type { ReactNode } from "react"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { requireUser } from "@/lib/session"

export const metadata = {
  title: "Личный кабинет",
  robots: { index: false, follow: false },
}

const SECTIONS = [
  { href: "/account", label: "Обзор" },
  { href: "/account/subscription", label: "Подписка" },
  { href: "/account/token", label: "Ключ установки" },
  { href: "/account/favorites", label: "Избранное" },
  { href: "/account/referrals", label: "Приглашения" },
  { href: "/account/security", label: "Безопасность" },
]

export default async function AccountLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireUser()

  return (
    <CatalogShell locale="ru">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 lg:flex-row lg:px-6">
        <nav aria-label="Разделы кабинета" className="lg:w-52 lg:shrink-0">
          <p className="text-shell-muted mb-4 truncate text-xs">{user.email}</p>
          <ul className="flex flex-wrap gap-1 lg:flex-col">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="text-shell-muted hover:bg-shell-elevated hover:text-shell-fg block rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </CatalogShell>
  )
}
