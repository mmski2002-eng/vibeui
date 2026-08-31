"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar022Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  label?: string
  /** Индексы рабочих дней, где 0 — понедельник. */
  defaultDays?: number[]
  hoursPerDay?: number
  locale?: string
  onChange?: (days: number[]) => void
  accent?: string
}

// Идея компонента: расписание работы задают не датами, а днями недели —
// «пн–пт», «вт, чт, сб». Поэтому здесь семь переключателей вместо сетки
// месяца, два пресета для типовых графиков и живой итог в часах: человек
// сразу видит, во что превращается его набор галочек.
const STYLES = `
:where([data-vibeui-block="calendar-022"]){
--vibeui-calendar-022-bg:oklch(1 0 0);
--vibeui-calendar-022-fg:oklch(0.24 0.014 160);
--vibeui-calendar-022-muted:oklch(0.55 0.014 160);
--vibeui-calendar-022-border:oklch(0.9 0.008 160);
--vibeui-calendar-022-soft:oklch(0.97 0.008 160);
--vibeui-calendar-022-accent:oklch(0.5 0.11 160);
--vibeui-calendar-022-accentsoft:oklch(0.95 0.04 160);
--vibeui-calendar-022-radius:0.75rem;
--vibeui-calendar-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-022"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:24rem;box-sizing:border-box;
margin:0;padding:1rem;
background:var(--vibeui-calendar-022-bg);
border:1px solid var(--vibeui-calendar-022-border);
border-radius:calc(var(--vibeui-calendar-022-radius) + 0.25rem);
color:var(--vibeui-calendar-022-fg);
font-family:var(--vibeui-calendar-022-font);
}
[data-vibeui-block="calendar-022"] legend{
padding:0;font-size:0.9rem;font-weight:700;letter-spacing:-0.01em;
}
[data-vibeui-block="calendar-022"] [data-part="days"]{
display:grid;grid-template-columns:repeat(7,1fr);gap:0.3rem;
}
[data-vibeui-block="calendar-022"] [data-part="day"]{
appearance:none;cursor:pointer;font:inherit;
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.1rem;
min-width:0;padding:0.4rem 0.1rem;
border:1px solid var(--vibeui-calendar-022-border);
border-radius:0.6rem;
background:var(--vibeui-calendar-022-soft);
color:var(--vibeui-calendar-022-muted);
font-size:0.7rem;font-weight:600;text-transform:capitalize;
transition:background-color .16s ease,color .16s ease,border-color .16s ease;
}
[data-vibeui-block="calendar-022"] [data-part="day"]:hover{border-color:var(--vibeui-calendar-022-accent)}
[data-vibeui-block="calendar-022"] [data-part="day"]:focus-visible{
outline:2px solid var(--vibeui-calendar-022-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-022"] [data-part="day"][aria-pressed="true"]{
background:var(--vibeui-calendar-022-accent);border-color:transparent;
color:var(--vibeui-calendar-022-bg);
}
[data-vibeui-block="calendar-022"] [data-part="day"][data-weekend="true"][aria-pressed="false"]{
background:var(--vibeui-calendar-022-bg);border-style:dashed;
}
[data-vibeui-block="calendar-022"] [data-part="mark"]{font-size:0.9rem;line-height:1.1;font-weight:700}
[data-vibeui-block="calendar-022"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.35rem;
}
[data-vibeui-block="calendar-022"] [data-part="preset"]{
appearance:none;cursor:pointer;font:inherit;
padding:0.3rem 0.6rem;border-radius:999px;
border:1px solid var(--vibeui-calendar-022-border);
background:transparent;color:var(--vibeui-calendar-022-muted);
font-size:0.75rem;font-weight:600;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="calendar-022"] [data-part="preset"]:hover{
background:var(--vibeui-calendar-022-accentsoft);color:var(--vibeui-calendar-022-fg);
}
[data-vibeui-block="calendar-022"] [data-part="preset"]:focus-visible{
outline:2px solid var(--vibeui-calendar-022-accent);outline-offset:2px;
}
[data-vibeui-block="calendar-022"] [data-part="total"]{
margin:0;padding-top:0.65rem;
border-top:1px solid var(--vibeui-calendar-022-border);
font-size:0.8125rem;color:var(--vibeui-calendar-022-muted);
}
[data-vibeui-block="calendar-022"] [data-part="total"] b{
color:var(--vibeui-calendar-022-fg);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-022"] *{animation:none!important;transition:none!important}}
`

const WORKWEEK = [0, 1, 2, 3, 4]
const SIXDAY = [0, 1, 2, 3, 4, 5]

function pluralize(count: number, forms: [string, string, string]) {
  const tens = count % 100
  const ones = count % 10

  if (tens > 10 && tens < 20) return forms[2]
  if (ones === 1) return forms[0]
  if (ones > 1 && ones < 5) return forms[1]

  return forms[2]
}

/**
 * Выбор рабочих дней недели с пресетами и итогом в часах.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar022({
  label = "Рабочие дни",
  defaultDays = WORKWEEK,
  hoursPerDay = 8,
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar022Props) {
  const [days, setDays] = useState(defaultDays)

  const names = useMemo(() => {
    const short = new Intl.DateTimeFormat(locale, { weekday: "short" })
    const long = new Intl.DateTimeFormat(locale, { weekday: "long" })

    return Array.from({ length: 7 }, (_, index) => ({
      short: short.format(new Date(2024, 0, 1 + index)),
      long: long.format(new Date(2024, 0, 1 + index)),
    }))
  }, [locale])

  const apply = (next: number[]) => {
    const sorted = [...next].sort((left, right) => left - right)

    setDays(sorted)
    onChange?.(sorted)
  }

  const toggle = (index: number) => {
    apply(
      days.includes(index)
        ? days.filter((day) => day !== index)
        : [...days, index],
    )
  }

  const total = days.length * hoursPerDay

  const palette = {
    ...(accent ? { "--vibeui-calendar-022-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-022" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="calendar-022"
        className={className}
        style={palette}
      >
        <legend>{label}</legend>
        <div data-part="days">
          {names.map((name, index) => (
            <button
              key={name.long}
              type="button"
              data-part="day"
              data-weekend={index > 4}
              aria-pressed={days.includes(index)}
              aria-label={name.long}
              onClick={() => toggle(index)}
            >
              <span data-part="mark" aria-hidden="true">
                {name.short.slice(0, 2)}
              </span>
            </button>
          ))}
        </div>
        <div data-part="presets">
          <button
            type="button"
            data-part="preset"
            onClick={() => apply(WORKWEEK)}
          >
            Пятидневка
          </button>
          <button
            type="button"
            data-part="preset"
            onClick={() => apply(SIXDAY)}
          >
            Шестидневка
          </button>
          <button type="button" data-part="preset" onClick={() => apply([])}>
            Снять всё
          </button>
        </div>
        <p data-part="total" aria-live="polite">
          {days.length === 0 ? (
            "Рабочих дней нет — график пустой"
          ) : (
            <>
              <b>{days.length}</b>{" "}
              {pluralize(days.length, ["день", "дня", "дней"])} ×{" "}
              <b>{hoursPerDay}</b> ч = <b>{total}</b>{" "}
              {pluralize(total, ["час", "часа", "часов"])} в неделю
            </>
          )}
        </p>
      </fieldset>
    </>
  )
}
