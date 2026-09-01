"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid006Row = {
  id: string
  client: string
  status: "Новый" | "В работе" | "Оплачен" | "Отменён"
  amount: number
}

export type Datagrid006Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid006Row[]
  caption?: string
  placeholder?: string
  accent?: string
}

// Идея компонента: фильтр живёт в шапке своей колонки, а не в общей строке
// поиска. Второй ряд шапки — это ряд полей: текст для строковых колонок,
// список для перечисления. Так видно, какой фильтр к чему относится, и
// не нужно гадать, что ищет одно поле «Поиск» на всю таблицу. Счётчик
// найденного объявлен aria-live: без него правка фильтра для скринридера
// проходит бесследно.
const STYLES = `
:where([data-vibeui-block="datagrid-006"]){
--vibeui-datagrid-006-bg:oklch(1 0 0);
--vibeui-datagrid-006-fg:oklch(0.23 0.014 285);
--vibeui-datagrid-006-muted:oklch(0.55 0.014 285);
--vibeui-datagrid-006-border:oklch(0.92 0.006 285);
--vibeui-datagrid-006-head:oklch(0.975 0.003 285);
--vibeui-datagrid-006-accent:oklch(0.52 0.16 275);
--vibeui-datagrid-006-ok:oklch(0.52 0.13 155);
--vibeui-datagrid-006-warn:oklch(0.6 0.14 75);
--vibeui-datagrid-006-off:oklch(0.58 0.02 285);
--vibeui-datagrid-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-006"]{
box-sizing:border-box;width:100%;max-width:54rem;margin:0 auto;
background:var(--vibeui-datagrid-006-bg);color:var(--vibeui-datagrid-006-fg);
border:1px solid var(--vibeui-datagrid-006-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-006-font);overflow:hidden;
}
[data-vibeui-block="datagrid-006"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-006"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-006-border);
}
[data-vibeui-block="datagrid-006"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-006"] [data-part="found"]{
margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-006-muted);
}
[data-vibeui-block="datagrid-006"] [data-part="reset"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-006-border);
background:var(--vibeui-datagrid-006-bg);color:var(--vibeui-datagrid-006-fg);
}
[data-vibeui-block="datagrid-006"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-006"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-datagrid-006-accent);outline-offset:2px}
[data-vibeui-block="datagrid-006"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-006"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-006-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-006"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-006"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-006-muted);
}
[data-vibeui-block="datagrid-006"] th,
[data-vibeui-block="datagrid-006"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-006-border);
}
[data-vibeui-block="datagrid-006"] thead th{background:var(--vibeui-datagrid-006-head);font-weight:600}
/* Ряд фильтров — часть шапки: поле стоит ровно под своей колонкой. */
[data-vibeui-block="datagrid-006"] [data-part="filters"] td{
background:var(--vibeui-datagrid-006-head);padding:0 0.875rem 0.5rem;border-top:0;
}
[data-vibeui-block="datagrid-006"] [data-part="filters"] input,
[data-vibeui-block="datagrid-006"] [data-part="filters"] select{
width:100%;min-width:6rem;font:inherit;font-size:0.75rem;color:inherit;
padding:0.25rem 0.5rem;margin:0;
border:1px solid var(--vibeui-datagrid-006-border);border-radius:0.375rem;
background:var(--vibeui-datagrid-006-bg);
}
[data-vibeui-block="datagrid-006"] [data-part="filters"] input:focus-visible,
[data-vibeui-block="datagrid-006"] [data-part="filters"] select:focus-visible{
outline:2px solid var(--vibeui-datagrid-006-accent);outline-offset:1px;
}
[data-vibeui-block="datagrid-006"] [data-part="filters"] [data-empty="true"]{color:var(--vibeui-datagrid-006-muted);font-size:0.75rem}
[data-vibeui-block="datagrid-006"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-006"] [data-part="id"]{
font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.75rem;font-weight:500;
}
[data-vibeui-block="datagrid-006"] [data-part="tag"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;
}
[data-vibeui-block="datagrid-006"] [data-part="tag"]::before{
content:"";width:0.4375rem;height:0.4375rem;border-radius:999px;background:currentColor;
}
[data-vibeui-block="datagrid-006"] [data-tone="ok"]{color:var(--vibeui-datagrid-006-ok)}
[data-vibeui-block="datagrid-006"] [data-tone="warn"]{color:var(--vibeui-datagrid-006-warn)}
[data-vibeui-block="datagrid-006"] [data-tone="new"]{color:var(--vibeui-datagrid-006-accent)}
[data-vibeui-block="datagrid-006"] [data-tone="off"]{color:var(--vibeui-datagrid-006-off)}
[data-vibeui-block="datagrid-006"] [data-part="none"]{
padding:1.5rem 0.875rem;text-align:center;color:var(--vibeui-datagrid-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid006Row[] = [
  { id: "ORD-8801", client: "Атлас", status: "Оплачен", amount: 96000 },
  { id: "ORD-8802", client: "Берег", status: "Новый", amount: 12500 },
  { id: "ORD-8803", client: "Ветка", status: "В работе", amount: 72000 },
  { id: "ORD-8804", client: "Гранат", status: "Оплачен", amount: 310000 },
  { id: "ORD-8805", client: "Дельта", status: "Отменён", amount: 7500 },
  { id: "ORD-8806", client: "Ёлка", status: "В работе", amount: 48000 },
  { id: "ORD-8807", client: "Атлас", status: "Новый", amount: 21400 },
]

const STATUSES = ["Новый", "В работе", "Оплачен", "Отменён"] as const

const TONES: Record<Datagrid006Row["status"], string> = {
  Новый: "new",
  "В работе": "warn",
  Оплачен: "ok",
  Отменён: "off",
}

/**
 * Сетка с фильтром в шапке каждой колонки: текстовые поля и список
 * статусов стоят под своими заголовками. Один файл, ноль зависимостей.
 */
export function Datagrid006({
  rows = DEFAULT_ROWS,
  caption = "Фильтры стоят в шапке: каждое поле относится к своей колонке",
  placeholder = "Начните вводить",
  accent,
  className,
  style,
  ...props
}: Datagrid006Props) {
  const [order, setOrder] = useState("")
  const [client, setClient] = useState("")
  const [status, setStatus] = useState("")

  const filtered = rows.filter(
    (row) =>
      row.id.toLowerCase().includes(order.trim().toLowerCase()) &&
      row.client.toLowerCase().includes(client.trim().toLowerCase()) &&
      (status === "" || row.status === status),
  )

  const active = order !== "" || client !== "" || status !== ""

  const palette = {
    ...(accent ? { "--vibeui-datagrid-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-006"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">Заказы</h3>
          <p data-part="found" aria-live="polite">
            Найдено {filtered.length} из {rows.length}
          </p>
          <button
            type="button"
            data-part="reset"
            disabled={!active}
            onClick={() => {
              setOrder("")
              setClient("")
              setStatus("")
            }}
          >
            Сбросить фильтры
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица заказов, прокручивается вбок"
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Заказ</th>
                <th scope="col">Клиент</th>
                <th scope="col">Статус</th>
                <th scope="col" data-align="end">
                  Сумма
                </th>
              </tr>
              <tr data-part="filters">
                <td>
                  <input
                    type="search"
                    value={order}
                    placeholder={placeholder}
                    aria-label="Фильтр по номеру заказа"
                    onChange={(event) => setOrder(event.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="search"
                    value={client}
                    placeholder={placeholder}
                    aria-label="Фильтр по клиенту"
                    onChange={(event) => setClient(event.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={status}
                    aria-label="Фильтр по статусу"
                    onChange={(event) => setStatus(event.target.value)}
                  >
                    <option value="">Любой статус</option>
                    {STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </td>
                <td data-align="end">
                  <span data-empty="true">без фильтра</span>
                </td>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <th scope="row" data-part="id">
                    {row.id}
                  </th>
                  <td>{row.client}</td>
                  <td>
                    <span data-part="tag" data-tone={TONES[row.status]}>
                      {row.status}
                    </span>
                  </td>
                  <td data-align="end">
                    {row.amount.toLocaleString("ru-RU")} ₽
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="none">
                    Под фильтры не подошла ни одна строка
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
