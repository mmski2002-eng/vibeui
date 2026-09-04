"use client"

import Link from "next/link"
import { useState } from "react"

import { localePath, type Locale } from "@/lib/i18n"

export type ExplorerCategory = {
  slug: string
  label: string
  count: number
  href: string
}

export type ExplorerTab = {
  key: string
  label: string
  count: number
  categories: ExplorerCategory[]
}

/**
 * Табовый обзор категорий: сверху пилюли-типы с общим счётом, ниже —
 * мульти-колоночная сетка категорий с count-бейджами. Первый таб — «Все».
 */
export function CategoryExplorer({
  tabs,
  locale,
}: {
  tabs: ExplorerTab[]
  locale: Locale
}) {
  const [active, setActive] = useState(tabs[0]?.key)
  const current = tabs.find((tab) => tab.key === active) ?? tabs[0]

  if (!current) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-center gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            aria-pressed={tab.key === active}
            onClick={() => setActive(tab.key)}
            className={
              "focus-visible:ring-shell-ring inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
              (tab.key === active
                ? "bg-shell-elevated text-shell-fg"
                : "text-shell-muted hover:text-shell-fg hover:bg-shell-panel")
            }
          >
            {tab.label}
            <span
              className={
                "text-xs tabular-nums " +
                (tab.key === active ? "text-shell-muted" : "text-shell-muted/70")
              }
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {current.categories.map((category) => (
          <li key={`${current.key}:${category.slug}`}>
            <Link
              href={localePath(locale, category.href)}
              className="group focus-visible:ring-shell-ring flex items-center gap-2 rounded-md py-0.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="text-shell-fg/85 group-hover:text-shell-fg truncate font-medium transition-colors">
                {category.label}
              </span>
              <span className="border-shell-border text-shell-muted inline-flex min-w-5 items-center justify-center rounded-full border px-1.5 text-[0.6875rem] tabular-nums">
                {category.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
