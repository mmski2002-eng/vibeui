"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar021Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "onSelect"
> & {
  /** Месяц строкой YYYY-MM: сервер и клиент считают сетку одинаково. */
  month?: string
  today?: string
  locale?: string
  defaultWeek?: number
  /** Подпись под заголовком. */
  hint?: string
  /** Заголовок колонки номеров недель. */
  weekColumnLabel?: string
  /** Подпись кнопки недели. {week}, {from} и {to} подставляются. */
  weekLabelText?: string
  /** Строка выбранной недели. {week} выделяется жирным, {from} и {to} подставляются. */
  summaryText?: string
  /** Строка, когда неделя не выбрана. */
  emptyText?: string
  onSelect?: (week: number, start: string, end: string) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: в производстве, логистике и отчётности живут не даты,
// а номера недель по ISO 8601. Поэтому здесь неделя — это строка таблицы
// с заголовком-кнопкой: выбирают не день, а весь семидневный интервал,
// и подпись снизу переводит «неделя 15» в понятные человеку числа.
const STYLES = `
:where([data-vibeui-block="calendar-021"]){
--vibeui-calendar-021-bg:transparent;
--vibeui-calendar-021-fg:light-dark(oklch(0.24 0.014 255),oklch(0.93 0.006 255));
--vibeui-calendar-021-muted:light-dark(oklch(0.63 0.014 255),oklch(0.67 0.013 255));
--vibeui-calendar-021-faint:light-dark(oklch(0.8 0.012 255),oklch(0.5 0.013 255));
--vibeui-calendar-021-border:light-dark(oklch(0.91 0.006 255),oklch(0.35 0.012 255));
--vibeui-calendar-021-soft:light-dark(oklch(0.965 0.006 255),oklch(0.29 0.01 255));
--vibeui-calendar-021-accent:light-dark(oklch(0.52 0.14 255),oklch(0.72 0.13 255));
--vibeui-calendar-021-accentsoft:light-dark(oklch(0.94 0.04 255),oklch(0.34 0.05 255));
--vibeui-calendar-021-on-accent:light-dark(oklch(0.99 0.005 255),oklch(0.2 0.03 255));
--vibeui-calendar-021-radius:0.75rem;
--vibeui-calendar-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-021"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:1rem;
background:var(--vibeui-calendar-021-bg);
border:1px solid var(--vibeui-calendar-021-border);
border-radius:calc(var(--vibeui-calendar-021-radius) + 0.25rem);
color:var(--vibeui-calendar-021-fg);
font-family:var(--vibeui-calendar-021-font);
}
[data-vibeui-block="calendar-021"] [data-part="title"]{
margin:0;font-size:0.95rem;font-weight:700;letter-spacing:-0.01em;text-transform:capitalize;
}
[data-vibeui-block="calendar-021"] [data-part="hint"]{
margin:0.15rem 0 0;font-size:0.75rem;color:var(--vibeui-calendar-021-muted);
}
[data-vibeui-block="calendar-021"] table{
width:100%;border-collapse:collapse;table-layout:fixed;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-021"] th,
[data-vibeui-block="calendar-021"] td{padding:0;text-align:center}
[data-vibeui-block="calendar-021"] thead th{
padding-bottom:0.35rem;font-size:0.7rem;font-weight:600;
color:var(--vibeui-calendar-021-muted);text-transform:uppercase;letter-spacing:0.04em;
}
[data-vibeui-block="calendar-021"] [data-part="weekcol"]{width:2.4rem}
[data-vibeui-block="calendar-021"] [data-part="weekbtn"]{
appearance:none;cursor:pointer;font:inherit;
width:2.1rem;height:2.1rem;border-radius:0.5rem;
border:1px dashed var(--vibeui-calendar-021-border);
background:var(--vibeui-calendar-021-soft);
color:var(--vibeui-calendar-021-muted);
font-size:0.75rem;font-weight:700;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="calendar-021"] [data-part="weekbtn"]:hover{
color:var(--vibeui-calendar-021-fg);border-color:var(--vibeui-calendar-021-accent);
}
[data-vibeui-block="calendar-021"] [data-part="weekbtn"]:focus-visible{
outline:2px solid var(--vibeui-calendar-021-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-021"] [data-part="weekbtn"][aria-pressed="true"]{
background:var(--vibeui-calendar-021-accent);border-color:transparent;
color:var(--vibeui-calendar-021-on-accent);
}
[data-vibeui-block="calendar-021"] [data-part="day"]{
display:flex;align-items:center;justify-content:center;
height:2.1rem;font-size:0.8125rem;
}
[data-vibeui-block="calendar-021"] tbody tr[data-picked="true"] [data-part="day"]{
background:var(--vibeui-calendar-021-accentsoft);
}
[data-vibeui-block="calendar-021"] tbody tr[data-picked="true"] td:first-of-type [data-part="day"]{
border-radius:0.5rem 0 0 0.5rem;
}
[data-vibeui-block="calendar-021"] tbody tr[data-picked="true"] td:last-child [data-part="day"]{
border-radius:0 0.5rem 0.5rem 0;
}
[data-vibeui-block="calendar-021"] [data-part="day"][data-outside="true"]{color:var(--vibeui-calendar-021-faint)}
[data-vibeui-block="calendar-021"] [data-part="day"][data-today="true"]{
font-weight:700;box-shadow:inset 0 0 0 1px var(--vibeui-calendar-021-accent);border-radius:0.5rem;
}
[data-vibeui-block="calendar-021"] [data-part="foot"]{
margin:0;padding-top:0.6rem;border-top:1px solid var(--vibeui-calendar-021-border);
font-size:0.8125rem;color:var(--vibeui-calendar-021-muted);
}
[data-vibeui-block="calendar-021"] [data-part="foot"] b{color:var(--vibeui-calendar-021-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-021"] *{animation:none!important;transition:none!important}}
`

/**
 * Номер недели по ISO 8601: неделя принадлежит тому году, в котором лежит
 * её четверг. Считаем в UTC, чтобы переход на летнее время не сдвинул сутки.
 */
function isoWeek(date: Date) {
  const point = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const weekday = point.getUTCDay() || 7

  point.setUTCDate(point.getUTCDate() + 4 - weekday)

  const yearStart = new Date(Date.UTC(point.getUTCFullYear(), 0, 1))

  return Math.ceil(((point.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function stamp(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function fillText(template: string, values: Record<string, string | number>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => `${values[key] ?? match}`,
  )
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
 * Месячная сетка с колонкой номеров ISO-недель: выбирается неделя целиком.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar021({
  month = "2026-04",
  today = "2026-04-15",
  locale = "ru-RU",
  defaultWeek = 16,
  hint = "Номера недель по ISO 8601",
  weekColumnLabel = "нед",
  weekLabelText = "Неделя {week}, с {from} по {to}",
  summaryText = "Неделя {week}: {from} — {to}",
  emptyText = "Неделя не выбрана",
  onSelect,
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar021Props) {
  const [picked, setPicked] = useState(defaultWeek)

  const rows = useMemo(() => {
    const [year, index] = month.split("-").map(Number)
    const first = new Date(year, index - 1, 1)
    const offset = (first.getDay() + 6) % 7

    return Array.from({ length: 6 }, (_, week) =>
      Array.from(
        { length: 7 },
        (_, day) => new Date(year, index - 1, 1 - offset + week * 7 + day),
      ),
    )
      .filter((days) => days.some((date) => date.getMonth() === index - 1))
      .map((days) => ({ days, number: isoWeek(days[3]) }))
  }, [month])

  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "short" })

    return Array.from({ length: 7 }, (_, day) =>
      format.format(new Date(2024, 0, 1 + day)),
    )
  }, [locale])

  const heading = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(`${month}-01T00:00:00`))

  const span = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  })

  const current = rows.find((row) => row.number === picked)

  const [summaryBefore, summaryAfter = ""] = summaryText.split("{week}")

  const palette = {
    ...(accent ? { "--vibeui-calendar-021-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-021-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-021" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="calendar-021"
        className={className}
        style={palette}
      >
        <header>
          <h3 data-part="title">{heading}</h3>
          <p data-part="hint">{hint}</p>
        </header>
        <table>
          <thead>
            <tr>
              <th data-part="weekcol" scope="col">
                {weekColumnLabel}
              </th>
              {weekdays.map((name) => (
                <th key={name} scope="col">
                  {name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.number} data-picked={row.number === picked}>
                <th scope="row" data-part="weekcol">
                  <button
                    type="button"
                    data-part="weekbtn"
                    aria-pressed={row.number === picked}
                    aria-label={fillText(weekLabelText, {
                      week: row.number,
                      from: span.format(row.days[0]),
                      to: span.format(row.days[6]),
                    })}
                    onClick={() => {
                      setPicked(row.number)
                      onSelect?.(
                        row.number,
                        stamp(row.days[0]),
                        stamp(row.days[6]),
                      )
                    }}
                  >
                    {row.number}
                  </button>
                </th>
                {row.days.map((date) => (
                  <td key={date.getTime()}>
                    <span
                      data-part="day"
                      data-outside={
                        date.getMonth() !== Number(month.split("-")[1]) - 1
                      }
                      data-today={stamp(date) === today}
                    >
                      {date.getDate()}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p data-part="foot" aria-live="polite">
          {current ? (
            <>
              {summaryBefore}
              <b>{current.number}</b>
              {fillText(summaryAfter, {
                from: span.format(current.days[0]),
                to: span.format(current.days[6]),
              })}
            </>
          ) : (
            emptyText
          )}
        </p>
      </section>
    </>
  )
}
