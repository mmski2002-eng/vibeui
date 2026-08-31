"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid001Row = {
  title: string
  team: string
  stock: number
  price: number
  updated: string
}

export type Datagrid001Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid001Row[]
  caption?: string
  density?: "comfortable" | "compact"
  accent?: string
}

type Column = keyof Datagrid001Row
type Direction = "ascending" | "descending"
type SortKey = { column: Column; direction: Direction }

// Идея компонента: сортировка не по одной колонке, а стопкой ключей.
// Порядок кликов и есть приоритет, поэтому он показан цифрой в заголовке
// и продублирован фишками в панели — иначе «почему строки стоят так»
// нельзя прочитать глазами. Заголовок остаётся кнопкой с aria-sort.
const STYLES = `
:where([data-vibeui-block="datagrid-001"]){
--vibeui-datagrid-001-bg:oklch(1 0 0);
--vibeui-datagrid-001-fg:oklch(0.24 0.014 265);
--vibeui-datagrid-001-muted:oklch(0.55 0.014 265);
--vibeui-datagrid-001-border:oklch(0.92 0.006 265);
--vibeui-datagrid-001-head:oklch(0.975 0.003 265);
--vibeui-datagrid-001-hover:oklch(0.55 0.02 265 / 6%);
--vibeui-datagrid-001-accent:oklch(0.55 0.2 262);
--vibeui-datagrid-001-accent-soft:oklch(0.55 0.2 262 / 10%);
--vibeui-datagrid-001-radius:0.875rem;
--vibeui-datagrid-001-pad:0.625rem;
--vibeui-datagrid-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-001"]{
box-sizing:border-box;width:100%;max-width:64rem;margin:0 auto;
background:var(--vibeui-datagrid-001-bg);color:var(--vibeui-datagrid-001-fg);
border:1px solid var(--vibeui-datagrid-001-border);
border-radius:var(--vibeui-datagrid-001-radius);
font-family:var(--vibeui-datagrid-001-font);overflow:hidden;
}
[data-vibeui-block="datagrid-001"][data-density="compact"]{--vibeui-datagrid-001-pad:0.375rem}
[data-vibeui-block="datagrid-001"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-001"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-001-border);
}
[data-vibeui-block="datagrid-001"] [data-part="bar-title"]{
margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto;
}
[data-vibeui-block="datagrid-001"] [data-part="chips"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
margin:0;padding:0;list-style:none;
}
[data-vibeui-block="datagrid-001"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:999px;
color:var(--vibeui-datagrid-001-accent);
background:var(--vibeui-datagrid-001-accent-soft);
border:1px solid transparent;
transition:border-color .16s ease;
}
[data-vibeui-block="datagrid-001"] [data-part="chip"]:hover{border-color:var(--vibeui-datagrid-001-accent)}
[data-vibeui-block="datagrid-001"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-datagrid-001-accent);outline-offset:2px}
[data-vibeui-block="datagrid-001"] [data-part="empty-sort"]{
font-size:0.75rem;color:var(--vibeui-datagrid-001-muted);
}
[data-vibeui-block="datagrid-001"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:0.5rem;
background:none;border:1px solid var(--vibeui-datagrid-001-border);
color:var(--vibeui-datagrid-001-muted);
}
[data-vibeui-block="datagrid-001"] [data-part="reset"]:hover:not(:disabled){color:var(--vibeui-datagrid-001-fg)}
[data-vibeui-block="datagrid-001"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-001"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-datagrid-001-accent);outline-offset:2px}
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
color:var(--vibeui-datagrid-001-bg);background:var(--vibeui-datagrid-001-accent);
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

const COLUMNS: { key: Column; title: string; numeric?: boolean }[] = [
  { key: "title", title: "Позиция" },
  { key: "team", title: "Группа" },
  { key: "stock", title: "Остаток", numeric: true },
  { key: "price", title: "Цена", numeric: true },
  { key: "updated", title: "Обновлено" },
]

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
 * Сетка с сортировкой по нескольким колонкам сразу: приоритет ключей
 * задаётся порядком кликов и виден цифрой. Один файл, ноль зависимостей.
 */
export function Datagrid001({
  rows = DEFAULT_ROWS,
  caption = "Клик по заголовку добавляет колонку в сортировку, повторный — меняет направление, третий убирает",
  density = "comfortable",
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

  const palette = {
    ...(accent ? { "--vibeui-datagrid-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-001" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-001"
        data-density={density}
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="bar-title">Каталог склада</h3>
          {keys.length === 0 ? (
            <p data-part="empty-sort">Сортировка не задана</p>
          ) : (
            <ul data-part="chips">
              {keys.map((key, index) => (
                <li key={key.column}>
                  <button
                    type="button"
                    data-part="chip"
                    aria-label={`Убрать сортировку по колонке «${COLUMNS.find((column) => column.key === key.column)?.title}»`}
                    onClick={() =>
                      setKeys((current) =>
                        current.filter((item) => item.column !== key.column),
                      )
                    }
                  >
                    <span aria-hidden="true">{index + 1}</span>
                    {COLUMNS.find((column) => column.key === key.column)?.title}
                    <span aria-hidden="true">{ARROW[key.direction]}</span>
                    <span aria-hidden="true">×</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            data-part="reset"
            disabled={keys.length === 0}
            onClick={() => setKeys([])}
          >
            Сбросить
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица позиций, прокручивается вбок"
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
                        {column.title}
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
                    {row.price.toLocaleString("ru-RU")} ₽
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
