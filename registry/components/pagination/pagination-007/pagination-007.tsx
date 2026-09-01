"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination007Props = {
  total?: number
  defaultPerPage?: number
  sizes?: number[]
  accent?: string
  className?: string
  style?: CSSProperties
}

// Идея компонента: пагинация таблицы, где размер страницы — часть навигации.
// При смене размера текущая позиция пересчитывается так, чтобы первая видимая
// строка осталась на месте: иначе человек, стоявший на 200-й строке, после
// «показывать по 50» оказывается в начале и теряет место в списке.
const STYLES = `
:where([data-vibeui-block="pagination-007"]){
--vibeui-pagination-007-bg:oklch(1 0 0);
--vibeui-pagination-007-fg:oklch(0.24 0.014 265);
--vibeui-pagination-007-muted:oklch(0.55 0.014 265);
--vibeui-pagination-007-border:oklch(0.91 0.006 265);
--vibeui-pagination-007-field:oklch(0.97 0.003 265);
--vibeui-pagination-007-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-pagination-007-accent:oklch(0.55 0.2 262);
--vibeui-pagination-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
[data-vibeui-block="pagination-007"]{
box-sizing:border-box;width:100%;max-width:34rem;
font-family:var(--vibeui-pagination-007-font);color:var(--vibeui-pagination-007-fg);
}
[data-vibeui-block="pagination-007"] [data-part="shell"]{
box-sizing:border-box;padding:0.5rem 0.625rem;
display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;
background:var(--vibeui-pagination-007-bg);
border:1px solid var(--vibeui-pagination-007-border);border-radius:0.75rem;
}
[data-vibeui-block="pagination-007"] [data-part="size"]{
display:inline-flex;align-items:center;gap:0.4375rem;
font-size:0.8125rem;color:var(--vibeui-pagination-007-muted);
}
[data-vibeui-block="pagination-007"] select{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 1.5rem 0 0.5rem;box-sizing:border-box;
border:1px solid var(--vibeui-pagination-007-border);border-radius:0.5rem;
background:var(--vibeui-pagination-007-field);color:var(--vibeui-pagination-007-fg);
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.75rem) 0.8125rem,calc(100% - 0.5rem) 0.8125rem;
background-size:0.25rem 0.25rem;background-repeat:no-repeat;
}
[data-vibeui-block="pagination-007"] select:focus-visible{outline:2px solid var(--vibeui-pagination-007-accent);outline-offset:1px}
[data-vibeui-block="pagination-007"] [data-part="range"]{
margin:0 auto 0 0;font-size:0.8125rem;color:var(--vibeui-pagination-007-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="pagination-007"] [data-part="steps"]{display:inline-flex;align-items:center;gap:0.25rem}
[data-vibeui-block="pagination-007"] [data-part="step"]{
appearance:none;cursor:pointer;
width:1.875rem;height:1.875rem;display:inline-grid;place-items:center;
border:1px solid var(--vibeui-pagination-007-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;
}
[data-vibeui-block="pagination-007"] [data-part="step"]:hover:not(:disabled){background:var(--vibeui-pagination-007-hover)}
[data-vibeui-block="pagination-007"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-007-accent);outline-offset:1px}
[data-vibeui-block="pagination-007"] [data-part="step"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="pagination-007"] [data-part="arrow"]{
width:0.4375rem;height:0.4375rem;
border:1.5px solid currentColor;border-right:0;border-bottom:0;transform:rotate(-45deg);
margin-left:0.1875rem;
}
[data-vibeui-block="pagination-007"] [data-part="step"][data-dir="next"] [data-part="arrow"]{transform:rotate(135deg);margin:0 0.1875rem 0 0}
[data-vibeui-block="pagination-007"] [data-part="where"]{
padding:0 0.5rem;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
/* В узком блоке выбор размера уходит на свою строку, а не сжимает диапазон. */
@container (max-width: 26rem){
[data-vibeui-block="pagination-007"] [data-part="size"]{order:3;width:100%}
[data-vibeui-block="pagination-007"] [data-part="range"]{order:1}
[data-vibeui-block="pagination-007"] [data-part="steps"]{order:2}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Пагинация с выбором размера страницы и сохранением места в списке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination007({
  total = 214,
  defaultPerPage = 20,
  sizes = [10, 20, 50, 100],
  accent,
  className,
  style,
}: Pagination007Props) {
  const [perPage, setPerPage] = useState(defaultPerPage)
  const [page, setPage] = useState(1)

  const palette = {
    ...(accent ? { "--vibeui-pagination-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const pages = Math.max(1, Math.ceil(total / perPage))
  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  // Первая видимая строка остаётся первой видимой: пересчитываем номер страницы
  // от неё, а не сбрасываем на начало.
  function changeSize(next: number) {
    const anchor = (page - 1) * perPage
    setPerPage(next)
    setPage(Math.min(Math.floor(anchor / next) + 1, Math.ceil(total / next)))
  }

  return (
    <>
      <style href="vibeui-pagination-007" precedence="medium">
        {STYLES}
      </style>
      <nav
        data-vibeui-block="pagination-007"
        aria-label="Навигация по списку"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="range">
            {from}–{to} из {total}
          </p>
          <span data-part="steps">
            <button
              type="button"
              data-part="step"
              data-dir="prev"
              disabled={page === 1}
              aria-label="Предыдущая страница"
              onClick={() => setPage(Math.max(page - 1, 1))}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <span data-part="where" aria-current="page">
              {page} / {pages}
            </span>
            <button
              type="button"
              data-part="step"
              data-dir="next"
              disabled={page === pages}
              aria-label="Следующая страница"
              onClick={() => setPage(Math.min(page + 1, pages))}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
          </span>
          <label data-part="size">
            Показывать по
            <select
              value={perPage}
              onChange={(event) => changeSize(Number(event.target.value))}
            >
              {sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </nav>
    </>
  )
}
