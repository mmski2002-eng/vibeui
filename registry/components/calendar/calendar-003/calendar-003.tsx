"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  /** С какого дня начинается полоса. По умолчанию — неделя вокруг выбранного. */
  defaultValue?: string
  days?: number
  locale?: string
  onChange?: (iso: string) => void
  accent?: string
}

// Идея компонента: неделя полосой, а не сеткой. На телефоне месяц занимает
// пол-экрана, хотя выбирают почти всегда ближайшие дни. Полоса прокручивается
// вбок, выбранный день прилипает к краю, а сегодняшний помечен точкой —
// в узкой ленте без метки теряется даже он.
const STYLES = `
:where([data-vibeui-block="calendar-003"]){
--vibeui-calendar-003-bg:oklch(1 0 0);
--vibeui-calendar-003-fg:oklch(0.24 0.014 265);
--vibeui-calendar-003-muted:oklch(0.6 0.014 265);
--vibeui-calendar-003-border:oklch(0.91 0.006 265);
--vibeui-calendar-003-accent:oklch(0.55 0.17 265);
--vibeui-calendar-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-calendar-003-bg);
border:1px solid var(--vibeui-calendar-003-border);border-radius:0.875rem;
color:var(--vibeui-calendar-003-fg);font-family:var(--vibeui-calendar-003-font);
}
[data-vibeui-block="calendar-003"] [data-part="title"]{
font-size:0.8125rem;font-weight:650;text-transform:capitalize;
}
/* Полоса прокручивается вбок с привязкой: день не останавливается наполовину. */
[data-vibeui-block="calendar-003"] [data-part="strip"]{
display:flex;gap:0.375rem;
margin:0;padding:0 0 0.25rem;list-style:none;
overflow-x:auto;overscroll-behavior-x:contain;
scroll-snap-type:x mandatory;scrollbar-width:thin;
}
[data-vibeui-block="calendar-003"] li{scroll-snap-align:center;flex:none}
[data-vibeui-block="calendar-003"] button{
appearance:none;cursor:pointer;
display:flex;flex-direction:column;align-items:center;gap:0.125rem;
width:2.75rem;padding:0.375rem 0;
border:1px solid var(--vibeui-calendar-003-border);border-radius:0.625rem;
background:transparent;color:inherit;font:inherit;
}
[data-vibeui-block="calendar-003"] button:focus-visible{outline:2px solid var(--vibeui-calendar-003-accent);outline-offset:2px}
[data-vibeui-block="calendar-003"] [data-part="weekday"]{font-size:0.625rem;text-transform:uppercase;letter-spacing:0.04em;color:var(--vibeui-calendar-003-muted)}
[data-vibeui-block="calendar-003"] [data-part="day"]{font-size:1rem;font-weight:650;font-variant-numeric:tabular-nums;line-height:1.1}
/* Точка под числом отмечает сегодня: в ленте без неё день теряется. */
[data-vibeui-block="calendar-003"] [data-part="dot"]{
width:0.25rem;height:0.25rem;border-radius:9999px;background:var(--vibeui-calendar-003-accent);
}
[data-vibeui-block="calendar-003"] button[aria-pressed="true"]{
border-color:transparent;background:var(--vibeui-calendar-003-accent);color:oklch(0.99 0.01 265);
}
[data-vibeui-block="calendar-003"] button[aria-pressed="true"] [data-part="weekday"]{color:oklch(0.95 0.02 265)}
[data-vibeui-block="calendar-003"] button[aria-pressed="true"] [data-part="dot"]{background:oklch(0.99 0.01 265)}
[data-vibeui-block="calendar-003"] button[data-weekend="true"] [data-part="day"]{color:oklch(0.55 0.16 25)}
[data-vibeui-block="calendar-003"] button[aria-pressed="true"][data-weekend="true"] [data-part="day"]{color:oklch(0.99 0.01 265)}
[data-vibeui-block="calendar-003"] [data-part="picked"]{font-size:0.75rem;color:var(--vibeui-calendar-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-003"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function iso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/**
 * Неделя полосой с прокруткой: компактный выбор ближайших дней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar003({
  defaultValue = "2026-03-14",
  days = 14,
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar003Props) {
  const [selected, setSelected] = useState(defaultValue)

  const dates = useMemo(() => {
    const base = new Date(`${defaultValue}T00:00:00`)
    const start = new Date(base.getTime() - 3 * DAY)
    return Array.from(
      { length: Math.max(3, days) },
      (_, index) => new Date(start.getTime() + index * DAY),
    )
  }, [days, defaultValue])

  const formats = useMemo(
    () => ({
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
      month: new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
      }),
    }),
    [locale],
  )

  const palette = {
    ...(accent ? { "--vibeui-calendar-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const today = iso(new Date())

  return (
    <>
      <style href="vibeui-calendar-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-003"
        className={className}
        style={palette}
      >
        <p data-part="title">
          {formats.month.format(new Date(`${selected}T00:00:00`))}
        </p>
        <ul data-part="strip">
          {dates.map((date) => {
            const value = iso(date)
            const weekend = date.getDay() === 0 || date.getDay() === 6

            return (
              <li key={value}>
                <button
                  type="button"
                  aria-pressed={value === selected}
                  aria-label={formats.full.format(date)}
                  data-weekend={weekend}
                  onClick={() => {
                    setSelected(value)
                    onChange?.(value)
                  }}
                >
                  <span data-part="weekday">
                    {formats.weekday.format(date)}
                  </span>
                  <span data-part="day">{date.getDate()}</span>
                  {value === today ? (
                    <span data-part="dot" aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
        <p data-part="picked">
          Выбрано: {formats.full.format(new Date(`${selected}T00:00:00`))}
        </p>
      </div>
    </>
  )
}
