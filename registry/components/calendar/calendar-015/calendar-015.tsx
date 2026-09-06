"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Calendar015Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  defaultDate?: string
  defaultTime?: string
  /** Шаг сетки времени в минутах: 15, 30 или 60. */
  step?: number
  opensAt?: string
  closesAt?: string
  busy?: string[]
  /** Заголовок колонки времени. */
  timesLegend?: string
  /** Подпись колонки времени для скринридера. */
  timesLabel?: string
  /** Строка подвала. {value} подставляется и выделяется жирным. */
  summaryText?: string
  submitText?: string
  locale?: string
  onChange?: (value: { date: string; time: string }) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: дата и время выбираются в одном месте и в одном
// движении. Месяц слева, колонка времени справа — не всплывающий второй шаг:
// пользователь видит, что у выбранного дня осталось три свободных часа,
// до того как нажмёт на день.
const STYLES = `
:where([data-vibeui-block="calendar-015"]){
--vibeui-calendar-015-bg:transparent;
--vibeui-calendar-015-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-calendar-015-muted:color-mix(in oklab,var(--vibeui-calendar-015-fg) 68%,transparent);
--vibeui-calendar-015-border:light-dark(oklch(0.91 0 265),oklch(0.34 0 265));
--vibeui-calendar-015-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-calendar-015-accent:light-dark(oklch(0.52 0.15 255),oklch(0.72 0.14 255));
--vibeui-calendar-015-on-accent:light-dark(oklch(0.99 0 255),oklch(0.2 0.04 255));
--vibeui-calendar-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="calendar-015"]{color-scheme:dark}
[data-vibeui-block="calendar-015"]{
width:100%;max-width:29rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-015-bg);
border:1px solid var(--vibeui-calendar-015-border);border-radius:1rem;
color:var(--vibeui-calendar-015-fg);font-family:var(--vibeui-calendar-015-font);
}
[data-vibeui-block="calendar-015"] [data-part="shell"]{
display:flex;flex-wrap:wrap;gap:0.875rem;align-items:flex-start;
}
[data-vibeui-block="calendar-015"] [data-part="dates"]{flex:1 1 15rem;min-width:14rem}
[data-vibeui-block="calendar-015"] [data-part="times"]{
flex:0 1 7.5rem;min-width:6.5rem;
display:flex;flex-direction:column;gap:0.25rem;
max-height:15.5rem;overflow-y:auto;padding-right:0.125rem;
}
[data-vibeui-block="calendar-015"] [data-part="title"]{
margin:0 0 0.375rem;font-size:0.9375rem;font-weight:650;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-015"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-015"] [data-part="legend"]{
margin:0 0 0.375rem;font-size:0.75rem;font-weight:600;letter-spacing:0.04em;
text-transform:uppercase;color:var(--vibeui-calendar-015-muted);
}
[data-vibeui-block="calendar-015"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="calendar-015"] th{
padding:0.1875rem 0;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-calendar-015-muted);text-transform:capitalize;
}
[data-vibeui-block="calendar-015"] td{padding:0.0625rem;text-align:center}
[data-vibeui-block="calendar-015"] td button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.875rem;height:1.875rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-015"] td button:hover{background:var(--vibeui-calendar-015-hover)}
[data-vibeui-block="calendar-015"] td button:focus-visible{outline:2px solid var(--vibeui-calendar-015-accent);outline-offset:-2px}
[data-vibeui-block="calendar-015"] td button[data-outside="true"]{color:var(--vibeui-calendar-015-muted);opacity:.5}
[data-vibeui-block="calendar-015"] td button[aria-pressed="true"]{
background:var(--vibeui-calendar-015-accent);color:var(--vibeui-calendar-015-on-accent);font-weight:650;opacity:1;
}
[data-vibeui-block="calendar-015"] [data-part="times"] button{
appearance:none;cursor:pointer;flex:none;
height:2rem;padding:0 0.5rem;border-radius:0.5rem;
border:1px solid var(--vibeui-calendar-015-border);
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-015"] [data-part="times"] button:hover:not(:disabled){background:var(--vibeui-calendar-015-hover)}
[data-vibeui-block="calendar-015"] [data-part="times"] button:focus-visible{outline:2px solid var(--vibeui-calendar-015-accent);outline-offset:2px}
[data-vibeui-block="calendar-015"] [data-part="times"] button:disabled{
cursor:not-allowed;color:var(--vibeui-calendar-015-muted);opacity:.5;text-decoration:line-through;
}
[data-vibeui-block="calendar-015"] [data-part="times"] button[aria-pressed="true"]{
background:var(--vibeui-calendar-015-accent);color:var(--vibeui-calendar-015-on-accent);
border-color:var(--vibeui-calendar-015-accent);font-weight:650;
}
[data-vibeui-block="calendar-015"] [data-part="foot"]{
display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;
margin-top:0.875rem;padding-top:0.75rem;border-top:1px solid var(--vibeui-calendar-015-border);
font-size:0.875rem;
}
[data-vibeui-block="calendar-015"] [data-part="summary"]{color:var(--vibeui-calendar-015-muted)}
[data-vibeui-block="calendar-015"] [data-part="summary"] strong{color:var(--vibeui-calendar-015-fg)}
[data-vibeui-block="calendar-015"] [data-part="submit"]{
appearance:none;cursor:pointer;border:0;border-radius:0.5rem;
display:inline-flex;align-items:center;justify-content:center;
min-height:2.25rem;padding:0.25rem 1rem;
background:var(--vibeui-calendar-015-accent);color:var(--vibeui-calendar-015-on-accent);
font:inherit;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="calendar-015"] [data-part="submit"]:focus-visible{outline:2px solid var(--vibeui-calendar-015-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-015"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function minutes(value: string) {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
}

function clock(value: number) {
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`
}

const DEFAULT_BUSY = ["10:00", "10:30", "13:00", "16:30"]

// Стрелки водят фокус по сетке. Без них до нужного дня приходится жать Tab
// столько раз, сколько до него дней.
function moveFocus(event: KeyboardEvent<HTMLElement>, columns: number) {
  const steps: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -columns,
    ArrowDown: columns,
  }
  const step = steps[event.key]

  if (step === undefined) {
    return
  }

  const buttons = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  )
  const from = buttons.indexOf(document.activeElement as HTMLButtonElement)

  if (from < 0) {
    return
  }

  let index = from + step

  while (buttons[index]?.disabled) {
    index += step
  }

  if (!buttons[index]) {
    return
  }

  event.preventDefault()
  buttons[index].focus()
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
 * Дата и локаль из пропов или дефолты компонента. Чужая страница не должна
 * падать из-за опечатки в значении: Intl бросает RangeError и на Invalid Date,
 * и на нераспознанной локали, а это белый экран вместо всего сайта.
 */
function safeDate(value: string, fallback: string) {
  return Number.isNaN(new Date(`${value}T00:00:00`).getTime())
    ? fallback
    : value
}

function safeLocale(value: string, fallback: string) {
  try {
    Intl.DateTimeFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Дата и время в одном блоке: месяц слева, сетка времени справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar015({
  defaultDate: defaultDateProp = "2026-03-18",
  defaultTime = "15:30",
  step = 30,
  opensAt = "09:00",
  closesAt = "18:00",
  busy = DEFAULT_BUSY,
  timesLegend = "Время",
  timesLabel = "Время приёма",
  summaryText = "Запись на {value}",
  submitText = "Подтвердить",
  locale: localeProp = "ru-RU",
  onChange,
  accent,
  background = "",
  className,
  style,
  ...props
}: Calendar015Props) {
  const defaultDate = safeDate(defaultDateProp, "2026-03-18")
  const locale = safeLocale(localeProp, "ru-RU")
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState(defaultTime)

  const [year, month] = defaultDate.split("-").map(Number)
  const first = new Date(year, month - 1, 1)
  const start = new Date(first.getTime() - ((first.getDay() + 6) % 7) * DAY)
  const cells = Array.from(
    { length: 35 },
    (_, index) => new Date(start.getTime() + index * DAY),
  )

  // Ровно одна кнопка сетки в табуляции: выбранный день, иначе первый показанный.
  const stop = cells.some((day) => iso(day) === date) ? date : iso(cells[0])

  const from = minutes(opensAt)
  const to = minutes(closesAt)
  const slots = Array.from(
    { length: Math.max(1, Math.floor((to - from) / step)) },
    (_, index) => clock(from + index * step),
  )

  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const long = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  })
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)

  const [summaryBefore, summaryAfter = ""] = summaryText.split("{value}")

  const palette = {
    ...(accent ? { "--vibeui-calendar-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pickDate = (value: string) => {
    setDate(value)
    onChange?.({ date: value, time })
  }

  const pickTime = (value: string) => {
    setTime(value)
    onChange?.({ date, time: value })
  }

  return (
    <>
      <style href="vibeui-calendar-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="calendar"
        data-vibeui-block="calendar-015"
        className={className}
        style={palette}
      >
        <div data-part="shell">
          <div data-part="dates">
            <p data-part="title">{title}</p>
            <table>
              <thead>
                <tr>
                  {cells.slice(0, 7).map((day) => (
                    <th key={iso(day)} scope="col">
                      {weekday.format(day)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody onKeyDown={(event) => moveFocus(event, 7)}>
                {Array.from({ length: 5 }, (_, row) => (
                  <tr key={row}>
                    {cells.slice(row * 7, row * 7 + 7).map((day) => {
                      const value = iso(day)

                      return (
                        <td key={value}>
                          <button
                            type="button"
                            tabIndex={value === stop ? 0 : -1}
                            aria-pressed={value === date}
                            aria-label={long.format(day)}
                            data-outside={day.getMonth() !== month - 1}
                            onClick={() => pickDate(value)}
                          >
                            {day.getDate()}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            data-part="times"
            role="group"
            aria-label={timesLabel}
            onKeyDown={(event) => moveFocus(event, 1)}
          >
            <p data-part="legend">{timesLegend}</p>
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                aria-pressed={slot === time}
                disabled={busy.includes(slot)}
                onClick={() => pickTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
        <div data-part="foot">
          <span data-part="summary">
            {summaryBefore}
            <strong>
              {long.format(new Date(`${date}T00:00:00`))}, {time}
            </strong>
            {summaryAfter}
          </span>
          <button type="button" data-part="submit">
            {submitText}
          </button>
        </div>
      </div>
    </>
  )
}
