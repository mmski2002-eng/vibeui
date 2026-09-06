"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination013Props = {
  total?: number
  defaultPerPage?: number
  sizes?: number[]
  siblings?: number
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подпись всего блока: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  prevLabel?: string
  nextLabel?: string
  /** Подпись номера страницы, {page} — сам номер. */
  pageLabel?: string
  /** Подпись группы кнопок размера страницы. */
  sizeGroupLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: размер страницы — не второстепенная настройка в выпадашке,
// а такой же переключатель, как номера страниц. Группа кнопок стоит рядом
// с рядом номеров, а не под ним, и виден текущий выбор без клика. При смене
// размера первая видимая строка остаётся первой видимой — иначе человек,
// стоявший на середине списка, после «показывать по 100» теряет место.
const STYLES = `
:where([data-vibeui-block="pagination-013"]){
--vibeui-pagination-013-bg:transparent;
--vibeui-pagination-013-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-pagination-013-muted:color-mix(in oklab,var(--vibeui-pagination-013-fg) 68%,transparent);
--vibeui-pagination-013-border:light-dark(oklch(0.91 0 265),oklch(0.36 0 265));
--vibeui-pagination-013-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.86 0 265 / 14%));
--vibeui-pagination-013-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-pagination-013-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0 265));
--vibeui-pagination-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-013"]{color-scheme:dark}
[data-vibeui-block="pagination-013"]{
box-sizing:border-box;width:100%;max-width:36rem;padding:0.5rem 0.625rem;
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap;
background:var(--vibeui-pagination-013-bg);color:var(--vibeui-pagination-013-fg);
border:1px solid var(--vibeui-pagination-013-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-013-font);
}
[data-vibeui-block="pagination-013"] [data-part="pager"]{
display:inline-flex;align-items:center;gap:0.25rem;flex-wrap:wrap;
}
[data-vibeui-block="pagination-013"] [data-part="cell"]{
appearance:none;cursor:pointer;
min-width:1.875rem;height:1.875rem;padding:0 0.375rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border:1px solid transparent;border-radius:0.5rem;background:none;
font:inherit;font-size:0.8125rem;color:inherit;font-variant-numeric:tabular-nums;
transition:background-color .14s ease;
}
[data-vibeui-block="pagination-013"] [data-part="cell"]:hover:not(:disabled){background:var(--vibeui-pagination-013-hover)}
[data-vibeui-block="pagination-013"] [data-part="cell"]:focus-visible{outline:2px solid var(--vibeui-pagination-013-accent);outline-offset:1px}
[data-vibeui-block="pagination-013"] [data-part="cell"]:disabled{color:var(--vibeui-pagination-013-muted);cursor:default;opacity:.5}
[data-vibeui-block="pagination-013"] [data-part="cell"][aria-current="page"]{
background:var(--vibeui-pagination-013-accent);color:var(--vibeui-pagination-013-on-accent);font-weight:650;
}
[data-vibeui-block="pagination-013"] [data-part="gap"]{color:var(--vibeui-pagination-013-muted);cursor:default}
[data-vibeui-block="pagination-013"] [data-part="sizes"]{
display:inline-flex;align-items:center;gap:0.25rem;
padding:0.1875rem;border:1px solid var(--vibeui-pagination-013-border);border-radius:0.625rem;
}
[data-vibeui-block="pagination-013"] [data-part="size-btn"]{
appearance:none;cursor:pointer;
min-width:2rem;height:1.625rem;padding:0 0.5rem;box-sizing:border-box;
border:0;border-radius:0.4375rem;background:none;color:inherit;font:inherit;font-size:0.75rem;
font-variant-numeric:tabular-nums;transition:background-color .14s ease,color .14s ease;
}
[data-vibeui-block="pagination-013"] [data-part="size-btn"]:hover{background:var(--vibeui-pagination-013-hover)}
[data-vibeui-block="pagination-013"] [data-part="size-btn"]:focus-visible{outline:2px solid var(--vibeui-pagination-013-accent);outline-offset:1px}
[data-vibeui-block="pagination-013"] [data-part="size-btn"][aria-pressed="true"]{
background:var(--vibeui-pagination-013-accent);color:var(--vibeui-pagination-013-on-accent);font-weight:650;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-013"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/** Окно номеров вокруг текущей страницы с краями и разрывами. */
function windowOf(page: number, total: number, siblings: number) {
  const pages = new Set<number>([1, total])

  for (let index = page - siblings; index <= page + siblings; index += 1) {
    if (index >= 1 && index <= total) {
      pages.add(index)
    }
  }

  const sorted = [...pages].sort((left, right) => left - right)
  const result: (number | "gap")[] = []

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) {
      result.push("gap")
    }

    result.push(value)
  })

  return result
}

/**
 * Номера страниц и группа кнопок размера страницы в одном ряду.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination013({
  total = 326,
  defaultPerPage = 25,
  sizes = [10, 25, 50, 100],
  siblings = 1,
  accent,
  background = "",
  navLabel = "Навигация по списку",
  prevLabel = "Предыдущая страница",
  nextLabel = "Следующая страница",
  pageLabel = "Страница {page}",
  sizeGroupLabel = "Показывать по",
  className,
  style,
}: Pagination013Props) {
  const [perPage, setPerPage] = useState(defaultPerPage)
  const [page, setPage] = useState(1)

  const palette = {
    ...(accent ? { "--vibeui-pagination-013-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pages = Math.max(1, Math.ceil(total / perPage))

  // Первая видимая строка остаётся первой видимой: пересчитываем номер
  // страницы от неё, а не сбрасываем на начало.
  function changeSize(next: number) {
    const anchor = (page - 1) * perPage
    setPerPage(next)
    setPage(Math.min(Math.floor(anchor / next) + 1, Math.ceil(total / next)))
  }

  const cells = windowOf(page, pages, siblings)

  return (
    <>
      <style href="vibeui-pagination-013" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="pagination"
        data-vibeui-block="pagination-013"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <span data-part="pager">
          <button
            type="button"
            data-part="cell"
            disabled={page === 1}
            aria-label={prevLabel}
            onClick={() => setPage(Math.max(page - 1, 1))}
          >
            ←
          </button>
          {cells.map((cell, index) =>
            cell === "gap" ? (
              <span key={`gap-${index}`} data-part="gap" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={cell}
                type="button"
                data-part="cell"
                aria-current={cell === page ? "page" : undefined}
                aria-label={pageLabel.replace("{page}", String(cell))}
                onClick={() => setPage(cell)}
              >
                {cell}
              </button>
            ),
          )}
          <button
            type="button"
            data-part="cell"
            disabled={page === pages}
            aria-label={nextLabel}
            onClick={() => setPage(Math.min(page + 1, pages))}
          >
            →
          </button>
        </span>
        <span data-part="sizes" role="group" aria-label={sizeGroupLabel}>
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              data-part="size-btn"
              aria-pressed={perPage === size}
              onClick={() => changeSize(size)}
            >
              {size}
            </button>
          ))}
        </span>
      </nav>
    </>
  )
}
