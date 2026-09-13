"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid014Row = {
  id: string
  city: string
  manager: string
  plan: number
  fact: number
  deals: number
  churn: number
  nps: number
}

export type Datagrid014Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid014Row[]
  caption?: string
  maxPinned?: number
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Названия колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Строка панели, когда закреплённых колонок нет. */
  emptyPinText?: string
  /** Счётчик закреплений. {count} и {max} — числа. */
  pinnedTemplate?: string
  /** Подпись кнопки снятия закрепления. */
  clearText?: string
  /** Подпись булавки на закрепление. {column} — название колонки. */
  pinLabel?: string
  /** Подпись булавки на открепление. {column} — название колонки. */
  unpinLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: закрепление колонки — решение читателя, а не вёрстки.
// Кнопка-булавка в каждом заголовке переключает aria-pressed, а колонка
// получает position:sticky со смещением, посчитанным из ширин уже
// закреплённых соседей. Ширины фиксированы через table-layout:fixed —
// без этого смещение слева пришлось бы мерить в браузере.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-014"]){
--vibeui-datagrid-014-bg:transparent;
--vibeui-datagrid-014-fg:light-dark(oklch(0.23 0 285),oklch(0.93 0 285));
--vibeui-datagrid-014-muted:color-mix(in oklab,var(--vibeui-datagrid-014-fg) 68%,transparent);
--vibeui-datagrid-014-border:light-dark(oklch(0.92 0 285),oklch(0.35 0 285));
--vibeui-datagrid-014-head:light-dark(oklch(0.975 0 285),oklch(0.27 0 285));
--vibeui-datagrid-014-accent:light-dark(oklch(0.275 0 0),oklch(0.91 0 0));
--vibeui-datagrid-014-pinbg:light-dark(oklch(0.97 0.02 195),oklch(0.29 0 0));
--vibeui-datagrid-014-shadow:light-dark(oklch(0.23 0 285 / 12%),oklch(0 0 0 / 55%));
--vibeui-datagrid-014-col:11rem;
--vibeui-datagrid-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-datagrid-014-dur-2:180ms;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-014"]{color-scheme:dark}
[data-vibeui-block="datagrid-014"]{
box-sizing:border-box;width:100%;max-width:56rem;margin:0 auto;
background:var(--vibeui-datagrid-014-bg);color:var(--vibeui-datagrid-014-fg);
border:1px solid var(--vibeui-datagrid-014-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-014-font);overflow:hidden;
}
[data-vibeui-block="datagrid-014"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-014"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-014-border);
}
[data-vibeui-block="datagrid-014"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-014"] [data-part="state"]{margin:0;font-size:0.75rem;color:var(--vibeui-datagrid-014-muted)}
[data-vibeui-block="datagrid-014"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-014"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-014-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-014"] table{
border-collapse:separate;border-spacing:0;table-layout:fixed;
width:max-content;min-width:100%;font-size:0.8125rem;
}
[data-vibeui-block="datagrid-014"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-014-muted);caption-side:top;
}
[data-vibeui-block="datagrid-014"] th,
[data-vibeui-block="datagrid-014"] td{
width:var(--vibeui-datagrid-014-col);padding:0.5rem 0.75rem;text-align:left;
border-bottom:1px solid var(--vibeui-datagrid-014-border);
background:var(--vibeui-datagrid-014-bg);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="datagrid-014"] thead th{
background:var(--vibeui-datagrid-014-head);font-weight:600;vertical-align:bottom;
position:sticky;top:0;z-index:2;
}
[data-vibeui-block="datagrid-014"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
/* Закреплённая колонка обязана нести свой фон: иначе уезжающие ячейки видно насквозь. */
[data-vibeui-block="datagrid-014"] [data-pinned="true"]{
position:sticky;left:var(--vibeui-datagrid-014-offset,0);z-index:3;
background:var(--vibeui-datagrid-014-pinbg);
}
[data-vibeui-block="datagrid-014"] thead [data-pinned="true"]{z-index:4}
[data-vibeui-block="datagrid-014"] [data-edge="true"]{box-shadow:6px 0 10px -8px var(--vibeui-datagrid-014-shadow)}
[data-vibeui-block="datagrid-014"] [data-part="head-inner"]{display:flex;align-items:center;gap:0.375rem;justify-content:inherit}
[data-vibeui-block="datagrid-014"] [data-align="end"] [data-part="head-inner"]{justify-content:flex-end}
[data-vibeui-block="datagrid-014"] [data-part="pin"]{
appearance:none;cursor:pointer;font:inherit;line-height:1;flex:none;
width:1.375rem;height:1.375rem;border-radius:0.375rem;
border:1px solid transparent;background:transparent;color:var(--vibeui-datagrid-014-muted);
transition:color var(--vibeui-datagrid-014-dur-2) ease,border-color var(--vibeui-datagrid-014-dur-2) ease;
}
[data-vibeui-block="datagrid-014"] [data-part="pin"]:hover{color:var(--vibeui-datagrid-014-accent)}
[data-vibeui-block="datagrid-014"] [data-part="pin"][aria-pressed="true"]{
color:var(--vibeui-datagrid-014-accent);border-color:var(--vibeui-datagrid-014-accent);
}
[data-vibeui-block="datagrid-014"] [data-part="pin"]:disabled{opacity:.35;cursor:not-allowed}
[data-vibeui-block="datagrid-014"] [data-part="pin"]:focus-visible{outline:2px solid var(--vibeui-datagrid-014-accent);outline-offset:2px}
[data-vibeui-block="datagrid-014"] [data-part="clear"]{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-014-border);
background:transparent;color:var(--vibeui-datagrid-014-fg);
}
[data-vibeui-block="datagrid-014"] [data-part="clear"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-014"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-datagrid-014-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-014"] *{animation:none!important;transition:none!important}}
`

type ColumnKey =
  "city" | "manager" | "plan" | "fact" | "deals" | "churn" | "nps"

const COLUMNS: { key: ColumnKey; numeric: boolean }[] = [
  { key: "city", numeric: false },
  { key: "manager", numeric: false },
  { key: "plan", numeric: true },
  { key: "fact", numeric: true },
  { key: "deals", numeric: true },
  { key: "churn", numeric: true },
  { key: "nps", numeric: true },
]

const COLUMN_TEXT: Record<string, string> = {
  city: "Город",
  manager: "Руководитель",
  plan: "План",
  fact: "Факт",
  deals: "Сделок",
  churn: "Отток, %",
  nps: "NPS",
}

const DEFAULT_ROWS: Datagrid014Row[] = [
  {
    id: "r1",
    city: "Казань",
    manager: "Юсупова",
    plan: 4200,
    fact: 4460,
    deals: 118,
    churn: 4.1,
    nps: 62,
  },
  {
    id: "r2",
    city: "Новосибирск",
    manager: "Ерёмин",
    plan: 3900,
    fact: 3510,
    deals: 96,
    churn: 6.8,
    nps: 48,
  },
  {
    id: "r3",
    city: "Ростов-на-Дону",
    manager: "Ковалёва",
    plan: 3100,
    fact: 3320,
    deals: 87,
    churn: 3.4,
    nps: 71,
  },
  {
    id: "r4",
    city: "Екатеринбург",
    manager: "Тагиров",
    plan: 4600,
    fact: 4180,
    deals: 131,
    churn: 5.2,
    nps: 55,
  },
  {
    id: "r5",
    city: "Калининград",
    manager: "Шмидт",
    plan: 1800,
    fact: 2040,
    deals: 54,
    churn: 2.9,
    nps: 74,
  },
]

function display(row: Datagrid014Row, key: ColumnKey) {
  if (key === "city" || key === "manager") {
    return row[key]
  }

  if (key === "churn") {
    return row.churn.toLocaleString("ru-RU", { minimumFractionDigits: 1 })
  }

  return row[key].toLocaleString("ru-RU")
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
 * Сетка, где закрепить колонку решает читатель: булавка в заголовке
 * переводит столбец в position:sticky. Один файл, ноль зависимостей.
 */
export function Datagrid014({
  rows = DEFAULT_ROWS,
  caption = "Нажмите булавку в заголовке, чтобы закрепить колонку слева",
  maxPinned = 2,
  heading = "Продажи по филиалам",
  columnText = COLUMN_TEXT,
  emptyPinText = "Закреплённых колонок нет",
  pinnedTemplate = "Закреплено: {count} из {max}",
  clearText = "Снять закрепление",
  pinLabel = "Закрепить колонку «{column}» слева",
  unpinLabel = "Открепить колонку «{column}»",
  scrollLabel = "Таблица филиалов, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid014Props) {
  const [pinned, setPinned] = useState<ColumnKey[]>(["city"])

  // Порядок закрепления берётся из порядка колонок, а не из порядка кликов:
  // иначе закреплённые столбцы менялись бы местами прямо под курсором.
  const ordered = COLUMNS.filter((column) => pinned.includes(column.key)).map(
    (column) => column.key,
  )

  const palette = {
    ...(accent ? { "--vibeui-datagrid-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  function offsetFor(key: ColumnKey) {
    const index = ordered.indexOf(key)

    return index < 0
      ? undefined
      : ({
          "--vibeui-datagrid-014-offset": `calc(var(--vibeui-datagrid-014-col) * ${index})`,
        } as CSSProperties)
  }

  return (
    <>
      <style href="vibeui-datagrid-014" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-014"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <p data-part="state" aria-live="polite">
            {ordered.length === 0
              ? emptyPinText
              : pinnedTemplate
                  .replace("{count}", String(ordered.length))
                  .replace("{max}", String(maxPinned))}
          </p>
          <button
            type="button"
            data-part="clear"
            disabled={ordered.length === 0}
            onClick={() => setPinned([])}
          >
            {clearText}
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
                {COLUMNS.map((column) => {
                  const isPinned = ordered.includes(column.key)
                  const isEdge =
                    isPinned && ordered[ordered.length - 1] === column.key
                  const label =
                    columnText[column.key] ?? COLUMN_TEXT[column.key]

                  return (
                    <th
                      key={column.key}
                      scope="col"
                      data-align={column.numeric ? "end" : undefined}
                      data-pinned={isPinned ? "true" : undefined}
                      data-edge={isEdge ? "true" : undefined}
                      style={offsetFor(column.key)}
                    >
                      <span data-part="head-inner">
                        {label}
                        <button
                          type="button"
                          data-part="pin"
                          aria-pressed={isPinned}
                          aria-label={(isPinned
                            ? unpinLabel
                            : pinLabel
                          ).replace("{column}", label)}
                          disabled={!isPinned && ordered.length >= maxPinned}
                          onClick={() =>
                            setPinned((current) =>
                              current.includes(column.key)
                                ? current.filter((key) => key !== column.key)
                                : [...current, column.key],
                            )
                          }
                        >
                          {isPinned ? "◆" : "◇"}
                        </button>
                      </span>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {COLUMNS.map((column) => {
                    const isPinned = ordered.includes(column.key)
                    const isEdge =
                      isPinned && ordered[ordered.length - 1] === column.key
                    const content = display(row, column.key)

                    return column.key === "city" ? (
                      <th
                        key={column.key}
                        scope="row"
                        data-pinned={isPinned ? "true" : undefined}
                        data-edge={isEdge ? "true" : undefined}
                        style={offsetFor(column.key)}
                      >
                        {content}
                      </th>
                    ) : (
                      <td
                        key={column.key}
                        data-align={column.numeric ? "end" : undefined}
                        data-pinned={isPinned ? "true" : undefined}
                        data-edge={isEdge ? "true" : undefined}
                        style={offsetFor(column.key)}
                      >
                        {content}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
