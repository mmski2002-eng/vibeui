"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination014Props = {
  page?: number
  total?: number
  siblings?: number
  accent?: string
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
--vibeui-pagination-014-bg:oklch(1 0 0);
--vibeui-pagination-014-fg:oklch(0.24 0.014 265);
--vibeui-pagination-014-muted:oklch(0.55 0.014 265);
--vibeui-pagination-014-border:oklch(0.91 0.006 265);
--vibeui-pagination-014-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-014-accent:oklch(0.55 0.2 262);
--vibeui-pagination-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pagination-014"]{
box-sizing:border-box;width:100%;max-width:28rem;padding:0.5rem;
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
background:var(--vibeui-pagination-014-accent);color:oklch(1 0 0);font-weight:650;
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
  className,
  style,
}: Pagination014Props) {
  const [page, setPage] = useState(Math.min(Math.max(initialPage, 1), total))

  const palette = {
    ...(accent ? { "--vibeui-pagination-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  const cells = windowOf(page, total, siblings)

  return (
    <>
      <style href="vibeui-pagination-014" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="pagination-014"
        aria-label="Страницы"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="step"
          disabled={page === 1}
          aria-label="Предыдущая страница"
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
                aria-label={`Страница ${cell}`}
                onClick={() => setPage(cell)}
              >
                {cell}
              </button>
            ),
          )}
        </span>
        <span data-part="compact" aria-current="page">
          <b>{page}</b> / {total}
        </span>
        <button
          type="button"
          data-part="step"
          disabled={page === total}
          aria-label="Следующая страница"
          onClick={() => setPage(Math.min(page + 1, total))}
        >
          →
        </button>
      </nav>
    </>
  )
}
