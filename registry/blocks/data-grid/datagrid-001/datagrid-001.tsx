"use client"

import { useState } from "react"
import { Card151 } from "@/registry/components/card/card-151/card-151"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid001Row = {
  title: string
  team: string
  stock: number
  price: number
  updated: string
}

export type Datagrid001Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid001Row[]
  caption?: string
  density?: "comfortable" | "compact"
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Названия колонок по ключу строки: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Строка панели, когда ключей сортировки нет. */
  emptySortText?: string
  /** Подпись фишки на снятие ключа. {column} — название колонки. */
  removeSortLabel?: string
  /** Подпись кнопки сброса сортировки. */
  resetText?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Знак валюты в колонке цены. */
  currency?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

type Column = keyof Datagrid001Row
type Direction = "ascending" | "descending"
type SortKey = { column: Column; direction: Direction }

// Идея компонента: сортировка не по одной колонке, а стопкой ключей.
// Порядок кликов и есть приоритет, поэтому он показан цифрой в заголовке
// и продублирован фишками в панели — иначе «почему строки стоят так»
// нельзя прочитать глазами. Заголовок остаётся кнопкой с aria-sort.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-001"]){
--vibeui-datagrid-001-bg:transparent;
--vibeui-datagrid-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-datagrid-001-muted:color-mix(in oklab,var(--vibeui-datagrid-001-fg) 68%,transparent);
--vibeui-datagrid-001-border:light-dark(oklch(0.92 0 265),oklch(0.34 0 265));
--vibeui-datagrid-001-head:light-dark(oklch(0.975 0 265),oklch(0.27 0 265));
--vibeui-datagrid-001-hover:light-dark(oklch(0.55 0 265 / 6%),oklch(0.78 0 265 / 10%));
--vibeui-datagrid-001-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-datagrid-001-accent-soft:light-dark(oklch(0.287 0 0 / 10%),oklch(0.903 0 0 / 20%));
--vibeui-datagrid-001-rank-fg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-datagrid-001-radius:0.875rem;
--vibeui-datagrid-001-pad:0.625rem;
--vibeui-datagrid-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-001-dur-2:180ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-001"]{color-scheme:dark}
[data-vibeui-block="datagrid-001"]{
box-sizing:border-box;width:100%;max-width:64rem;margin:0 auto;
background:var(--vibeui-datagrid-001-bg);color:var(--vibeui-datagrid-001-fg);
border:1px solid var(--vibeui-datagrid-001-border);
border-radius:var(--vibeui-datagrid-001-radius);
font-family:var(--vibeui-datagrid-001-font);overflow:hidden;
}
[data-vibeui-block="datagrid-001"][data-density="compact"]{--vibeui-datagrid-001-pad:0.375rem}
[data-vibeui-block="datagrid-001"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-001"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-001"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-001-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-001"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-001"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-001-muted);
}
[data-vibeui-block="datagrid-001"] th,
[data-vibeui-block="datagrid-001"] td{
text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-001-border);
}
[data-vibeui-block="datagrid-001"] td{padding:var(--vibeui-datagrid-001-pad) 0.875rem}
[data-vibeui-block="datagrid-001"] thead th{
padding:0;background:var(--vibeui-datagrid-001-head);font-weight:600;
}
/* Заголовок — кнопка на всю ячейку: клик мимо буквы тоже должен сортировать. */
[data-vibeui-block="datagrid-001"] thead button{
display:flex;align-items:center;gap:0.375rem;width:100%;
appearance:none;border:0;background:none;cursor:pointer;font:inherit;font-weight:600;
padding:0.5rem 0.875rem;color:inherit;
}
[data-vibeui-block="datagrid-001"] th[data-align="end"] button{justify-content:flex-end}
[data-vibeui-block="datagrid-001"] thead button:hover{background:var(--vibeui-datagrid-001-hover)}
[data-vibeui-block="datagrid-001"] thead button:focus-visible{outline:2px solid var(--vibeui-datagrid-001-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-001"] [data-part="mark"]{
display:inline-flex;align-items:center;gap:0.125rem;
font-size:0.6875rem;color:var(--vibeui-datagrid-001-accent);
}
[data-vibeui-block="datagrid-001"] th[aria-sort="none"] [data-part="mark"]{color:var(--vibeui-datagrid-001-muted);opacity:.35}
[data-vibeui-block="datagrid-001"] [data-part="rank"]{
min-width:1rem;height:1rem;border-radius:999px;
display:inline-flex;align-items:center;justify-content:center;
font-size:0.625rem;font-weight:700;
color:oklch(from var(--vibeui-datagrid-001-accent) clamp(0,(0.62 - l) * 100,1) 0 0);background:var(--vibeui-datagrid-001-accent);
}
[data-vibeui-block="datagrid-001"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-001"] tbody tr:hover{background:var(--vibeui-datagrid-001-hover)}
[data-vibeui-block="datagrid-001"] [data-part="team"]{color:var(--vibeui-datagrid-001-muted)}
[data-vibeui-block="datagrid-001"] [data-part="name"]{padding:var(--vibeui-datagrid-001-pad) 0.875rem;font-weight:500}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid001Row[] = [
  {
    title: "Кресло Ostro",
    team: "Мебель",
    stock: 42,
    price: 18900,
    updated: "12 марта",
  },
  {
    title: "Лампа Pillar",
    team: "Свет",
    stock: 7,
    price: 6400,
    updated: "11 марта",
  },
  {
    title: "Стол Grano",
    team: "Мебель",
    stock: 42,
    price: 32500,
    updated: "9 марта",
  },
  {
    title: "Полка Rift",
    team: "Хранение",
    stock: 18,
    price: 11200,
    updated: "9 марта",
  },
  {
    title: "Ковёр Dune",
    team: "Текстиль",
    stock: 7,
    price: 24700,
    updated: "4 марта",
  },
  {
    title: "Торшер Nook",
    team: "Свет",
    stock: 65,
    price: 8300,
    updated: "1 марта",
  },
]

const COLUMNS: { key: Column; numeric?: boolean }[] = [
  { key: "title" },
  { key: "team" },
  { key: "stock", numeric: true },
  { key: "price", numeric: true },
  { key: "updated" },
]

const COLUMN_LABEL: Record<string, string> = {
  title: "Позиция",
  team: "Группа",
  stock: "Остаток",
  price: "Цена",
  updated: "Обновлено",
}

const ARROW = { ascending: "▲", descending: "▼" } as const

function compare(row: Datagrid001Row, other: Datagrid001Row, key: SortKey) {
  const left = row[key.column]
  const right = other[key.column]
  const result =
    typeof left === "number" && typeof right === "number"
      ? left - right
      : String(left).localeCompare(String(right), "ru")
  return key.direction === "descending" ? -result : result
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
 * Сетка с сортировкой по нескольким колонкам сразу: приоритет ключей
 * задаётся порядком кликов и виден цифрой. Один файл, ноль зависимостей.
 */
export function Datagrid001({
  rows = DEFAULT_ROWS,
  caption = "Клик по заголовку добавляет колонку в сортировку, повторный — меняет направление, третий убирает",
  density = "comfortable",
  heading = "Каталог склада",
  columnText = COLUMN_LABEL,
  emptySortText = "Сортировка не задана",
  removeSortLabel = "Убрать сортировку по колонке «{column}»",
  resetText = "Сбросить",
  scrollLabel = "Таблица позиций, прокручивается вбок",
  currency = "₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid001Props) {
  const [keys, setKeys] = useState<SortKey[]>([
    { column: "stock", direction: "descending" },
    { column: "price", direction: "ascending" },
  ])

  const cycle = (column: Column, numeric?: boolean) => {
    setKeys((current) => {
      const found = current.find((key) => key.column === column)

      if (!found) {
        return [
          ...current,
          {
            column,
            direction: numeric
              ? ("descending" as Direction)
              : ("ascending" as Direction),
          },
        ]
      }

      const flipped: Direction =
        found.direction === "ascending" ? "descending" : "ascending"
      const exhausted =
        found.direction === (numeric ? "ascending" : "descending")

      return exhausted
        ? current.filter((key) => key.column !== column)
        : current.map((key) =>
            key.column === column ? { ...key, direction: flipped } : key,
          )
    })
  }

  const sorted = [...rows].sort((row, other) => {
    for (const key of keys) {
      const result = compare(row, other, key)
      if (result !== 0) return result
    }
    return 0
  })

  const label = (column: Column) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-001"
        data-density={density}
        className={className}
        style={palette}
      >
        <Card151 data-part="bar" heading={heading} emptySortText={emptySortText} removeSortLabel={removeSortLabel} resetText={resetText} keys={keys} label={label} setKeys={setKeys} accent={accent} />
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                {COLUMNS.map((column) => {
                  const index = keys.findIndex(
                    (key) => key.column === column.key,
                  )
                  const key = index >= 0 ? keys[index] : undefined

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      data-align={column.numeric ? "end" : undefined}
                      aria-sort={key ? key.direction : "none"}
                    >
                      <button
                        type="button"
                        onClick={() => cycle(column.key, column.numeric)}
                      >
                        {label(column.key)}
                        <span data-part="mark" aria-hidden="true">
                          {keys.length > 1 && key ? (
                            <span data-part="rank">{index + 1}</span>
                          ) : null}
                          {key ? ARROW[key.direction] : "▼"}
                        </span>
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.title}>
                  <th scope="row" data-part="name">
                    {row.title}
                  </th>
                  <td data-part="team">{row.team}</td>
                  <td data-align="end">{row.stock}</td>
                  <td data-align="end">
                    {row.price.toLocaleString("ru-RU")} {currency}
                  </td>
                  <td data-part="team">{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
