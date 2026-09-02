"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Datagrid016Row = {
  id: string
  campaign: string
  channel: string
  spend: number
  leads: number
  cpl: number
}

export type Datagrid016Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  rows?: Datagrid016Row[]
  caption?: string
  aggregate?: "sum" | "avg" | "min" | "max"
  /** Заголовок панели над таблицей. */
  heading?: string
  /** Подпись переключателя свёртки. */
  pickerText?: string
  /** Названия функций свёртки в списке: компонент несёт русские. */
  aggregateText?: Record<string, string>
  /** Названия свёрток в строке итога. */
  summaryText?: Record<string, string>
  /** Строка итога. {fold} — название свёртки, {count} — число строк. */
  summaryTemplate?: string
  /** Строка итога, когда ничего не отмечено. */
  emptyText?: string
  /** Заголовки колонок по ключу: компонент несёт русские. */
  columnText?: Record<string, string>
  /** Подпись флажка строки. {campaign} — название кампании. */
  pickLabel?: string
  /** Подпись области прокрутки для скринридера. */
  scrollLabel?: string
  /** Пусто — подложки нет, сетка лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: итог считается не по всей таблице, а по отмеченным
// строкам, и функцию свёртки выбирает читатель — сумма, среднее, минимум
// или максимум. Строка итога живёт в tfoot и меняет подпись вместе с
// выбранной функцией: «Итого» под средним значением врало бы.
//
// Тема берётся из color-scheme окружения через light-dark(): сетка темнеет
// вместе со страницей и не носит собственной подложки.
const STYLES = `
:where([data-vibeui-block="datagrid-016"]){
--vibeui-datagrid-016-bg:transparent;
--vibeui-datagrid-016-fg:light-dark(oklch(0.23 0.014 285),oklch(0.93 0.006 285));
--vibeui-datagrid-016-muted:light-dark(oklch(0.55 0.014 285),oklch(0.68 0.012 285));
--vibeui-datagrid-016-border:light-dark(oklch(0.92 0.006 285),oklch(0.35 0.012 285));
--vibeui-datagrid-016-head:light-dark(oklch(0.975 0.003 285),oklch(0.27 0.012 285));
--vibeui-datagrid-016-accent:light-dark(oklch(0.5 0.15 160),oklch(0.78 0.13 160));
--vibeui-datagrid-016-pick:light-dark(oklch(0.97 0.03 160),oklch(0.3 0.04 160));
--vibeui-datagrid-016-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="datagrid-016"]{
box-sizing:border-box;width:100%;max-width:52rem;margin:0 auto;
background:var(--vibeui-datagrid-016-bg);color:var(--vibeui-datagrid-016-fg);
border:1px solid var(--vibeui-datagrid-016-border);border-radius:0.875rem;
font-family:var(--vibeui-datagrid-016-font);overflow:hidden;
}
[data-vibeui-block="datagrid-016"] *{box-sizing:border-box}
[data-vibeui-block="datagrid-016"] [data-part="bar"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem;
padding:0.75rem 0.875rem;border-bottom:1px solid var(--vibeui-datagrid-016-border);
}
[data-vibeui-block="datagrid-016"] [data-part="title"]{margin:0;font-size:0.875rem;font-weight:650;margin-inline-end:auto}
[data-vibeui-block="datagrid-016"] [data-part="pickerLabel"]{
display:inline-flex;align-items:center;gap:0.375rem;font-size:0.75rem;color:var(--vibeui-datagrid-016-muted);
}
[data-vibeui-block="datagrid-016"] select{
font:inherit;font-size:0.75rem;color:inherit;padding:0.25rem 0.4375rem;
border:1px solid var(--vibeui-datagrid-016-border);border-radius:0.4375rem;
background:transparent;
}
[data-vibeui-block="datagrid-016"] select:focus-visible{outline:2px solid var(--vibeui-datagrid-016-accent);outline-offset:1px}
[data-vibeui-block="datagrid-016"] [data-part="scroll"]{overflow-x:auto}
[data-vibeui-block="datagrid-016"] [data-part="scroll"]:focus-visible{outline:2px solid var(--vibeui-datagrid-016-accent);outline-offset:-2px}
[data-vibeui-block="datagrid-016"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="datagrid-016"] caption{
padding:0.625rem 0.875rem;text-align:left;font-size:0.75rem;color:var(--vibeui-datagrid-016-muted);caption-side:top;
}
[data-vibeui-block="datagrid-016"] th,
[data-vibeui-block="datagrid-016"] td{
padding:0.5rem 0.875rem;text-align:left;white-space:nowrap;
border-top:1px solid var(--vibeui-datagrid-016-border);
}
[data-vibeui-block="datagrid-016"] thead th{background:var(--vibeui-datagrid-016-head);font-weight:600}
[data-vibeui-block="datagrid-016"] [data-part="check"]{width:2.5rem;padding-inline:0.75rem}
[data-vibeui-block="datagrid-016"] input[type="checkbox"]{
width:0.9375rem;height:0.9375rem;margin:0;accent-color:var(--vibeui-datagrid-016-accent);cursor:pointer;
}
[data-vibeui-block="datagrid-016"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-datagrid-016-accent);outline-offset:2px}
[data-vibeui-block="datagrid-016"] [data-align="end"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="datagrid-016"] tbody tr[data-picked="true"] td,
[data-vibeui-block="datagrid-016"] tbody tr[data-picked="true"] th{background:var(--vibeui-datagrid-016-pick)}
[data-vibeui-block="datagrid-016"] tbody tr[data-picked="true"] [data-part="check"]{box-shadow:inset 3px 0 0 var(--vibeui-datagrid-016-accent)}
[data-vibeui-block="datagrid-016"] tfoot th,
[data-vibeui-block="datagrid-016"] tfoot td{
background:var(--vibeui-datagrid-016-head);font-weight:650;
border-top:2px solid var(--vibeui-datagrid-016-accent);
}
[data-vibeui-block="datagrid-016"] [data-part="none"]{font-weight:500;color:var(--vibeui-datagrid-016-muted)}
[data-vibeui-block="datagrid-016"] [data-part="channel"]{color:var(--vibeui-datagrid-016-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="datagrid-016"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Datagrid016Row[] = [
  {
    id: "c1",
    campaign: "Весенний каталог",
    channel: "Поиск",
    spend: 184000,
    leads: 412,
    cpl: 447,
  },
  {
    id: "c2",
    campaign: "Ретаргетинг корзины",
    channel: "Соцсети",
    spend: 76500,
    leads: 289,
    cpl: 265,
  },
  {
    id: "c3",
    campaign: "Партнёрская рассылка",
    channel: "Почта",
    spend: 31000,
    leads: 96,
    cpl: 323,
  },
  {
    id: "c4",
    campaign: "Видеообзоры",
    channel: "Видео",
    spend: 212000,
    leads: 340,
    cpl: 624,
  },
  {
    id: "c5",
    campaign: "Локальные баннеры",
    channel: "Медийка",
    spend: 58000,
    leads: 121,
    cpl: 479,
  },
]

const AGGREGATES = ["sum", "avg", "min", "max"] as const

type Aggregate = (typeof AGGREGATES)[number]

const AGGREGATE_TEXT: Record<string, string> = {
  sum: "Сумма",
  avg: "Среднее",
  min: "Минимум",
  max: "Максимум",
}

const SUMMARY_TEXT: Record<string, string> = {
  sum: "Сумма по выделенным",
  avg: "Среднее по выделенным",
  min: "Минимум по выделенным",
  max: "Максимум по выделенным",
}

const COLUMN_TEXT: Record<string, string> = {
  check: "Выбор",
  campaign: "Кампания",
  channel: "Канал",
  spend: "Расход, ₽",
  leads: "Лидов",
  cpl: "Цена лида, ₽",
}

function fold(values: number[], mode: Aggregate) {
  if (values.length === 0) {
    return 0
  }

  if (mode === "sum") {
    return values.reduce((total, value) => total + value, 0)
  }

  if (mode === "avg") {
    return values.reduce((total, value) => total + value, 0) / values.length
  }

  return mode === "min" ? Math.min(...values) : Math.max(...values)
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
 * Сетка со строкой-итогом по выделенным строкам: функция свёртки
 * переключается на месте. Один файл, ноль зависимостей.
 */
export function Datagrid016({
  rows = DEFAULT_ROWS,
  caption = "Итог в подвале считается только по отмеченным строкам",
  aggregate = "sum",
  heading = "Кампании квартала",
  pickerText = "Свёртка",
  aggregateText = AGGREGATE_TEXT,
  summaryText = SUMMARY_TEXT,
  summaryTemplate = "{fold}: {count}",
  emptyText = "Ни одна строка не отмечена — итог пуст",
  columnText = COLUMN_TEXT,
  pickLabel = "Учитывать кампанию «{campaign}» в итоге",
  scrollLabel = "Таблица кампаний, прокручивается вбок",
  background = "",
  accent,
  className,
  style,
  ...props
}: Datagrid016Props) {
  const [picked, setPicked] = useState<string[]>(["c1", "c2"])
  // Выбор читателя живёт рядом с пропом, а не вместо него: смена aggregate
  // снаружи обязана переставить свёртку, иначе проп работал бы один раз.
  const [chosen, setChosen] = useState<Aggregate | null>(null)
  const [source, setSource] = useState<Aggregate>(aggregate)

  if (source !== aggregate) {
    setSource(aggregate)
    setChosen(null)
  }

  const mode = chosen ?? aggregate

  const selected = rows.filter((row) => picked.includes(row.id))
  const spend = fold(
    selected.map((row) => row.spend),
    mode,
  )
  const leads = fold(
    selected.map((row) => row.leads),
    mode,
  )
  const cpl = fold(
    selected.map((row) => row.cpl),
    mode,
  )

  const palette = {
    ...(accent ? { "--vibeui-datagrid-016-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-datagrid-016-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-datagrid-016" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="datagrid-016"
        className={className}
        style={palette}
      >
        <div data-part="bar">
          <h3 data-part="title">{heading}</h3>
          <label data-part="pickerLabel">
            {pickerText}
            <select
              value={mode}
              onChange={(event) => setChosen(event.target.value as Aggregate)}
            >
              {AGGREGATES.map((value) => (
                <option key={value} value={value}>
                  {aggregateText[value] ?? AGGREGATE_TEXT[value]}
                </option>
              ))}
            </select>
          </label>
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
                <th scope="col" data-part="check">
                  <span hidden>{columnText.check ?? COLUMN_TEXT.check}</span>
                </th>
                <th scope="col">
                  {columnText.campaign ?? COLUMN_TEXT.campaign}
                </th>
                <th scope="col">{columnText.channel ?? COLUMN_TEXT.channel}</th>
                <th scope="col" data-align="end">
                  {columnText.spend ?? COLUMN_TEXT.spend}
                </th>
                <th scope="col" data-align="end">
                  {columnText.leads ?? COLUMN_TEXT.leads}
                </th>
                <th scope="col" data-align="end">
                  {columnText.cpl ?? COLUMN_TEXT.cpl}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const on = picked.includes(row.id)

                return (
                  <tr key={row.id} data-picked={on ? "true" : undefined}>
                    <td data-part="check">
                      <input
                        type="checkbox"
                        checked={on}
                        aria-label={pickLabel.replace(
                          "{campaign}",
                          row.campaign,
                        )}
                        onChange={() =>
                          setPicked((current) =>
                            current.includes(row.id)
                              ? current.filter((id) => id !== row.id)
                              : [...current, row.id],
                          )
                        }
                      />
                    </td>
                    <th scope="row">{row.campaign}</th>
                    <td data-part="channel">{row.channel}</td>
                    <td data-align="end">
                      {row.spend.toLocaleString("ru-RU")}
                    </td>
                    <td data-align="end">
                      {row.leads.toLocaleString("ru-RU")}
                    </td>
                    <td data-align="end">{row.cpl.toLocaleString("ru-RU")}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td data-part="check" />
                <th scope="row" colSpan={2} aria-live="polite">
                  {selected.length === 0 ? (
                    <span data-part="none">{emptyText}</span>
                  ) : (
                    summaryTemplate
                      .replace(
                        "{fold}",
                        summaryText[mode] ?? SUMMARY_TEXT[mode],
                      )
                      .replace("{count}", String(selected.length))
                  )}
                </th>
                <td data-align="end">
                  {selected.length === 0
                    ? "—"
                    : Math.round(spend).toLocaleString("ru-RU")}
                </td>
                <td data-align="end">
                  {selected.length === 0
                    ? "—"
                    : Math.round(leads).toLocaleString("ru-RU")}
                </td>
                <td data-align="end">
                  {selected.length === 0
                    ? "—"
                    : Math.round(cpl).toLocaleString("ru-RU")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  )
}
