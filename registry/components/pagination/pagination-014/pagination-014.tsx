"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination014Props = {
  page?: number
  total?: number
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
  /** Подпись счётчика в узком контейнере: {page} и {total}. */
  compactLabel?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: одна и та же пагинация ведёт себя по-разному в зависимости
// от того, сколько места ей досталось, а не от ширины экрана. В широком
// контейнере виден ряд номеров, в узком — например, в боковой панели или
// на телефоне — он уступает место паре стрелок и счётчику «страница из
// страниц». Переключает раскладку @container, а не медиазапрос: карточка
// в колонке сжимается так же, как окно браузера.
const STYLES = `
:where([data-vibeui-block="pagination-014"]){
--vibeui-pagination-014-bg:transparent;
--vibeui-pagination-014-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-pagination-014-muted:color-mix(in oklab,var(--vibeui-pagination-014-fg) 68%,transparent);
--vibeui-pagination-014-border:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-pagination-014-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.86 0.02 265 / 14%));
--vibeui-pagination-014-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.17 262));
--vibeui-pagination-014-on-accent:light-dark(oklch(1 0 0),oklch(0.19 0.02 265));
--vibeui-pagination-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-014"]{color-scheme:dark}
[data-vibeui-block="pagination-014"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:28rem;padding:0.5rem;
display:flex;align-items:center;justify-content:center;gap:0.375rem;
background:var(--vibeui-pagination-014-bg);color:var(--vibeui-pagination-014-fg);
border:1px solid var(--vibeui-pagination-014-border);border-radius:0.75rem;
font-family:var(--vibeui-pagination-014-font);
}
[data-vibeui-block="pagination-014"] [data-part="step"]{
appearance:none;cursor:pointer;
min-width:2.25rem;height:2.25rem;padding:0 0.5rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border:1px solid var(--vibeui-pagination-014-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="pagination-014"] [data-part="step"]:hover:not(:disabled){background:var(--vibeui-pagination-014-hover)}
[data-vibeui-block="pagination-014"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-014-accent);outline-offset:1px}
[data-vibeui-block="pagination-014"] [data-part="step"]:disabled{color:var(--vibeui-pagination-014-muted);cursor:default;opacity:.5}
[data-vibeui-block="pagination-014"] [data-part="numbers"]{display:inline-flex;align-items:center;gap:0.25rem}
[data-vibeui-block="pagination-014"] [data-part="cell"]{
appearance:none;cursor:pointer;
min-width:2rem;height:2rem;padding:0 0.375rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border:1px solid transparent;border-radius:0.5rem;background:none;
font:inherit;font-size:0.8125rem;color:inherit;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-014"] [data-part="cell"]:hover:not(:disabled){background:var(--vibeui-pagination-014-hover)}
[data-vibeui-block="pagination-014"] [data-part="cell"]:focus-visible{outline:2px solid var(--vibeui-pagination-014-accent);outline-offset:1px}
[data-vibeui-block="pagination-014"] [data-part="cell"][aria-current="page"]{
background:var(--vibeui-pagination-014-accent);color:var(--vibeui-pagination-014-on-accent);font-weight:650;
}
[data-vibeui-block="pagination-014"] [data-part="gap"]{color:var(--vibeui-pagination-014-muted)}
[data-vibeui-block="pagination-014"] [data-part="compact"]{
display:none;padding:0 0.5rem;font-size:0.875rem;color:var(--vibeui-pagination-014-fg);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-014"] [data-part="compact"] b{font-weight:650}
/* Ниже порога номера уступают место счётчику: пальцем в ряд цифр не попасть. */
@container (max-width: 21rem){
[data-vibeui-block="pagination-014"] [data-part="numbers"]{display:none}
[data-vibeui-block="pagination-014"] [data-part="compact"]{display:inline-block}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-014"] *{animation:none!important;transition:none!important}}
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
 * Пагинация, которая сама сворачивается до стрелок и счётчика в узком
 * контейнере — по ширине блока, а не по ширине окна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination014({
  page: initialPage = 4,
  total = 48,
  siblings = 1,
  accent,
  background = "",
  navLabel = "Страницы",
  prevLabel = "Предыдущая страница",
  nextLabel = "Следующая страница",
  pageLabel = "Страница {page}",
  compactLabel = "{page} / {total}",
  className,
  style,
}: Pagination014Props) {
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), total))

  const palette = {
    ...(accent ? { "--vibeui-pagination-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const cells = windowOf(page, total, siblings)
  // Номер в счётчике остаётся жирным, поэтому подпись режется по {page},
  // а не подставляется целиком.
  const compactParts = compactLabel.split("{page}")

  return (
    <>
      <style href="vibeui-pagination-014" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-slot="pagination"
        data-vibeui-block="pagination-014"
        aria-label={navLabel}
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="step"
          disabled={page === 1}
          aria-label={prevLabel}
          onClick={() => setPage(Math.max(page - 1, 1))}
        >
          ←
        </button>
        <span data-part="numbers">
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
        </span>
        <span data-part="compact" aria-current="page">
          {compactParts[0] ?? ""}
          <b>{page}</b>
          {(compactParts[1] ?? "").replace("{total}", String(total))}
        </span>
        <button
          type="button"
          data-part="step"
          disabled={page === total}
          aria-label={nextLabel}
          onClick={() => setPage(Math.min(page + 1, total))}
        >
          →
        </button>
      </nav>
    </>
  )
}
