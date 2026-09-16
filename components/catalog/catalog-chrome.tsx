"use client"

import Link from "next/link"
import {
  ChevronDown,
  Filter,
  LayoutGrid,
  Maximize2,
  Rows3,
  Grid2x2,
} from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

import { SearchBox } from "@/components/catalog/search-box"
import { ScrollArea } from "@/components/catalog/scroll-area"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { POPULAR_CATEGORIES, type ItemKind } from "@/registry/categories"
import { catalogBasePath } from "@/registry/index"

export type NavCategory = {
  slug: string
  label: string
  count: number
}

const ACTIVE =
  "bg-shell-elevated text-shell-fg shadow-[inset_2px_0_0_var(--shell-accent)]"
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
 * Поиск глобальный и живёт отдельно от страницы: он подсказывает по всему
 * каталогу и уводит на `/search`. Скрывать карточки открытой категории он
 * больше не пытается — так «тарифы» на `/components` находились ничем,
 * потому что категория `pricing` лежит в блоках.
 */
export function CatalogChrome({
  locale,
  kind,
  categories,
  total,
  active,
  children,
}: {
  locale: Locale
  kind: ItemKind
  categories: NavCategory[]
  total: number
  /** slug открытой категории; `null` — витрина целиком */
  active: string | null
  children: ReactNode
}) {
  const t = getDictionary(locale)
  const [filter, setFilter] = useState("")
  const [compact, setCompact] = useState(false)
  // Ключи привязаны к типу каталога: у компонентов, блоков и анимаций списки
  // разные, и общее положение прокрутки увело бы меню не туда.
  const navScrollKey = `vibeui-nav-scroll:${kind}`
  const navViewKey = `vibeui-nav-view:${kind}`
  // Режим витрины отдельный от плотности бокового списка: там уплотняется
  // меню, здесь — сами карточки. Ключ привязан к типу каталога: в кнопках
  // семьдесят вариантов и нужен обзор, а блок занимает экран целиком.
  const gridViewKey = `vibeui-grid-view:${kind}`
  const [overview, setOverview] = useState(false)
  // Подборку наверху колонки можно свернуть: тому, кто знает каталог
  // наизусть, она только отодвигает алфавит.
  const popularKey = `vibeui-nav-popular:${kind}`
  const [popularOpen, setPopularOpen] = useState(true)

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
    try {
      if (window.sessionStorage.getItem(popularKey) === "closed") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPopularOpen(false)
      }
    } catch {
      // Без хранилища подборка просто открыта.
    }
  }, [popularKey])

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(gridViewKey) === "overview") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOverview(true)
      }
    } catch {
      // Без хранилища витрина просто открывается крупными превью.
    }
  }, [gridViewKey])

  const base = catalogBasePath(kind)
  const needle = filter.trim().toLowerCase()
  const visible = needle
    ? categories.filter((category) =>
        category.label.toLowerCase().includes(needle),
      )
    : categories
  const popularSlugs = POPULAR_CATEGORIES[kind] as readonly string[]
  // Пока в фильтре что-то набрано, список один: человек ищет категорию, а не
  // выбирает из подборки, и деление на две части только прячет находку.
  const popular = needle
    ? []
    : popularSlugs
        .map((slug) => visible.find((category) => category.slug === slug))
        .filter((category): category is NavCategory => category !== undefined)
  // Свёрнутое «Популярное» не должно прятать категории: они возвращаются в
  // общий список, иначе пункт пропадает из меню целиком.
  const rest =
    popular.length && popularOpen
      ? visible.filter((category) => !popularSlugs.includes(category.slug))
      : visible

  function togglePopular() {
    const next = !popularOpen
    setPopularOpen(next)

    try {
      window.sessionStorage.setItem(popularKey, next ? "open" : "closed")
    } catch {
      // Без хранилища подборка просто откроется снова после перехода.
    }
  }

  function setGridView(next: boolean) {
    setOverview(next)

    try {
      window.sessionStorage.setItem(gridViewKey, next ? "overview" : "large")
    } catch {
      // Без хранилища режим просто не переживёт переход между категориями.
    }
  }

  const allLabel =
    kind === "block"
      ? t.topbar.blocks
      : kind === "animation"
        ? t.topbar.animations
        : t.topbar.components

  return (
    <>
      <div className="border-shell-border bg-shell sticky top-[var(--catalog-header-height)] z-30 border-b">
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
                autoComplete="off"
                name="vibeui-category-filter"
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

          <SearchBox locale={locale} kind={kind} />

          {/* Обзор против крупного превью. Один первый экран занимает почти
              всю высоту окна, и сравнить девятнадцать вариантов подряд
              невозможно — в обзоре они укладываются в один экран. */}
          <div
            role="group"
            aria-label={t.catalog.viewMode}
            className="border-shell-border flex shrink-0 items-center gap-0.5 rounded-md border p-0.5"
          >
            <button
              type="button"
              onClick={() => setGridView(true)}
              aria-pressed={overview}
              title={t.catalog.overview}
              className={
                "focus-visible:ring-shell-ring inline-flex size-7 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                (overview
                  ? "bg-shell-elevated text-shell-fg"
                  : "text-shell-muted hover:text-shell-fg")
              }
            >
              <Grid2x2 className="size-4" aria-hidden="true" />
              <span className="sr-only">{t.catalog.overview}</span>
            </button>
            <button
              type="button"
              onClick={() => setGridView(false)}
              aria-pressed={!overview}
              title={t.catalog.largePreview}
              className={
                "focus-visible:ring-shell-ring inline-flex size-7 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none " +
                (overview
                  ? "text-shell-muted hover:text-shell-fg"
                  : "bg-shell-elevated text-shell-fg")
              }
            >
              <Maximize2 className="size-4" aria-hidden="true" />
              <span className="sr-only">{t.catalog.largePreview}</span>
            </button>
          </div>
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

                {popular.length ? (
                  <>
                    <button
                      type="button"
                      onClick={togglePopular}
                      aria-expanded={popularOpen}
                      aria-controls="catalog-nav-popular"
                      className="text-shell-muted hover:text-shell-fg focus-visible:ring-shell-ring mt-5 mb-2 flex w-full items-center gap-1.5 rounded-md px-3 text-xs font-medium tracking-wide uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <ChevronDown
                        className={
                          "size-3.5 transition-transform " +
                          (popularOpen ? "" : "-rotate-90")
                        }
                        aria-hidden="true"
                      />
                      {t.nav.popular}
                    </button>

                    <ul
                      id="catalog-nav-popular"
                      hidden={!popularOpen}
                      className="catalog-nav-list"
                    >
                      {popular.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={localePath(
                              locale,
                              `${base}/${category.slug}`,
                            )}
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

                    {/* Полоса отделяет подборку от алфавита: без неё
                        повторно встреченная категория читается как сбой
                        сортировки. */}
                    <hr className="border-shell-divider my-3" />
                  </>
                ) : null}

                <p
                  className={
                    "text-shell-muted mb-2 px-3 text-xs font-medium tracking-wide uppercase " +
                    (popular.length ? "mt-0" : "mt-5")
                  }
                >
                  {t.nav.heading}
                </p>

                <ul className="catalog-nav-list">
                  {rest.map((category) => (
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

        {/* Заголовок и сетку отдаёт страница, лента категорий — обвязка.
            Колонка flex с order: заголовок страницы идёт первым, лента — за
            ним, сетка страницы (order-2) — последней. */}
        <main
          data-grid-view={overview ? "overview" : "large"}
          className="flex min-w-0 flex-1 flex-col py-6 lg:py-8"
        >
          {/* Мобильная лента категорий: колонки на телефоне нет, а переходить
              между категориями надо. */}
          <div className="nav-scroll order-1 -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
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
            {popular.map((category) => (
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

            {popular.length ? (
              <span
                aria-hidden="true"
                className="bg-shell-divider my-1.5 w-px shrink-0"
              />
            ) : null}

            {rest.map((category) => (
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

          {children}
        </main>
      </div>
    </>
  )
}
