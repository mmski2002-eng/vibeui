"use client"

import { useState } from "react"
import type { CSSProperties } from "react"

export type Pagination007Props = {
  total?: number
  defaultPerPage?: number
  sizes?: number[]
  /** Строка диапазона. {from}, {to} и {total} подставляются. */
  rangeText?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
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
--vibeui-pagination-007-bg:transparent;
--vibeui-pagination-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-pagination-007-muted:color-mix(in oklab,var(--vibeui-pagination-007-fg) 68%,transparent);
--vibeui-pagination-007-border:light-dark(oklch(0.91 0 265),oklch(0.38 0 265));
--vibeui-pagination-007-field:light-dark(oklch(0.97 0 265),oklch(0.29 0 265));
--vibeui-pagination-007-hover:light-dark(oklch(0.55 0 265 / 8%),oklch(0.82 0 265 / 14%));
--vibeui-pagination-007-accent:light-dark(oklch(0.287 0 0),oklch(0.899 0 0));
--vibeui-pagination-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
container-type:inline-size;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-007"]{color-scheme:dark}
[data-vibeui-block="pagination-007"]{
box-sizing:border-box;width:100%;
/* container-type отрывает ширину от содержимого: без нижней границы
   блок схлопывается внутри flex-контейнера. */
min-width:min(100%,16rem);max-width:34rem;
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

const LABEL: Record<string, string> = {
  nav: "Навигация по списку",
  prev: "Предыдущая страница",
  next: "Следующая страница",
  size: "Показывать по",
  where: "{page} / {pages}",
}

const RANGE_TEXT = "{from}–{to} из {total}"

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

/**
 * Пагинация с выбором размера страницы и сохранением места в списке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination007({
  total = 214,
  defaultPerPage = 20,
  sizes = [10, 20, 50, 100],
  rangeText = RANGE_TEXT,
  labelText = LABEL,
  background = "",
  accent,
  className,
  style,
}: Pagination007Props) {
  const [perPage, setPerPage] = useState(defaultPerPage)
  const [page, setPage] = useState(1)

  const palette = {
    ...(accent ? { "--vibeui-pagination-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="pagination"
        data-vibeui-block="pagination-007"
        aria-label={labelText.nav ?? LABEL.nav}
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <p data-part="range">
            {rangeText
              .replace("{from}", String(from))
              .replace("{to}", String(to))
              .replace("{total}", String(total))}
          </p>
          <span data-part="steps">
            <button
              type="button"
              data-part="step"
              data-dir="prev"
              disabled={page === 1}
              aria-label={labelText.prev ?? LABEL.prev}
              onClick={() => setPage(Math.max(page - 1, 1))}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <span data-part="where" aria-current="page">
              {(labelText.where ?? LABEL.where)
                .replace("{page}", String(page))
                .replace("{pages}", String(pages))}
            </span>
            <button
              type="button"
              data-part="step"
              data-dir="next"
              disabled={page === pages}
              aria-label={labelText.next ?? LABEL.next}
              onClick={() => setPage(Math.min(page + 1, pages))}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
          </span>
          <label data-part="size">
            {labelText.size ?? LABEL.size}
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
