"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Calendar008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  defaultYear?: number
  defaultMonth?: number
  locale?: string
  onChange?: (value: { year: number; month: number }) => void
  accent?: string
}

// Идея компонента: выбор месяца без дней. Отчёты, зарплата и планы живут
// месяцами, и пролистывать для этого сетку из тридцати чисел — лишний шаг.
// Год переключается стрелками рядом, а не отдельным списком: между «март
// 2025» и «март 2026» человек ходит чаще, чем между произвольными годами.
const STYLES = `
:where([data-vibeui-block="calendar-008"]){
--vibeui-calendar-008-bg:oklch(1 0 0);
--vibeui-calendar-008-fg:oklch(0.24 0.014 265);
--vibeui-calendar-008-muted:oklch(0.6 0.014 265);
--vibeui-calendar-008-border:oklch(0.91 0.006 265);
--vibeui-calendar-008-hover:oklch(0.96 0.004 265);
--vibeui-calendar-008-accent:oklch(0.55 0.17 265);
--vibeui-calendar-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="calendar-008"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-calendar-008-bg);
border:1px solid var(--vibeui-calendar-008-border);border-radius:0.875rem;
color:var(--vibeui-calendar-008-fg);font-family:var(--vibeui-calendar-008-font);
}
[data-vibeui-block="calendar-008"] [data-part="head"]{display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
[data-vibeui-block="calendar-008"] [data-part="year"]{font-size:0.9375rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="calendar-008"] [data-part="nav"]{display:flex;gap:0.25rem}
[data-vibeui-block="calendar-008"] [data-part="nav"] button{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;padding:0;
border:1px solid var(--vibeui-calendar-008-border);border-radius:0.5rem;
background:transparent;color:inherit;
}
[data-vibeui-block="calendar-008"] [data-part="nav"] button:hover{background:var(--vibeui-calendar-008-hover)}
[data-vibeui-block="calendar-008"] [data-part="nav"] button:focus-visible{outline:2px solid var(--vibeui-calendar-008-accent);outline-offset:2px}
[data-vibeui-block="calendar-008"] [data-part="arrow"]{
width:0.375rem;height:0.375rem;
border-left:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:rotate(45deg) translate(0.0625rem,-0.0625rem);
}
[data-vibeui-block="calendar-008"] [data-part="arrow"][data-dir="next"]{transform:rotate(-135deg) translate(0.0625rem,-0.0625rem)}
/* Три колонки на четыре строки: месяцы читаются кварталами. */
[data-vibeui-block="calendar-008"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(3,1fr);gap:0.375rem;
}
[data-vibeui-block="calendar-008"] [data-part="grid"] button{
appearance:none;cursor:pointer;
height:2.25rem;padding:0;border-radius:0.5rem;
border:1px solid transparent;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-transform:capitalize;
}
[data-vibeui-block="calendar-008"] [data-part="grid"] button:hover{background:var(--vibeui-calendar-008-hover)}
[data-vibeui-block="calendar-008"] [data-part="grid"] button:focus-visible{outline:2px solid var(--vibeui-calendar-008-accent);outline-offset:-2px}
[data-vibeui-block="calendar-008"] [data-part="grid"] button[data-current="true"]{border-color:var(--vibeui-calendar-008-border);font-weight:650}
[data-vibeui-block="calendar-008"] [data-part="grid"] button[aria-pressed="true"]{
border-color:transparent;background:var(--vibeui-calendar-008-accent);color:oklch(0.99 0.01 265);font-weight:650;
}
[data-vibeui-block="calendar-008"] [data-part="picked"]{font-size:0.75rem;color:var(--vibeui-calendar-008-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="calendar-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Выбор месяца и года без сетки дней.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Calendar008({
  defaultYear = 2026,
  defaultMonth = 3,
  locale = "ru-RU",
  onChange,
  accent,
  className,
  style,
  ...props
}: Calendar008Props) {
  const [year, setYear] = useState(defaultYear)
  const [value, setValue] = useState({
    year: defaultYear,
    month: defaultMonth,
  })

  const short = new Intl.DateTimeFormat(locale, { month: "short" })
  const long = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  })
  const now = new Date()

  const palette = {
    ...(accent ? { "--vibeui-calendar-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-calendar-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="calendar-008"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <span data-part="year">{year}</span>
          <span data-part="nav">
            <button
              type="button"
              aria-label={`Год ${year - 1}`}
              onClick={() => setYear(year - 1)}
            >
              <span data-part="arrow" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={`Год ${year + 1}`}
              onClick={() => setYear(year + 1)}
            >
              <span data-part="arrow" data-dir="next" aria-hidden="true" />
            </button>
          </span>
        </div>
        <div data-part="grid">
          {Array.from({ length: 12 }, (_, index) => {
            const date = new Date(year, index, 1)
            const selected = value.year === year && value.month === index + 1

            return (
              <button
                key={index}
                type="button"
                aria-pressed={selected}
                aria-label={long.format(date)}
                data-current={
                  now.getFullYear() === year && now.getMonth() === index
                }
                onClick={() => {
                  const next = { year, month: index + 1 }
                  setValue(next)
                  onChange?.(next)
                }}
              >
                {short.format(date)}
              </button>
            )
          })}
        </div>
        <p data-part="picked">
          Выбрано: {long.format(new Date(value.year, value.month - 1, 1))}
        </p>
      </div>
    </>
  )
}
