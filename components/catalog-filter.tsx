"use client"

import { useState, type ReactNode } from "react"

type Category = {
  slug: string
  label: string
  count: number
}

/**
 * Вкладки категорий. Карточки остаются серверными: клиент только переключает
 * атрибут на обёртке, а сами блоки прячутся правилами из CSS каталога.
 * Так фильтр не тянет блоки в клиентский бандл.
 */
export function CatalogFilter({
  categories,
  total,
  children,
}: {
  categories: Category[]
  total: number
  children: ReactNode
}) {
  const [active, setActive] = useState("all")
  const tabs = [{ slug: "all", label: "Все", count: total }, ...categories]

  return (
    <>
      <div
        role="group"
        aria-label="Фильтр по типу блока"
        className="mb-8 flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            aria-pressed={active === tab.slug}
            onClick={() => setActive(tab.slug)}
            className={
              "focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none " +
              (active === tab.slug
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground hover:text-foreground hover:border-foreground/20")
            }
          >
            {tab.label}
            <span
              className={
                "text-xs " + (active === tab.slug ? "opacity-70" : "opacity-60")
              }
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div data-catalog-filter={active}>{children}</div>
    </>
  )
}
