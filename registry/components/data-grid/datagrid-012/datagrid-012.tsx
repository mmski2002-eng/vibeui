"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid012Row = {
  id: string
  campaign: string
  channel: string
  leads: number
  cost: number
}

export type Datagrid012Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid012Row[]
  caption?: string
  rowCount?: number
  accent?: string
}

// Идея компонента: ожидание строк показано скелетоном той же сетки, а не
// крутилкой по центру. Полоски повторяют ширины будущих колонок и слегка
// разной длины — ровные одинаковые прямоугольники читаются как поломка
// вёрстки. Область помечена aria-busy, а рядом лежит текстовый статус:
// анимация ничего не сообщает скринридеру.
const STYLES = `
:where([data-vibeui-block="datagrid-012"]){
--vibeui-datagrid-012-bg:oklch(1 0 0);
--vibeui-datagrid-012-fg:oklch(0.23 0.014 145);
--vibeui-datagrid-012-muted:oklch(0.55 0.014 145);
--vibeui-datagrid-012-border:oklch(0.92 0.006 145);
--vibeui-datagrid-012-head:oklch(0.975 0.003 145);
--vibeui-datagrid-012-bone:oklch(0.93 0.006 145);
--vibeui-datagrid-012-shine:oklch(0.975 0.004 145);
--vibeui-datagrid-012-accent:oklch(0.5 0.13 150);
--vibeui-datagrid-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-012"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-012-bg);color:var(--vibeui-datagrid-012-fg);
border:1px solid var(--vibeui-datagrid-012-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-012-font);overflow:hidden;
}
[data-vibeui-block="datagrid-012"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-012"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-012-border);
}
[data-vibeui-block="datagrid-012"] [data-part="bar-text"]{margin-inline-end:auto}
[data-vibeui-block="datagrid-012"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650}
[data-vibeui-block="datagrid-012"] [data-part="status"]{
margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-012-muted);
}
[data-vibeui-block="datagrid-012"] [data-part="bar"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-012-border);
background:var(--vibeui-datagrid-012-bg);color:var(--vibeui-datagrid-012-fg);
}
[data-vibeui-block="datagrid-012"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-012-accent);outline-offset:2px}
[data-vibeui-block="datagrid-012"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-012"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-012-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-012"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-012"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-012-muted);
}
[data-vibeui-block="datagrid-012"] th,
[data-vibeui-block="datagrid-012"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-012-border);
}
[data-vibeui-block="datagrid-012"] thead th{background:var(--vibeui-datagrid-012-head);font-weight:600}
[data-vibeui-block="datagrid-012"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-012"] [data-part="muted"]{color:var(--vibeui-datagrid-012-muted)}
/* Полоска скелетона: ширина приходит переменной, поэтому строки не
   выглядят напечатанными под копирку. */
[data-vibeui-block="datagrid-012"] [data-part="bone"]{
display:block;height:0.6875rem;border-radius:0.25rem;
width:var(--vibeui-datagrid-012-w,60%);
background:linear-gradient(
90deg,
var(--vibeui-datagrid-012-bone) 0%,
var(--vibeui-datagrid-012-shine) 50%,
var(--vibeui-datagrid-012-bone) 100%);
background-size:220% 100%;
animation:vibeui-datagrid-012-shine 1.5s linear infinite;
}
[data-vibeui-block="datagrid-012"] td[data-align="end"] [data-part="bone"]{margin-inline-start:auto}
@keyframes vibeui-datagrid-012-shine{
from{background-position:120% 0}
to{background-position:-120% 0}
}
[data-vibeui-block="datagrid-012"] tfoot td{background:var(--vibeui-datagrid-012-head);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid012Row[] = [
  {
    id: "k1",
    campaign: "Весенняя витрина",
    channel: "Поиск",
    leads: 412,
    cost: 184000,
  },
  {
    id: "k2",
    campaign: "Ретаргет корзины",
    channel: "Соцсети",
    leads: 268,
    cost: 96500,
  },
  {
    id: "k3",
    campaign: "Каталог мебели",
    channel: "Поиск",
    leads: 195,
    cost: 74200,
  },
  {
    id: "k4",
    campaign: "Рассылка «Новинки»",
    channel: "Почта",
    leads: 143,
    cost: 12800,
  },
  {
    id: "k5",
    campaign: "Партнёрские обзоры",
    channel: "Медиа",
    leads: 88,
    cost: 58000,
  },
  {
    id: "k6",
    campaign: "Локальная реклама",
    channel: "Карты",
    leads: 61,
    cost: 23400,
  },
]

const BONES = [78, 52, 46, 38]

/**
 * Сетка со скелетоном загрузки строк: полоски повторяют раскладку колонок,
 * область помечена aria-busy. Один файл, ноль зависимостей.
 */
export function Datagrid012({
  rows = DEFAULT_ROWS,
  caption = "Кампании за март",
  rowCount = 6,
  accent,
  className,
  style,
  ...props
}: Datagrid012Props) {
  const [loading, setLoading] = useState(true)

  const leads = rows.reduce((sum, row) => sum + row.leads, 0)
  const cost = rows.reduce((sum, row) => sum + row.cost, 0)

  const palette = {
    ...(accent ? { "--vibeui-datagrid-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-012"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <div data-part="bar-text">
            <h3 data-part="title">Кампании</h3>
            <p data-part="status" role="status">
              {loading ? "Загружаем строки…" : `Готово, строк: ${rows.length}`}
            </p>
          </div>
          <button type="button" onClick={() => setLoading(!loading)}>
            {loading ? "Показать данные" : "Показать загрузку"}
          </button>
        </div>
        <div
          data-part="scroll"
          role="region"
          aria-label="Таблица кампаний, прокручивается вбок"
          aria-busy={loading}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">Кампания</th>
                <th scope="col">Канал</th>
                <th scope="col" data-align="end">
                  Лиды
                </th>
                <th scope="col" data-align="end">
                  Расход
                </th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: rowCount }, (_, row) => (
                    <tr key={`bone-${row}`}>
                      {BONES.map((base, column) => (
                        <td
                          key={column}
                          data-align={column > 1 ? "end" : undefined}
                        >
                          <span
                            data-part="bone"
                            style={
                              {
                                "--vibeui-datagrid-012-w": `${base - ((row * 11) % 17)}%`,
                              } as CSSProperties
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((row) => (
                    <tr key={row.id}>
                      <th scope="row">{row.campaign}</th>
                      <td data-part="muted">{row.channel}</td>
                      <td data-align="end">{row.leads}</td>
                      <td data-align="end">
                        {row.cost.toLocaleString("ru-RU")} ₽
                      </td>
                    </tr>
                  ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Всего лидов</td>
                <td data-align="end">{loading ? "—" : leads}</td>
                <td data-align="end">
                  {loading ? "—" : `${cost.toLocaleString("ru-RU")} ₽`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
