"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  /** Дата в ISO: 2026-03-14. Строка, а не Date — её проще передать с сервера. */
  defaultValue?: string
  locale?: string
  onChange?: (iso: string) => void
  accent?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  previousLabel?: string
  nextLabel?: string
  todayLabel?: string
}

// Идея компонента: месяц на сетке 7×6 с постоянной высотой. Число строк
// фиксировано: месяц, который то на пять строк, то на шесть, дёргает всё
// под собой при переключении. Неделя начинается с понедельника, потому что
// в России и Европе так, а не как в JavaScript по умолчанию.
const STYLES = `
:where([data-vibeui-block="calendar-001"]){
--vibeui-calendar-001-bg:transparent;
--vibeui-calendar-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-calendar-001-muted:light-dark(oklch(0.6 0.014 265),oklch(0.68 0.012 265));
--vibeui-calendar-001-border:light-dark(oklch(0.91 0.006 265),oklch(0.34 0.012 265));
--vibeui-calendar-001-hover:light-dark(oklch(0.96 0.004 265),oklch(0.29 0.014 265));
--vibeui-calendar-001-accent:light-dark(oklch(0.55 0.17 265),oklch(0.72 0.15 265));
--vibeui-calendar-001-on-accent:light-dark(oklch(0.99 0.01 265),oklch(0.19 0.03 265));
--vibeui-calendar-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-001"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-001-bg);
border:1px solid var(--vibeui-calendar-001-border);border-radius:0.875rem;
color:var(--vibeui-calendar-001-fg);font-family:var(--vibeui-calendar-001-font);
}
[data-vibeui-block="calendar-001"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-001"] [data-part="title"]{
font-size:0.875rem;font-weight:650;
}
/* Заглавная только первая буква: capitalize поднимает и «г.» в «январь 2026 г.». */
[data-vibeui-block="calendar-001"] [data-part="title"]::first-letter{text-transform:uppercase}
[data-vibeui-block="calendar-001"] [data-part="nav"]{display:flex;gap:0.25rem}
[data-vibeui-block="calendar-001"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-calendar-001-border);border-radius:0.5rem;
background:transparent;color:inherit;
}
[data-vibeui-block="calendar-001"] [data-part="nav"] button:hover{background:var(--vibeui-calendar-001-hover)}
[data-vibeui-block="calendar-001"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-calendar-001-accent);outline-offset:2px}
[data-vibeui-block="calendar-001"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="calendar-001"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
[data-vibeui-block="calendar-001"] table{width:100%;border-collapse:collapse;table-layout:fixed}
[data-vibeui-block="calendar-001"] th{
padding:0.25rem 0;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-calendar-001-muted);text-transform:capitalize;
}
[data-vibeui-block="calendar-001"] td{padding:0.0625rem;text-align:center}
[data-vibeui-block="calendar-001"] td button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="calendar-001"] td button:hover{background:var(--vibeui-calendar-001-hover)}
[data-vibeui-block="calendar-001"] td button:focus-visible{outline:2px solid var(--vibeui-calendar-001-accent);outline-offset:-2px}
/* Дни соседних месяцев приглушены, но кликабельны: попасть на 1 число
   следующего месяца из последней строки — обычное дело. */
[data-vibeui-block="calendar-001"] td button[data-outside="true"]{color:var(--vibeui-calendar-001-muted);opacity:.6}
[data-vibeui-block="calendar-001"] td button[data-today="true"]{box-shadow:inset 0 0 0 1px var(--vibeui-calendar-001-border);font-weight:650}
[data-vibeui-block="calendar-001"] td button[aria-pressed="true"]{
background:var(--vibeui-calendar-001-accent);color:var(--vibeui-calendar-001-on-accent);font-weight:650;opacity:1;
}
[data-vibeui-block="calendar-001"] [data-part="footer"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-calendar-001-muted);
}
[data-vibeui-block="calendar-001"] [data-part="today"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
color:var(--vibeui-calendar-001-accent);font:inherit;font-size:0.75rem;font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-001"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

// Неделя с понедельника: getDay() отдаёт воскресенье нулём, и без сдвига
// сетка съезжает на день.
function mondayIndex(date: Date) {
  return (date.getDay() + 6) % 7
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month, 1)
  const start = new Date(first.getTime() - mondayIndex(first) * DAY)
  // Шесть строк всегда: месяц переменной высоты дёргает раскладку.
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
 * Месяц на сетке 7×6 с постоянной высотой и неделей с понедельника.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar001({
  defaultValue = "2026-03-14",
  locale = "ru-RU",
  onChange,
  accent,
  background = "",
  previousLabel = "Предыдущий месяц",
  nextLabel = "Следующий месяц",
  todayLabel = "Сегодня",
  className,
  style,
  ...props
}: Calendar001Props) {
  const [selected, setSelected] = useState(defaultValue)
  const [cursor, setCursor] = useState(() => {
    const [year, month] = defaultValue.split("-").map(Number)
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
      full: new Intl.DateTimeFormat(locale, { dateStyle: "long" }),
    }
  }, [cursor.month, cursor.year, days, locale])

  const palette = {
    ...(accent ? { "--vibeui-calendar-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-calendar-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const today = iso(new Date())

  const shift = (delta: number) => {
    const next = new Date(cursor.year, cursor.month + delta, 1)
    setCursor({ year: next.getFullYear(), month: next.getMonth() })
  }

  const pick = (date: Date) => {
    setSelected(iso(date))
    setCursor({ year: date.getFullYear(), month: date.getMonth() })
    onChange?.(iso(date))
  }

  return (
    <>
      <style href="vibeui-calendar-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-001"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="title">{titles.month}</span>
          <span data-part="nav">
            <button
              type="button"
              aria-label={previousLabel}
              onClick={() => shift(-1)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => shift(1)}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </span>
        </div>
        <table>
          <thead>
            <tr>
              {titles.weekdays.map((day) => (
                <th key={day} scope="col" abbr={day}>
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

                  return (
                    <td key={value}>
                      <button
                        type="button"
                        aria-pressed={value === selected}
                        aria-label={titles.full.format(date)}
                        data-outside={date.getMonth() !== cursor.month}
                        data-today={value === today}
                        onClick={() => pick(date)}
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
        <div data-part="footer">
          <span>{titles.full.format(new Date(`${selected}T00:00:00`))}</span>
          <button
            type="button"
            data-part="today"
            onClick={() => pick(new Date())}
          >
            {todayLabel}
          </button>
        </div>
      </div>
    </>
  )
}
