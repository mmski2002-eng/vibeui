"use client"

import { useState, type ReactNode } from "react"

import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"

type Category = {
  slug: string
  label: string
  count: number
}

const ACTIVE_ITEM = "bg-shell-elevated text-shell-fg "
const IDLE_ITEM = "text-shell-muted hover:text-shell-fg hover:bg-shell-panel "

/**
 * Навигация по категориям. Карточки остаются серверными: клиент только
 * переключает `data-catalog-filter` на `<main>`, а блоки прячутся правилами
 * из CSS каталога (см. CatalogGrid). Так фильтр не тянет блоки в бандл.
 *
 * Desktop — вертикальный список в sidebar, mobile — горизонтальная лента
 * над сеткой. URL-состояния в v1 нет: обе страницы каталога статические.
 */
export function CatalogNav({
  categories,
  total,
  heading,
  children,
}: {
  categories: Category[]
  total: number
  heading: ReactNode
  children: ReactNode
}) {
  const [active, setActive] = useState("all")
  const tabs = [{ slug: "all", label: "Все", count: total }, ...categories]

  return (
    <>
      <CatalogSidebar>
        <p className="text-shell-muted mb-3 px-3 text-xs font-medium tracking-wide uppercase">
          Категории
        </p>
        <ul
          role="group"
          aria-label="Фильтр по типу блока"
          className="space-y-1"
        >
          {tabs.map((tab) => (
            <li key={tab.slug}>
              <button
                type="button"
                aria-pressed={active === tab.slug}
                onClick={() => setActive(tab.slug)}
                className={
                  "focus-visible:ring-shell-ring flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                  (active === tab.slug ? ACTIVE_ITEM : IDLE_ITEM)
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

        {/* Мобильная лента категорий: bleed за поля оболочки, чтобы первая
            кнопка совпадала по левому краю с сеткой. */}
        <div
          role="group"
          aria-label="Фильтр по типу блока"
          className="-mx-4 mb-6 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              aria-pressed={active === tab.slug}
              onClick={() => setActive(tab.slug)}
              className={
                "focus-visible:ring-shell-ring inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                (active === tab.slug
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
