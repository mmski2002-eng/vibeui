"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar018Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  defaultValue?: string[]
  year?: number
  month?: number
  /** Сколько дат можно выбрать одновременно. */
  max?: number
  emptyHint?: string
  locale?: string
  onChange?: (dates: string[]) => void
  accent?: string
}

// Идея компонента: выбор нескольких несмежных дат. Диапазон здесь не
// подходит — смены выпадают на вторник, четверг и субботу. Каждая выбранная
// дата дублируется чипом со снятием: снять дату в сетке из тридцати клеток
// труднее, чем в коротком списке под ней.
const STYLES = `
:where([data-vibeui-block="calendar-018"]){
--vibeui-calendar-018-bg:oklch(1 0 0);
--vibeui-calendar-018-fg:oklch(0.24 0.014 265);
--vibeui-calendar-018-muted:oklch(0.62 0.014 265);
--vibeui-calendar-018-border:oklch(0.91 0.006 265);
--vibeui-calendar-018-hover:oklch(0.96 0.004 265);
--vibeui-calendar-018-accent:oklch(0.52 0.16 300);
--vibeui-calendar-018-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-018"]{
display:flex;flex-direction:column;gap:0.6875rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.9375rem;
background:var(--vibeui-calendar-018-bg);
border:1px solid var(--vibeui-calendar-018-border);border-radius:1rem;
color:var(--vibeui-calendar-018-fg);font-family:var(--vibeui-calendar-018-font);
}
[data-vibeui-block="calendar-018"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="calendar-018"] [data-part="title"]{
margin:0;font-size:0.875rem;font-weight:650;text-transform:capitalize;
}
[data-vibeui-block="calendar-018"] [data-part="counter"]{
font-size:0.75rem;font-variant-numeric:tabular-nums;color:var(--vibeui-calendar-018-muted);
}
[data-vibeui-block="calendar-018"] [data-part="counter"][data-full="true"]{
color:var(--vibeui-calendar-018-accent);font-weight:650;
}
[data-vibeui-block="calendar-018"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.1875rem;
}
[data-vibeui-block="calendar-018"] [data-part="wd"]{
text-align:center;font-size:0.6875rem;font-weight:600;
color:var(--vibeui-calendar-018-muted);text-transform:capitalize;
}
[data-vibeui-block="calendar-018"] [data-part="grid"] button{
appearance:none;cursor:pointer;
aspect-ratio:1;padding:0;border:0;border-radius:0.5rem;
background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;font-variant-numeric:tabular-nums;
transition:background-color .14s ease;
}
[data-vibeui-block="calendar-018"] [data-part="grid"] button:hover:not([aria-disabled="true"]){background:var(--vibeui-calendar-018-hover)}
[data-vibeui-block="calendar-018"] [data-part="grid"] button:focus-visible{outline:2px solid var(--vibeui-calendar-018-accent);outline-offset:-2px}
[data-vibeui-block="calendar-018"] [data-part="grid"] button[aria-pressed="true"]{
background:var(--vibeui-calendar-018-accent);color:oklch(0.99 0.01 300);font-weight:700;
}
/* Лимит не прячет кнопку: она остаётся видимой и приглушённой, иначе
   исчезающие клетки читаются как ошибка вёрстки. */
[data-vibeui-block="calendar-018"] [data-part="grid"] button[aria-disabled="true"]{
color:var(--vibeui-calendar-018-muted);opacity:.45;cursor:not-allowed;
}
[data-vibeui-block="calendar-018"] [data-part="chips"]{
display:flex;flex-wrap:wrap;gap:0.3125rem;margin:0;padding:0;list-style:none;min-height:1.75rem;
}
[data-vibeui-block="calendar-018"] [data-part="chips"] li{display:flex}
[data-vibeui-block="calendar-018"] [data-part="chip"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.375rem;
height:1.75rem;padding:0 0.5rem 0 0.625rem;border-radius:0.875rem;
border:1px solid var(--vibeui-calendar-018-border);
background:transparent;color:inherit;
font:inherit;font-size:0.75rem;
}
[data-vibeui-block="calendar-018"] [data-part="chip"]:hover{background:var(--vibeui-calendar-018-hover)}
[data-vibeui-block="calendar-018"] [data-part="chip"]:focus-visible{outline:2px solid var(--vibeui-calendar-018-accent);outline-offset:2px}
[data-vibeui-block="calendar-018"] [data-part="chip"] i{
position:relative;width:0.625rem;height:0.625rem;flex:none;opacity:.65;
}
[data-vibeui-block="calendar-018"] [data-part="chip"] i::before,
[data-vibeui-block="calendar-018"] [data-part="chip"] i::after{
content:"";position:absolute;inset:45% 0 auto;height:1.25px;background:currentColor;
}
[data-vibeui-block="calendar-018"] [data-part="chip"] i::before{transform:rotate(45deg)}
[data-vibeui-block="calendar-018"] [data-part="chip"] i::after{transform:rotate(-45deg)}
[data-vibeui-block="calendar-018"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-calendar-018-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-018"] *{animation:none!important;transition:none!important}}
`

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

/**
 * Мультивыбор несмежных дат: сетка месяца плюс чипы со снятием.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar018({
  defaultValue = ["2026-03-03", "2026-03-12", "2026-03-21"],
  year = 2026,
  month = 3,
  max = 5,
  emptyHint = "Отметьте дни смен — подряд идти не обязано",
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar018Props) {
  const [selected, setSelected] = useState(defaultValue)

  const first = new Date(year, month - 1, 1)
  const lead = (first.getDay() + 6) % 7
  const length = new Date(year, month, 0).getDate()

  const weekdayName = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekdayName.format(new Date(2026, 0, 5 + index)),
  )
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(first)
  const long = new Intl.DateTimeFormat(locale, { dateStyle: "long" })
  const chipLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  })

  const palette = {
    ...(accent ? { "--vibeui-calendar-018-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((entry) => entry !== value)
      : selected.length >= max
        ? selected
        : [...selected, value].sort()

    setSelected(next)
    onChange?.(next)
  }

  const full = selected.length >= max

  return (
    <>
      <style href="vibeui-calendar-018" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-018"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <p data-part="title">{title}</p>
          <span data-part="counter" data-full={full}>
            {selected.length} / {max}
          </span>
        </div>
        <div data-part="grid" role="group" aria-label="Выбор нескольких дат">
          {weekdays.map((label) => (
            <span key={label} data-part="wd" aria-hidden="true">
              {label}
            </span>
          ))}
          {Array.from({ length: lead }, (_, index) => (
            <span key={`lead-${index}`} />
          ))}
          {Array.from({ length }, (_, index) => {
            const day = index + 1
            const value = iso(year, month, day)
            const active = selected.includes(value)

            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                aria-disabled={!active && full}
                aria-label={long.format(new Date(year, month - 1, day))}
                onClick={() => toggle(value)}
              >
                {day}
              </button>
            )
          })}
        </div>
        {selected.length > 0 ? (
          <ul data-part="chips">
            {selected.map((value) => (
              <li key={value}>
                <button
                  type="button"
                  data-part="chip"
                  onClick={() => toggle(value)}
                  aria-label={`Убрать ${long.format(new Date(`${value}T00:00:00`))}`}
                >
                  {chipLabel.format(new Date(`${value}T00:00:00`))}
                  <i aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p data-part="hint">{emptyHint}</p>
        )}
      </div>
    </>
  )
}
