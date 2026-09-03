"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Table004Row = {
  name: string
  views: number
  share: number
  updated: string
}

export type Table004Props = Omit<ComponentProps<"div">, "children"> & {
  rows?: Table004Row[]
  caption?: string
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<string, string>
  /** Локаль для группировки цифр и сравнения строк. */
  locale?: string
  /** Пусто — подложки нет, таблица лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

type Column = "name" | "views" | "share" | "updated"

// Идея компонента: сортировка по колонке. Заголовок — кнопка, а состояние
// объявлено через aria-sort: без него скринридер не сообщит, по чему
// отсортировано. Стрелка направления выводится текстом в разметке, а не
// поворотом фона, поэтому она читается вслух вместе с названием колонки.
//
// Тема берётся из color-scheme окружения через light-dark(): таблица темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="table-004"]){
--vibeui-table-004-bg:transparent;
--vibeui-table-004-fg:light-dark(oklch(0.24 0.014 265),oklch(0.93 0.006 265));
--vibeui-table-004-muted:color-mix(in oklab,var(--vibeui-table-004-fg) 68%,transparent);
--vibeui-table-004-border:light-dark(oklch(0.92 0.006 265),oklch(0.36 0.011 265));
--vibeui-table-004-head:light-dark(oklch(0.5 0.02 265 / 5%),oklch(0.85 0.02 265 / 7%));
--vibeui-table-004-hover:light-dark(oklch(0.55 0.02 265 / 5%),oklch(0.85 0.02 265 / 9%));
--vibeui-table-004-accent:light-dark(oklch(0.55 0.2 262),oklch(0.75 0.16 262));
--vibeui-table-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="table-004"]{color-scheme:dark}
[data-vibeui-block="table-004"]{
width:100%;box-sizing:border-box;overflow-x:auto;
background:var(--vibeui-table-004-bg);
border:1px solid var(--vibeui-table-004-border);border-radius:0.875rem;
font-family:var(--vibeui-table-004-font);color:var(--vibeui-table-004-fg);
}
[data-vibeui-block="table-004"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="table-004"] caption{
padding:0.75rem 0.875rem;text-align:left;
font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="table-004"] th,
[data-vibeui-block="table-004"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-table-004-border);
}
[data-vibeui-block="table-004"] thead th{background:var(--vibeui-table-004-head);font-weight:600;padding:0}
[data-vibeui-block="table-004"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Заголовок — кнопка: сортировка должна работать и с клавиатуры. */
[data-vibeui-block="table-004"] thead button{
display:flex;align-items:center;gap:0.25rem;width:100%;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.5rem 0.875rem;color:inherit;font:inherit;font-weight:600;
}
[data-vibeui-block="table-004"] th[data-align="end"] button{justify-content:flex-end}
[data-vibeui-block="table-004"] thead button:hover{background:var(--vibeui-table-004-hover)}
[data-vibeui-block="table-004"] thead button:focus-visible{outline:2px solid var(--vibeui-table-004-accent);outline-offset:-2px}
/* Стрелка текстом: её читают вслух вместе с названием колонки. */
[data-vibeui-block="table-004"] [data-part="arrow"]{color:var(--vibeui-table-004-accent);font-size:0.6875rem}
[data-vibeui-block="table-004"] th[aria-sort="none"] [data-part="arrow"]{color:var(--vibeui-table-004-muted);opacity:.4}
[data-vibeui-block="table-004"] tbody tr:hover{background:var(--vibeui-table-004-hover)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="table-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Table004Row[] = [
  { name: "Главная", views: 18402, share: 46.1, updated: "12 марта" },
  { name: "Услуги", views: 7118, share: 17.8, updated: "9 марта" },
  { name: "Портфолио", views: 6940, share: 17.4, updated: "2 марта" },
  { name: "Блог", views: 4233, share: 10.6, updated: "27 февраля" },
  { name: "Контакты", views: 3211, share: 8.1, updated: "20 февраля" },
]

const COLUMNS: { key: Column; numeric?: boolean }[] = [
  { key: "name" },
  { key: "views", numeric: true },
  { key: "share", numeric: true },
  { key: "updated" },
]

const COLUMN_TEXT: Record<string, string> = {
  name: "Страница",
  views: "Просмотры",
  share: "Доля",
  updated: "Изменена",
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
 * Таблица с сортировкой по колонке: заголовок-кнопка и aria-sort.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Table004({
  rows = DEFAULT_ROWS,
  caption = "Страницы сайта за март",
  columnText = COLUMN_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Table004Props) {
  const [column, setColumn] = useState<Column>("views")
  const [descending, setDescending] = useState(true)

  const sorted = [...rows].sort((a, b) => {
    const left = a[column]
    const right = b[column]
    const result =
      typeof left === "number" && typeof right === "number"
        ? left - right
        : String(left).localeCompare(String(right), locale)
    return descending ? -result : result
  })

  const toggle = (key: Column) => {
    if (key === column) return setDescending(!descending)
    setColumn(key)
    setDescending(key !== "name" && key !== "updated")
  }

  const palette = {
    ...(accent ? { "--vibeui-table-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-table-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-table-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="table"
        data-vibeui-block="table-004"
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              {COLUMNS.map((item) => (
                <th
                  key={item.key}
                  scope="col"
                  data-align={item.numeric ? "end" : undefined}
                  aria-sort={
                    item.key === column
                      ? descending
                        ? "descending"
                        : "ascending"
                      : "none"
                  }
                >
                  <button type="button" onClick={() => toggle(item.key)}>
                    {columnText[item.key] ?? COLUMN_TEXT[item.key]}
                    <span data-part="arrow" aria-hidden="true">
                      {item.key === column ? (descending ? "▼" : "▲") : "▼"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td data-align="end">{row.views.toLocaleString(locale)}</td>
                <td data-align="end">{row.share.toLocaleString(locale)} %</td>
                <td>{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
