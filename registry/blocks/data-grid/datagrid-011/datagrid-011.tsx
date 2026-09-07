"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Datagrid011Row = {
  id: string
  request: string
  city: string
  status: "Новая" | "В работе" | "Архив"
  score: number
}

export type Datagrid011Props = Omit<ComponentProps<"section">, "children"> & {
  rows?: Datagrid011Row[]
  caption?: string
  emptyTitle?: string
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Подписи фильтров по их идентификатору. */
  filterText?: Record<string, string>
  /** Подпись фишки. {filter} — название фильтра. */
  removeFilterLabel?: string
  /** Подпись кнопки сброса в панели. */
  resetAllLabel?: string
  /** Названия колонок: request, city, status, score. */
  columnText?: Record<string, string>
  /** Подписи статусов: ключ — значение из строки. */
  statusText?: Record<string, string>
  /** Объяснение пустого результата. {filters} — список фильтров. */
  emptyText?: string
  /** Подпись главной кнопки пустого состояния. */
  emptyResetLabel?: string
  /** Подпись второй кнопки пустого состояния. */
  emptyCreateLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пустое состояние как часть сетки, а не отдельная
// заглушка. Оно показано ровно тогда, когда фильтры сошлись в ноль, и
// называет причину — какие именно фильтры стоят, — а рядом даёт выход:
// снять один фильтр или сбросить все. Шапка таблицы остаётся на месте,
// поэтому не создаётся впечатление, что таблица пропала.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-011"]){
--vibeui-datagrid-011-bg:transparent;
--vibeui-datagrid-011-fg:light-dark(oklch(0.23 0.014 210),oklch(0.93 0.006 210));
--vibeui-datagrid-011-muted:color-mix(in oklab,var(--vibeui-datagrid-011-fg) 68%,transparent);
--vibeui-datagrid-011-border:light-dark(oklch(0.92 0.006 210),oklch(0.34 0.012 210));
--vibeui-datagrid-011-head:light-dark(oklch(0.975 0.003 210),oklch(0.27 0.012 210));
--vibeui-datagrid-011-field:light-dark(oklch(1 0 0),oklch(0.22 0.012 210));
--vibeui-datagrid-011-accent:light-dark(oklch(0.52 0.13 39.8),oklch(0.78 0.12 39.8));
--vibeui-datagrid-011-accent-soft:light-dark(oklch(0.52 0.13 39.8 / 10%),oklch(0.78 0.12 39.8 / 18%));
--vibeui-datagrid-011-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.02 210));
--vibeui-datagrid-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="datagrid-011"]{color-scheme:dark}
[data-vibeui-block="datagrid-011"]{
box-sizing:border-box;width:100%;max-width:48rem;margin:0 auto;
background:var(--vibeui-datagrid-011-bg);color:var(--vibeui-datagrid-011-fg);
border:1px solid var(--vibeui-datagrid-011-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-011-font);overflow:hidden;
}
[data-vibeui-block="datagrid-011"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-011"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.375rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-011-border);
}
[data-vibeui-block="datagrid-011"] [data-part="title"]{
margin:0 0.5rem 0 0;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="datagrid-011"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.375rem;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.25rem 0.5rem;border-radius:999px;
color:var(--vibeui-datagrid-011-accent);background:var(--vibeui-datagrid-011-accent-soft);
border:1px solid transparent;
}
[data-vibeui-block="datagrid-011"] [data-part="chip"]:hover{border-color:var(--vibeui-datagrid-011-accent)}
[data-vibeui-block="datagrid-011"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:2px}
[data-vibeui-block="datagrid-011"] [data-part="reset"]{
margin-inline-start:auto;
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;
padding:0.3125rem 0.625rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-011-border);
background:var(--vibeui-datagrid-011-field);color:var(--vibeui-datagrid-011-fg);
}
[data-vibeui-block="datagrid-011"] [data-part="reset"]:disabled{opacity:.45;cursor:not-allowed}
[data-vibeui-block="datagrid-011"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:2px}
[data-vibeui-block="datagrid-011"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-011"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-011"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-011"] caption{
padding:0 0.875rem 0.625rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-datagrid-011-muted);
}
[data-vibeui-block="datagrid-011"] th,
[data-vibeui-block="datagrid-011"] td{
padding:0.4375rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-011-border);
}
[data-vibeui-block="datagrid-011"] thead th{background:var(--vibeui-datagrid-011-head);font-weight:600}
[data-vibeui-block="datagrid-011"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-011"] [data-part="muted"]{color:var(--vibeui-datagrid-011-muted)}
[data-vibeui-block="datagrid-011"] [data-part="empty-cell"]{padding:0}
[data-vibeui-block="datagrid-011"] [data-part="empty"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
padding:2rem 1.25rem;text-align:center;white-space:normal;
}
/* Значок нарисован рамками: одна лишняя картинка сломала бы обещание
   «компонент — это один файл без ресурсов». */
[data-vibeui-block="datagrid-011"] [data-part="glyph"]{
position:relative;width:2.5rem;height:2.5rem;border-radius:999px;
border:2px dashed var(--vibeui-datagrid-011-border);
}
[data-vibeui-block="datagrid-011"] [data-part="glyph"]::after{
content:"";position:absolute;left:50%;top:50%;
width:1rem;height:2px;border-radius:1px;
background:var(--vibeui-datagrid-011-border);transform:translate(-50%,-50%);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-title"]{margin:0;font-size:0.9375rem;font-weight:650}
[data-vibeui-block="datagrid-011"] [data-part="empty-text"]{
margin:0;max-width:26rem;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-datagrid-011-muted);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"]{display:flex;flex-wrap:wrap;gap:0.375rem;margin-top:0.25rem}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"] button{
appearance:none;cursor:pointer;font:inherit;font-size:0.75rem;font-weight:550;
padding:0.375rem 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-datagrid-011-border);
background:var(--vibeui-datagrid-011-field);color:var(--vibeui-datagrid-011-fg);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"] button[data-tone="primary"]{
border-color:transparent;background:var(--vibeui-datagrid-011-accent);color:var(--vibeui-datagrid-011-on-accent);
}
[data-vibeui-block="datagrid-011"] [data-part="empty-actions"] button:focus-visible{outline:2px solid var(--vibeui-datagrid-011-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid011Row[] = [
  {
    id: "r1",
    request: "Замена ручек",
    city: "Москва",
    status: "В работе",
    score: 74,
  },
  {
    id: "r2",
    request: "Доставка витрины",
    city: "Казань",
    status: "Новая",
    score: 91,
  },
  {
    id: "r3",
    request: "Ремонт полки",
    city: "Сочи",
    status: "В работе",
    score: 63,
  },
  {
    id: "r4",
    request: "Возврат ковра",
    city: "Москва",
    status: "Архив",
    score: 88,
  },
  {
    id: "r5",
    request: "Сборка стола",
    city: "Сочи",
    status: "Новая",
    score: 79,
  },
  {
    id: "r6",
    request: "Замер кухни",
    city: "Петербург",
    status: "Архив",
    score: 95,
  },
]

const FILTERS: {
  id: string
  test: (row: Datagrid011Row) => boolean
}[] = [
  { id: "status", test: (row) => row.status === "Архив" },
  { id: "city", test: (row) => row.city === "Сочи" },
  { id: "score", test: (row) => row.score >= 90 },
]

const FILTER_LABEL: Record<string, string> = {
  status: "Статус: архив",
  city: "Город: Сочи",
  score: "Оценка от 90",
}

const COLUMN_LABEL: Record<string, string> = {
  request: "Заявка",
  city: "Город",
  status: "Статус",
  score: "Оценка",
}

const STATUS_LABEL: Record<string, string> = {
  Новая: "Новая",
  "В работе": "В работе",
  Архив: "Архив",
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
 * Сетка с пустым состоянием: когда фильтры сошлись в ноль, тело таблицы
 * объясняет причину и предлагает сбросить фильтры. Один файл.
 */
export function Datagrid011({
  rows = DEFAULT_ROWS,
  caption = "Заявки сервисной службы",
  emptyTitle = "Ни одной заявки не подошло",
  heading = "Заявки",
  filterText = FILTER_LABEL,
  removeFilterLabel = "Снять фильтр «{filter}»",
  resetAllLabel = "Сбросить всё",
  columnText = COLUMN_LABEL,
  statusText = STATUS_LABEL,
  emptyText = "Одновременно стоят фильтры: {filters}. Снимите один из них или сбросьте все — данные никуда не делись.",
  emptyResetLabel = "Сбросить фильтры",
  emptyCreateLabel = "Создать заявку",
  scrollLabel = "Таблица заявок, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid011Props) {
  const [active, setActive] = useState<string[]>(FILTERS.map((one) => one.id))

  const applied = FILTERS.filter((one) => active.includes(one.id))
  const visible = rows.filter((row) => applied.every((one) => one.test(row)))

  const filterLabel = (id: string) => filterText[id] ?? FILTER_LABEL[id]
  const label = (column: string) => columnText[column] ?? COLUMN_LABEL[column]

  const palette = {
    ...(accent ? { "--vibeui-datagrid-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-011" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="data-grid"
        data-vibeui-block="datagrid-011"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          {applied.map((one) => (
            <button
              key={one.id}
              type="button"
              data-part="chip"
              aria-label={removeFilterLabel.replace(
                "{filter}",
                filterLabel(one.id),
              )}
              onClick={() =>
                setActive((current) =>
                  current.filter((value) => value !== one.id),
                )
              }
            >
              {filterLabel(one.id)}
              <span aria-hidden="true">×</span>
            </button>
          ))}
          <button
            type="button"
            data-part="reset"
            disabled={applied.length === 0}
            onClick={() => setActive([])}
          >
            {resetAllLabel}
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
                <th scope="col">{label("request")}</th>
                <th scope="col">{label("city")}</th>
                <th scope="col">{label("status")}</th>
                <th scope="col" data-align="end">
                  {label("score")}
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.request}</th>
                  <td data-part="muted">{row.city}</td>
                  <td data-part="muted">
                    {statusText[row.status] ?? STATUS_LABEL[row.status]}
                  </td>
                  <td data-align="end">{row.score}</td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={4} data-part="empty-cell">
                    <div data-part="empty" aria-live="polite">
                      <span data-part="glyph" aria-hidden="true" />
                      <p data-part="empty-title">{emptyTitle}</p>
                      <p data-part="empty-text">
                        {emptyText.replace(
                          "{filters}",
                          applied.map((one) => filterLabel(one.id)).join(", "),
                        )}
                      </p>
                      <div data-part="empty-actions">
                        <button
                          type="button"
                          data-tone="primary"
                          onClick={() => setActive([])}
                        >
                          {emptyResetLabel}
                        </button>
                        <button type="button">{emptyCreateLabel}</button>
                      </div>
                    </div>
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
