"use client"

import Link from "next/link"
import { Filter, LayoutGrid, Rows3 } from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { CatalogSearch } from "@/components/catalog/catalog-search"
import { ScrollArea } from "@/components/catalog/scroll-area"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import type { ItemKind } from "@/registry/categories"
import { catalogBasePath } from "@/registry/index"

export type NavCategory = {
  slug: string
  label: string
  count: number
}

const ACTIVE = "bg-shell-elevated text-shell-fg"
const IDLE = "text-shell-fg hover:bg-shell-elevated"

function itemClass(active: boolean) {
  return (
    "catalog-nav-item flex w-full items-center justify-between gap-2 rounded-md font-medium transition-colors focus-visible:ring-shell-ring focus-visible:ring-2 focus-visible:outline-none " +
    (active ? ACTIVE : IDLE)
  )
}

/**
 * Обвязка витрины: строка инструментов под шапкой, колонка категорий и
 * контентная колонка.
 *
 * Категории — ссылки, а не кнопки фильтра: каждая живёт своей страницей
 * (`/components/<категория>`), поэтому её можно отправить ссылкой, а страница
 * грузит десятки items вместо всей витрины.
 *
 * Поиск фильтрует открытую страницу на месте и переносит запрос в адрес
 * (`?search=`), чтобы ссылку с уже применённым поиском можно было отправить.
 * Карточки при этом остаются серверными: обвязка только прячет неподошедшие
 * по `data-search` на элементе списка.
 */
export function CatalogChrome({
  locale,
  kind,
  categories,
  total,
  active,
  heading,
  children,
}: {
  locale: Locale
  kind: ItemKind
  categories: NavCategory[]
  total: number
  /** slug открытой категории; `null` — витрина целиком */
  active: string | null
  heading: ReactNode
  children: ReactNode
}) {
  const t = getDictionary(locale)
  const [filter, setFilter] = useState("")
  const [compact, setCompact] = useState(false)
  // Ключи привязаны к типу каталога: у компонентов, блоков и анимаций списки
  // разные, и общее положение прокрутки увело бы меню не туда.
  const navScrollKey = `vibeui-nav-scroll:${kind}`
  const navViewKey = `vibeui-nav-view:${kind}`
  const [query, setQuery] = useState("")
  const [empty, setEmpty] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  // Запрос из адреса читается на клиенте, а не через useSearchParams: страницы
  // витрины статические, и хук увёл бы их в рендер по запросу. Значение
  // приходится ставить именно из эффекта: на сервере адреса нет, а поле
  // управляемое — начальное состояние из window сломало бы гидратацию.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("search")

    if (initial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery(initial)
    }
  }, [])

  // Плотность списка переживает переход между категориями: страница меняется
  // целиком, а меню слева для человека остаётся тем же самым.
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(navViewKey) === "compact") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompact(true)
      }
    } catch {
      // Хранилище может быть заблокировано — тогда список просто обычный.
    }
  }, [navViewKey])

  useEffect(() => {
    const grid = gridRef.current

    if (!grid) {
      return
    }

    const needle = query.trim().toLowerCase()
    const cards = grid.querySelectorAll<HTMLElement>("li[data-search]")
    let shown = 0

    for (const card of cards) {
      const match =
        needle === "" || (card.dataset.search ?? "").includes(needle)

      card.hidden = !match

      if (match) {
        shown += 1
      }
    }

    setEmpty(cards.length > 0 && shown === 0)

    const url = new URL(window.location.href)

    if (needle === "") {
      url.searchParams.delete("search")
    } else {
      url.searchParams.set("search", needle)
    }

    window.history.replaceState(null, "", url)
  }, [query])

  const base = catalogBasePath(kind)
  const needle = filter.trim().toLowerCase()
  const visible = needle
    ? categories.filter((category) =>
        category.label.toLowerCase().includes(needle),
      )
    : categories

  const allLabel =
    kind === "block"
      ? t.topbar.blocks
      : kind === "animation"
        ? t.topbar.animations
        : t.topbar.components

  return (
    <>
      <div className="border-shell-border bg-shell sticky top-14 z-20 border-b">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-4 py-2 lg:gap-8 lg:px-6">
          <div className="hidden shrink-0 items-center gap-1 lg:flex lg:w-56">
            <div className="relative min-w-0 flex-1">
              <Filter
                className="text-shell-muted pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                type="text"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label={t.catalog.filterCategories}
                placeholder={t.catalog.filterCategories}
                className="text-shell-fg placeholder:text-shell-muted h-9 w-full rounded-md bg-transparent pr-2 pl-7 text-sm outline-none"
              />
            </div>

            {/* Плотность списка категорий, а не сетки: кнопка стоит над
                списком и сжимает его, чтобы в колонку помещалось больше
                категорий. */}
            <button
              type="button"
              onClick={() => {
                const next = !compact
                setCompact(next)

                try {
                  window.sessionStorage.setItem(
                    navViewKey,
                    next ? "compact" : "comfortable",
                  )
                } catch {
                  // Без хранилища плотность просто не переживёт переход.
                }
              }}
              aria-pressed={compact}
              title={
                compact ? t.catalog.comfortableView : t.catalog.compactView
              }
              className="border-shell-border text-shell-muted hover:text-shell-fg hover:border-shell-border-strong focus-visible:ring-shell-ring inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {compact ? (
                <Rows3 className="size-4" aria-hidden="true" />
              ) : (
                <LayoutGrid className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">
                {compact ? t.catalog.comfortableView : t.catalog.compactView}
              </span>
            </button>
          </div>

          <CatalogSearch locale={locale} value={query} onChange={setQuery} />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 lg:flex-row lg:gap-8 lg:px-6">
        {/* Линия-разделитель — на внешней обёртке, а не внутри прокрутки:
            внутри её правый край считается без полосы, и линия наезжала бы
            на список. */}
        <div className="relative hidden shrink-0 lg:sticky lg:top-27 lg:block lg:w-64 lg:self-start">
          <span
            aria-hidden="true"
            className="bg-shell-divider pointer-events-none absolute inset-y-0 right-0 w-px"
          />

          <ScrollArea
            className="max-h-[calc(100vh-6.75rem)]"
            storageKey={navScrollKey}
          >
            <aside
              data-density={compact ? "compact" : "comfortable"}
              className="pt-2 pr-2.5 pb-4 pl-2.5"
            >
              <div className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link
                      href={localePath(locale, base)}
                      aria-current={active === null ? "page" : undefined}
                      className={itemClass(active === null)}
                    >
                      {t.nav.all} {allLabel.toLowerCase()}
                      <span className="catalog-nav-count tabular-nums">
                        {total}
                      </span>
                    </Link>
                  </li>
                </ul>

                <p className="text-shell-muted mt-5 mb-2 px-3 text-xs font-medium tracking-wide uppercase">
                  {t.nav.heading}
                </p>

                <ul className="catalog-nav-list">
                  {visible.map((category) => (
                    <li key={category.slug}>
                      <Link
                        href={localePath(locale, `${base}/${category.slug}`)}
                        aria-current={
                          active === category.slug ? "page" : undefined
                        }
                        className={itemClass(active === category.slug)}
                      >
                        {category.label}
                        <span className="catalog-nav-count tabular-nums">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {visible.length === 0 ? (
                  <p className="text-shell-muted px-3 py-2 text-sm">
                    {t.catalog.searchEmpty}
                  </p>
                ) : null}
              </div>
            </aside>
          </ScrollArea>
        </div>

        <main className="min-w-0 flex-1 py-6 lg:py-8">
          {heading}

          {/* Мобильная лента категорий: колонки на телефоне нет, а переходить
              между категориями надо. */}
          <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden [&::-webkit-scrollbar]:hidden">
            <Link
              href={localePath(locale, base)}
              className={
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
                (active === null
                  ? "bg-shell-accent text-shell-accent-fg border-shell-accent"
                  : "border-shell-border text-shell-muted")
              }
            >
              {t.nav.all}
              <span className="text-xs tabular-nums opacity-70">{total}</span>
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={localePath(locale, `${base}/${category.slug}`)}
                className={
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors " +
                  (active === category.slug
                    ? "bg-shell-accent text-shell-accent-fg border-shell-accent"
                    : "border-shell-border text-shell-muted")
                }
              >
                {category.label}
                <span className="text-xs tabular-nums opacity-70">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>

          <div ref={gridRef}>{children}</div>

          {empty ? (
            <p className="text-shell-muted py-16 text-center text-sm">
              {t.catalog.searchEmpty}
            </p>
          ) : null}
        </main>
      </div>
    </>
  )
}
