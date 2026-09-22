"use client"

import { useState } from "react"
import { Card162 } from "@/registry/components/card/card-162/card-162"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid012Row = {
  id: string
  campaign: string
  channel: string
  leads: number
  cost: number
}

export type Datagrid012Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid012Row[]
  caption?: string
  rowCount?: number
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Статус во время загрузки. */
  loadingText?: string
  /** Статус после загрузки. {count} — число строк. */
  readyText?: string
  /** Подпись кнопки, показывающей данные. */
  showDataLabel?: string
  /** Подпись кнопки, показывающей скелетон. */
  showLoadingLabel?: string
  /** Названия колонок: campaign, channel, leads, cost. */
  columnText?: Record<string, string>
  /** Подпись итоговой строки. */
  totalLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Знак валюты в расходах. */
  currency?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ожидание строк показано скелетоном той же сетки, а не
// крутилкой по центру. Полоски повторяют ширины будущих колонок и слегка
// разной длины — ровные одинаковые прямоугольники читаются как поломка
// вёрстки. Область помечена aria-busy, а рядом лежит текстовый статус:
// анимация ничего не сообщает скринридеру.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-012"]){
--vibeui-datagrid-012-bg:transparent;
--vibeui-datagrid-012-fg:light-dark(oklch(0.23 0.014 145),oklch(0.93 0.006 145));
--vibeui-datagrid-012-muted:color-mix(in oklab,var(--vibeui-datagrid-012-fg) 68%,transparent);
--vibeui-datagrid-012-border:light-dark(oklch(0.92 0.006 145),oklch(0.34 0.012 145));
--vibeui-datagrid-012-head:light-dark(oklch(0.975 0.003 145),oklch(0.27 0.012 145));
--vibeui-datagrid-012-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 145));
--vibeui-datagrid-012-bone:light-dark(oklch(0.93 0.006 145),oklch(0.32 0.012 145));
--vibeui-datagrid-012-shine:light-dark(oklch(0.975 0.004 145),oklch(0.4 0.014 145));
--vibeui-datagrid-012-accent:light-dark(oklch(0.275 0 0),oklch(0.906 0 0));
--vibeui-datagrid-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-012"]{color-scheme:dark}
[data-vibeui-block="datagrid-012"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-012-bg);color:var(--vibeui-datagrid-012-fg);
border:1px solid var(--vibeui-datagrid-012-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-012-font);overflow:hidden;
}
[data-vibeui-block="datagrid-012"] *{box-sizing:border-box}
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

const COLUMN_LABEL: Record<string, string> = {
  campaign: "Кампания",
  channel: "Канал",
  leads: "Лиды",
  cost: "Расход",
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
 * Сетка со скелетоном загрузки строк: полоски повторяют раскладку колонок,
 * область помечена aria-busy. Один файл, ноль зависимостей.
 */
export function Datagrid012({
  rows = DEFAULT_ROWS,
  caption = "Кампании за март",
  rowCount = 6,
  heading = "Кампании",
  loadingText = "Загружаем строки…",
  readyText = "Готово, строк: {count}",
  showDataLabel = "Показать данные",
  showLoadingLabel = "Показать загрузку",
  columnText = COLUMN_LABEL,
  totalLabel = "Всего лидов",
  scrollLabel = "Таблица кампаний, прокручивается вбок",
  currency = "₽",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid012Props) {
  const [loading, setLoading] = useState(true)

  const leads = rows.reduce((sum, row) => sum + row.leads, 0)
  const cost = rows.reduce((sum, row) => sum + row.cost, 0)
  const money = (value: number) =>
    `${value.toLocaleString("ru-RU")} ${currency}`
  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-012"
        className={className}
        style={palette}
      >
        <Card162 data-part="bar" heading={heading} loadingText={loadingText} readyText={readyText} rows={rows} showDataLabel={showDataLabel} showLoadingLabel={showLoadingLabel} loading={loading} setLoading={setLoading} accent={accent} />
        <div
          data-part="scroll"
          role="region"
          aria-label={scrollLabel}
          aria-busy={loading}
          tabIndex={0}
        >
          <table>
            <caption>{caption}</caption>
            <thead>
              <tr>
                <th scope="col">{label("campaign")}</th>
                <th scope="col">{label("channel")}</th>
                <th scope="col" data-align="end">
                  {label("leads")}
                </th>
                <th scope="col" data-align="end">
                  {label("cost")}
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
                      <td data-align="end">{money(row.cost)}</td>
                    </tr>
                  ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>{totalLabel}</td>
                <td data-align="end">{loading ? "—" : leads}</td>
                <td data-align="end">{loading ? "—" : money(cost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
