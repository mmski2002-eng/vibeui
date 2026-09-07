"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid007Row = {
  group: string
  task: string
  owner: string
  hours: number
}

export type Datagrid007Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid007Row[]
  caption?: string
  startCollapsed?: boolean
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Подпись кнопки «свернуть все». */
  collapseAllLabel?: string
  /** Подпись кнопки «развернуть все». */
  expandAllLabel?: string
  /** Названия колонок: task, owner, hours. */
  columnText?: Record<string, string>
  /** Число задач в группе. {count} подставляется. */
  groupCountText?: string
  /** Часы с единицей измерения. {hours} подставляется. */
  hoursText?: string
  /** Подпись итоговой строки. */
  totalLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строки собраны в группы, у каждой группы своя строка-
// заголовок с итогом и кнопкой сворачивания. Итог считается по группе, а не
// подписывается руками, поэтому свёрнутая группа не теряет смысла. Кнопка
// несёт aria-expanded, а сама строка группы остаётся строкой таблицы —
// разметка не рассыпается на вложенные таблицы.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-007"]){
--vibeui-datagrid-007-bg:transparent;
--vibeui-datagrid-007-fg:light-dark(oklch(0.23 0 300),oklch(0.93 0 300));
--vibeui-datagrid-007-muted:color-mix(in oklab,var(--vibeui-datagrid-007-fg) 68%,transparent);
--vibeui-datagrid-007-border:light-dark(oklch(0.92 0 300),oklch(0.34 0 300));
--vibeui-datagrid-007-head:light-dark(oklch(0.975 0 300),oklch(0.27 0 300));
--vibeui-datagrid-007-group:light-dark(oklch(0.955 0 300),oklch(0.3 0 300));
--vibeui-datagrid-007-field:light-dark(oklch(1 0 0),oklch(0.22 0 300));
--vibeui-datagrid-007-accent:light-dark(oklch(0.5 0.16 39.8),oklch(0.76 0.14 39.8));
--vibeui-datagrid-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-007"]{color-scheme:dark}
[data-vibeui-block="datagrid-007"]{
box-sizing:border-box;width:100%;max-width:50rem;margin:0 auto;
background:var(--vibeui-datagrid-007-bg);color:var(--vibeui-datagrid-007-fg);
border:1px solid var(--vibeui-datagrid-007-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-007-font);overflow:hidden;
}
[data-vibeui-block="datagrid-007"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-007"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-007-border);
}
[data-vibeui-block="datagrid-007"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-007"] [data-part="bar"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-007-border);
background:var(--vibeui-datagrid-007-field);color:var(--vibeui-datagrid-007-fg);
}
[data-vibeui-block="datagrid-007"] [data-part="bar"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-007-accent);outline-offset:2px}
[data-vibeui-block="datagrid-007"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-007"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-007-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-007"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-007"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-007-muted);
}
[data-vibeui-block="datagrid-007"] th,
[data-vibeui-block="datagrid-007"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-007-border);
}
[data-vibeui-block="datagrid-007"] thead th{background:var(--vibeui-datagrid-007-head);font-weight:600}
[data-vibeui-block="datagrid-007"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-007"] [data-part="group-cell"]{padding:0;background:var(--vibeui-datagrid-007-group)}
[data-vibeui-block="datagrid-007"] [data-part="group"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
appearance:none;border:0;background:none;cursor:pointer;font:inherit;font-weight:650;
padding:0.5rem 0.875rem;color:inherit;text-align:left;
}
[data-vibeui-block="datagrid-007"] [data-part="group"]:focus-visible{outline:2px solid var(--vibeui-datagrid-007-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-007"] [data-part="caret"]{
color:var(--vibeui-datagrid-007-accent);font-size:0.625rem;
transition:transform .16s ease;transform:rotate(90deg);
}
[data-vibeui-block="datagrid-007"] [data-part="group"][aria-expanded="false"] [data-part="caret"]{transform:rotate(0deg)}
[data-vibeui-block="datagrid-007"] [data-part="count"]{
font-weight:500;font-size:0.75rem;color:var(--vibeui-datagrid-007-muted);
}
[data-vibeui-block="datagrid-007"] [data-part="sum"]{
margin-inline-start:auto;font-variant-numeric:tabular-nums;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-007"] [data-part="task"]{padding-left:2.25rem;font-weight:500}
[data-vibeui-block="datagrid-007"] [data-part="owner"]{color:var(--vibeui-datagrid-007-muted)}
[data-vibeui-block="datagrid-007"] tfoot td{background:var(--vibeui-datagrid-007-head);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid007Row[] = [
  { group: "Дизайн", task: "Макет каталога", owner: "Орлова", hours: 14 },
  { group: "Дизайн", task: "Иконки статусов", owner: "Ким", hours: 6 },
  { group: "Дизайн", task: "Ревизия типографики", owner: "Орлова", hours: 4 },
  { group: "Разработка", task: "Сетка заказов", owner: "Гнедин", hours: 22 },
  { group: "Разработка", task: "Фильтры в шапке", owner: "Савва", hours: 11 },
  { group: "Разработка", task: "Экспорт CSV", owner: "Гнедин", hours: 8 },
  { group: "Аналитика", task: "Отчёт по воронке", owner: "Лебедь", hours: 9 },
  { group: "Аналитика", task: "Разметка событий", owner: "Лебедь", hours: 5 },
]

const COLUMN_LABEL: Record<string, string> = {
  task: "Задача",
  owner: "Исполнитель",
  hours: "Часы",
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
 * Сетка с группировкой строк: у каждой группы строка-заголовок с итогом
 * и сворачиванием. Один файл, ноль зависимостей, собственная палитра.
 */
export function Datagrid007({
  rows = DEFAULT_ROWS,
  caption = "Часы по задачам, сгруппированные по направлению",
  startCollapsed = false,
  heading = "Трудозатраты, спринт 14",
  collapseAllLabel = "Свернуть все",
  expandAllLabel = "Развернуть все",
  columnText = COLUMN_LABEL,
  groupCountText = "{count} задач",
  hoursText = "{hours} ч",
  totalLabel = "Всего по спринту",
  scrollLabel = "Таблица трудозатрат, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid007Props) {
  const names = rows
    .map((row) => row.group)
    .filter((group, index, all) => all.indexOf(group) === index)

  const [closed, setClosed] = useState<string[]>(startCollapsed ? names : [])

  const total = rows.reduce((sum, row) => sum + row.hours, 0)

  const toggle = (group: string) =>
    setClosed((current) =>
      current.includes(group)
        ? current.filter((value) => value !== group)
        : [...current, group],
    )

  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]
  const hours = (value: number) => hoursText.replace("{hours}", String(value))

  const palette = {
    ...(accent ? { "--vibeui-datagrid-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-007" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-007"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <button type="button" onClick={() => setClosed(names)}>
            {collapseAllLabel}
          </button>
          <button type="button" onClick={() => setClosed([])}>
            {expandAllLabel}
          </button>
        </div>
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
                <th scope="col">{label("task")}</th>
                <th scope="col">{label("owner")}</th>
                <th scope="col" data-align="end">
                  {label("hours")}
                </th>
              </tr>
            </thead>
            {names.map((group) => {
              const items = rows.filter((row) => row.group === group)
              const open = !closed.includes(group)
              const sum = items.reduce((value, row) => value + row.hours, 0)

              return (
                <tbody key={group}>
                  <tr>
                    <th scope="colgroup" colSpan={3} data-part="group-cell">
                      <button
                        type="button"
                        data-part="group"
                        aria-expanded={open}
                        onClick={() => toggle(group)}
                      >
                        <span data-part="caret" aria-hidden="true">
                          ▶
                        </span>
                        {group}
                        <span data-part="count">
                          {groupCountText.replace(
                            "{count}",
                            String(items.length),
                          )}
                        </span>
                        <span data-part="sum">{hours(sum)}</span>
                      </button>
                    </th>
                  </tr>
                  {open
                    ? items.map((row) => (
                        <tr key={row.task}>
                          <th scope="row" data-part="task">
                            {row.task}
                          </th>
                          <td data-part="owner">{row.owner}</td>
                          <td data-align="end">{row.hours}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              )
            })}
            <tfoot>
              <tr>
                <td colSpan={2}>{totalLabel}</td>
                <td data-align="end">{hours(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
