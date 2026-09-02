"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  defaultFrom?: string
  defaultTo?: string
  locale?: string
  onChange?: (range: { from: string; to: string }) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  previousLabel?: string
  nextLabel?: string
  pendingLabel?: string
  /** Счёт ночей. {count} подставляется числом. */
  nightsText?: string
}

// Идея компонента: выбор диапазона в один заход. Первый клик ставит начало,
// второй — конец, и если он раньше начала, границы меняются местами вместо
// ошибки: человек так и думает — «с этого по то», а не «сначала меньшую».
// Подсветка идёт по всей строке между границами, а не точками по дням.
const STYLES = `
:where([data-vibeui-block="calendar-002"]){
--vibeui-calendar-002-bg:transparent;
--vibeui-calendar-002-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-calendar-002-muted:light-dark(oklch(0.6 0.014 265),oklch(0.68 0.012 265));
--vibeui-calendar-002-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-calendar-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-002-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.19 0.03 265));
--vibeui-calendar-002-range:light-dark(color-mix(in oklab,var(--vibeui-calendar-002-accent) 12%,oklch(1 0 0)),color-mix(in oklab,var(--vibeui-calendar-002-accent) 26%,oklch(0.24 0.014 265)));
--vibeui-calendar-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-002-bg);
border:1px solid var(--vibeui-calendar-002-border);border-radius:0.875rem;
color:var(--vibeui-calendar-002-fg);font-family:var(--vibeui-calendar-002-font);
}
[data-vibeui-block="calendar-002"] [data-part="head"]{display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="calendar-002"] [data-part="title"]{font-size:0.875rem;font-weight:650}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-002"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-002"] [data-part="nav"]{display:flex;gap:0.25rem}
[data-vibeui-block="calendar-002"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-calendar-002-border);border-radius:0.5rem;
background:transparent;color:inherit;
}
[data-vibeui-block="calendar-002"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-calendar-002-accent);outline-offset:2px}
[data-vibeui-block="calendar-002"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="calendar-002"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
[data-vibeui-block="calendar-002"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="calendar-002"] th{padding:0.25rem 0;font-size:0.6875rem;font-weight:600;color:var(--vibeui-calendar-002-muted);text-transform:capitalize}
/* Подсветка диапазона живёт на ячейке, а не на кнопке: только так полоса
   между днями получается сплошной. */
[data-vibeui-block="calendar-002"] td{padding:0;text-align:center}
[data-vibeui-block="calendar-002"] td[data-in="true"]{background:var(--vibeui-calendar-002-range)}
[data-vibeui-block="calendar-002"] td[data-edge="from"]{border-radius:0.5rem 0 0 0.5rem}
[data-vibeui-block="calendar-002"] td[data-edge="to"]{border-radius:0 0.5rem 0.5rem 0}
[data-vibeui-block="calendar-002"] td[data-edge="single"]{border-radius:0.5rem}
[data-vibeui-block="calendar-002"] td button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-002"] td button:hover{box-shadow:inset 0 0 0 1px var(--vibeui-calendar-002-border)}
[data-vibeui-block="calendar-002"] td button:focus-visible{outline:2px solid var(--vibeui-calendar-002-accent);outline-offset:-2px}
[data-vibeui-block="calendar-002"] td button[data-outside="true"]{color:var(--vibeui-calendar-002-muted);opacity:.55}
[data-vibeui-block="calendar-002"] td button[data-edge="true"]{
background:var(--vibeui-calendar-002-accent);color:var(--vibeui-calendar-002-on-accent);font-weight:650;opacity:1;
}
[data-vibeui-block="calendar-002"] [data-part="summary"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-calendar-002-muted);
}
[data-vibeui-block="calendar-002"] [data-part="nights"]{color:var(--vibeui-calendar-002-fg);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-002"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)
  return Array.from(
    { length: 42 },
    (_, index) => new Date(start.getTime() + index * DAY),
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
 * Выбор диапазона: два клика, автоперестановка границ и счёт ночей.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar002({
  defaultFrom = "2026-03-10",
  defaultTo = "2026-03-17",
  locale = "ru-RU",
  onChange,
  accent,
  background = "",
  previousLabel = "Предыдущий месяц",
  nextLabel = "Следующий месяц",
  pendingLabel = "Выберите вторую дату",
  nightsText = "{count} ночей",
  className,
  style,
  ...props
}: Calendar002Props) {
  const [range, setRange] = useState({ from: defaultFrom, to: defaultTo })
  const [pending, setPending] = useState<string | null>(null)
  const [cursor, setCursor] = useState(() => {
    const [year, month] = defaultFrom.split("-").map(Number)
    return { year, month: month - 1 }
  })

  const days = useMemo(
    () => buildGrid(cursor.year, cursor.month),
    [cursor.month, cursor.year],
  )

  const titles = useMemo(() => {
    const week = new Intl.DateTimeFormat(locale, { weekday: "short" })
    const month = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    })
    return {
      weekdays: days.slice(0, 7).map((date) => week.format(date)),
      month: month.format(new Date(cursor.year, cursor.month, 1)),
      day: new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
    }
  }, [cursor.month, cursor.year, days, locale])

  const palette = {
    ...(accent ? { "--vibeui-calendar-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const pick = (value: string) => {
    if (!pending) {
      setPending(value)
      return
    }
    // Границы наоборот — не ошибка, а обычный ход мысли: меняем местами.
    const next =
      value < pending
        ? { from: value, to: pending }
        : { from: pending, to: value }
    setRange(next)
    setPending(null)
    onChange?.(next)
  }

  const from = pending ?? range.from
  const to = pending ? pending : range.to
  const nights = Math.round(
    (new Date(`${range.to}T00:00:00`).getTime() -
      new Date(`${range.from}T00:00:00`).getTime()) /
      DAY,
  )

  return (
    <>
      <style href="vibeui-calendar-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-002"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="title">{titles.month}</span>
          <span data-part="nav">
            <button
              type="button"
              aria-label={previousLabel}
              onClick={() => {
                const next = new Date(cursor.year, cursor.month - 1, 1)
                setCursor({ year: next.getFullYear(), month: next.getMonth() })
              }}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => {
                const next = new Date(cursor.year, cursor.month + 1, 1)
                setCursor({ year: next.getFullYear(), month: next.getMonth() })
              }}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </span>
        </div>
        <table>
          <thead>
            <tr>
              {titles.weekdays.map((day) => (
                <th key={day} scope="col">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, row) => (
              <tr key={row}>
                {days.slice(row * 7, row * 7 + 7).map((date) => {
                  const value = iso(date)
                  const inRange = value >= from && value <= to
                  const edge =
                    from === to && value === from
                      ? "single"
                      : value === from
                        ? "from"
                        : value === to
                          ? "to"
                          : undefined

                  return (
                    <td key={value} data-in={inRange} data-edge={edge}>
                      <button
                        type="button"
                        aria-label={titles.full.format(date)}
                        aria-pressed={value === from || value === to}
                        data-edge={value === from || value === to}
                        data-outside={date.getMonth() !== cursor.month}
                        onClick={() => pick(value)}
                      >
                        {date.getDate()}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div data-part="summary">
          <span>
            {titles.day.format(new Date(`${range.from}T00:00:00`))} —{" "}
            {titles.day.format(new Date(`${range.to}T00:00:00`))}
          </span>
          <span data-part="nights">
            {pending
              ? pendingLabel
              : nightsText.replace("{count}", String(nights))}
          </span>
        </div>
      </div>
    </>
  )
}
