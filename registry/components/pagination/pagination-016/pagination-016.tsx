"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Pagination016Props = Omit<
  ComponentProps<"nav">,
  "children" | "defaultValue"
> & {
  total?: number
  defaultPage?: number
  label?: string
  /** Подпись навигации: компонент несёт русскую, проект подставляет свою. */
  navLabel?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labelText?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: переход к странице без набора номера и без риска
// ошибиться — сам номер выбирается из нативного select со списком всех
// страниц. В отличие от pagination-008 (текстовое поле + форма + проверка
// диапазона) здесь неверного значения не бывает в принципе: список содержит
// только существующие страницы, а select приносит клавиатуру, поиск по
// первой цифре и мобильный барабан выбора без единой строчки JS для этого.
const STYLES = `
:where([data-vibeui-block="pagination-016"]){
--vibeui-pagination-016-bg:transparent;
--vibeui-pagination-016-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.006 265));
--vibeui-pagination-016-muted:color-mix(in oklab,var(--vibeui-pagination-016-fg) 68%,transparent);
--vibeui-pagination-016-border:light-dark(oklch(0.91 0.006 265),oklch(0.38 0.012 265));
--vibeui-pagination-016-field:light-dark(oklch(0.97 0.003 265),oklch(0.29 0.009 265));
--vibeui-pagination-016-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.82 0.02 265 / 14%));
--vibeui-pagination-016-accent:light-dark(oklch(0.55 0.2 262),oklch(0.72 0.16 262));
--vibeui-pagination-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="pagination-016"]{color-scheme:dark}
[data-vibeui-block="pagination-016"]{
box-sizing:border-box;width:100%;max-width:24rem;
background:var(--vibeui-pagination-016-bg);color:var(--vibeui-pagination-016-fg);
font-family:var(--vibeui-pagination-016-font);
}
[data-vibeui-block="pagination-016"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;flex-wrap:wrap;
}
[data-vibeui-block="pagination-016"] [data-part="step"]{
appearance:none;cursor:pointer;
height:2rem;padding:0 0.75rem;box-sizing:border-box;
display:inline-flex;align-items:center;gap:0.375rem;
border:1px solid var(--vibeui-pagination-016-border);border-radius:0.5rem;
background:none;color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="pagination-016"] [data-part="step"]:hover:not(:disabled){background:var(--vibeui-pagination-016-hover)}
[data-vibeui-block="pagination-016"] [data-part="step"]:focus-visible{outline:2px solid var(--vibeui-pagination-016-accent);outline-offset:1px}
[data-vibeui-block="pagination-016"] [data-part="step"]:disabled{opacity:.45;cursor:default}
[data-vibeui-block="pagination-016"] [data-part="picker"]{
position:relative;display:inline-flex;align-items:center;
}
[data-vibeui-block="pagination-016"] [data-part="hint"]{
position:absolute;width:1px;height:1px;overflow:hidden;
clip-path:inset(50%);white-space:nowrap;
}
/* Нативный select: клавиатура, поиск по цифре и мобильный барабан — даром. */
[data-vibeui-block="pagination-016"] select{
appearance:none;cursor:pointer;
height:2rem;padding:0 1.75rem 0 0.625rem;box-sizing:border-box;
border:1px solid var(--vibeui-pagination-016-border);border-radius:0.5rem;
background:var(--vibeui-pagination-016-field);color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;font-weight:600;
}
[data-vibeui-block="pagination-016"] select:focus-visible{outline:2px solid var(--vibeui-pagination-016-accent);outline-offset:1px}
[data-vibeui-block="pagination-016"] [data-part="caret"]{
position:absolute;right:0.625rem;width:0.375rem;height:0.375rem;pointer-events:none;
margin-top:-0.1875rem;
border-right:1.5px solid var(--vibeui-pagination-016-muted);
border-bottom:1.5px solid var(--vibeui-pagination-016-muted);
transform:rotate(45deg);
}
[data-vibeui-block="pagination-016"] [data-part="of"]{
font-size:0.8125rem;color:var(--vibeui-pagination-016-muted);
font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="pagination-016"] *{animation:none!important;transition:none!important}}
`

const LABEL: Record<string, string> = {
  nav: "Навигация по страницам",
  prev: "← Назад",
  next: "Вперёд →",
  of: "из {total}",
}

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
 * Пагинация с переходом через нативный select: номер страницы выбирается
 * из списка, а не вводится, поэтому неверного значения не бывает.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Pagination016({
  total = 64,
  defaultPage = 12,
  label = "Страница",
  navLabel,
  labelText = LABEL,
  background = "",
  accent,
  className,
  style,
  ...props
}: Pagination016Props) {
  const id = useId()
  const [page, setPage] = useState(Math.min(Math.max(defaultPage, 1), total))

  const palette = {
    ...(accent ? { "--vibeui-pagination-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-pagination-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pages = Array.from({ length: total }, (_, index) => index + 1)

  return (
    <>
      <style href="vibeui-pagination-016" precedence="medium">
        {STYLES}
      </style>
      <nav
        {...props}
        data-slot="pagination"
        data-vibeui-block="pagination-016"
        aria-label={navLabel ?? labelText.nav ?? LABEL.nav}
        className={className}
        style={palette}
      >
        <div data-part="row">
          <button
            type="button"
            data-part="step"
            disabled={page === 1}
            onClick={() => setPage(Math.max(page - 1, 1))}
          >
            {labelText.prev ?? LABEL.prev}
          </button>
          <span data-part="picker">
            <label htmlFor={id} data-part="hint">
              {label}
            </label>
            <select
              id={id}
              value={page}
              aria-current="page"
              onChange={(event) => setPage(Number(event.target.value))}
            >
              {pages.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>
            <span data-part="caret" aria-hidden="true" />
          </span>
          <span data-part="of">
            {(labelText.of ?? LABEL.of).replace("{total}", String(total))}
          </span>
          <button
            type="button"
            data-part="step"
            disabled={page === total}
            onClick={() => setPage(Math.min(page + 1, total))}
          >
            {labelText.next ?? LABEL.next}
          </button>
        </div>
      </nav>
    </>
  )
}
