"use client"

import { useState, type ReactNode } from "react"

import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"
import { getDictionary, type Locale } from "@/lib/i18n"
import type { CatalogNavSection } from "@/registry/index"

type Tab = {
  value: string
  label: string
  count: number
  nested?: boolean
}

const ACTIVE_ITEM = "bg-shell-elevated text-shell-fg "
const IDLE_ITEM = "text-shell-muted hover:text-shell-fg hover:bg-shell-panel "

/**
 * Плоский список фильтров, выведенный из разделов каталога. Типы и категории
 * живут на одной оси: активен всегда ровно один фильтр. Если тип в каталоге
 * один, строка типа не показывается — она дублировала бы «Всё».
 */
function buildTabs(
  sections: CatalogNavSection[],
  total: number,
  allLabel: string,
): Tab[] {
  const showKinds = sections.length > 1
  const tabs: Tab[] = [{ value: "all", label: allLabel, count: total }]

  for (const section of sections) {
    if (showKinds) {
      tabs.push({
        value: `kind:${section.kind}`,
        label: section.label,
        count: section.count,
      })
    }

    for (const category of section.categories) {
      tabs.push({
        value: category.slug,
        label: category.label,
        count: category.count,
        nested: showKinds,
      })
    }
  }

  return tabs
}

/**
 * Навигация по каталогу. Карточки остаются серверными: клиент только
 * переключает `data-catalog-filter` на `<main>`, а items прячутся правилами
 * из CSS каталога (см. CatalogGrid). Так фильтр не тянет items в бандл.
 *
 * Desktop — вертикальный список в sidebar, mobile — горизонтальная лента
 * над сеткой. URL-состояния в v1 нет: обе страницы каталога статические.
 */
export function CatalogNav({
  locale,
  sections,
  total,
  heading,
  children,
}: {
  locale: Locale
  sections: CatalogNavSection[]
  total: number
  heading: ReactNode
  children: ReactNode
}) {
  const t = getDictionary(locale)
  const [active, setActive] = useState("all")
  const tabs = buildTabs(sections, total, t.nav.all)

  return (
    <>
      <CatalogSidebar>
        <p className="text-shell-muted mb-3 px-3 text-xs font-medium tracking-wide uppercase">
          {t.nav.heading}
        </p>
        <ul role="group" aria-label={t.nav.filter} className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.value}>
              <button
                type="button"
                aria-pressed={active === tab.value}
                onClick={() => setActive(tab.value)}
                className={
                  "focus-visible:ring-shell-ring flex w-full items-center justify-between gap-2 rounded-md py-2 pr-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                  (tab.nested ? "pl-6 " : "pl-3 ") +
                  (active === tab.value ? ACTIVE_ITEM : IDLE_ITEM)
                }
              >
                {tab.label}
                <span className="text-shell-muted text-xs tabular-nums">
                  {tab.count}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </CatalogSidebar>

      <main
        data-catalog-filter={active}
        className="min-w-0 flex-1 py-6 lg:py-8"
      >
        {heading}

        {/* Мобильная лента фильтров: bleed за поля оболочки, чтобы первая
            кнопка совпадала по левому краю с сеткой. */}
        <div
          role="group"
          aria-label={t.nav.filter}
          className="-mx-4 mb-6 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active === tab.value}
              onClick={() => setActive(tab.value)}
              className={
                "focus-visible:ring-shell-ring inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                (active === tab.value
                  ? "bg-shell-accent text-shell-accent-fg border-shell-accent"
                  : "border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong")
              }
            >
              {tab.label}
              <span className="text-xs tabular-nums opacity-70">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {children}
      </main>
    </>
  )
}
