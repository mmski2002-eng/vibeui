"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Date003Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  defaultFrom?: string
  defaultTo?: string
  min?: string
  accent?: string
}

// Идея компонента: диапазон двумя полями, где порядок дат чинится сам. Второму
// полю ставится min по первому, поэтому системный календарь физически не даёт
// выбрать дату раньше начала. Если начало сдвинули вперёд уже выбранного конца,
// конец подтягивается за ним, а не превращается в ошибку: перевыбирать обе даты
// из-за одной правки — обидно. Число ночей считается тут же: диапазон дат
// пользователь всё равно мысленно переводит в длительность.
const STYLES = `
:where([data-vibeui-block="date-003"]){
--vibeui-date-003-surface:oklch(1 0 0);
--vibeui-date-003-field:oklch(1 0 0);
--vibeui-date-003-shell:oklch(0.9 0.006 265);
--vibeui-date-003-fg:oklch(0.23 0.014 265);
--vibeui-date-003-muted:oklch(0.55 0.014 265);
--vibeui-date-003-border:oklch(0.88 0.008 265);
--vibeui-date-003-accent:oklch(0.52 0.16 210);
--vibeui-date-003-soft:oklch(0.52 0.16 210 / 10%);
--vibeui-date-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поля показывают поверх любого фона. */
[data-vibeui-block="date-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-date-003-surface);
border:1px solid var(--vibeui-date-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-date-003-font);color:var(--vibeui-date-003-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="date-003"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="date-003"] [data-part="pair"]{clear:both;display:flex;gap:0.5rem;flex-wrap:wrap}
[data-vibeui-block="date-003"] [data-part="cell"]{
flex:1 1 8rem;min-width:0;display:flex;flex-direction:column;gap:0.25rem;
}
[data-vibeui-block="date-003"] label{font-size:0.6875rem;font-weight:650;color:var(--vibeui-date-003-muted);text-transform:uppercase;letter-spacing:0.04em}
[data-vibeui-block="date-003"] input{
width:100%;box-sizing:border-box;height:2.625rem;padding:0 0.625rem;
background:var(--vibeui-date-003-field);color:inherit;
border:1px solid var(--vibeui-date-003-border);border-radius:0.625rem;
font:inherit;font-size:0.875rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-003"] input:focus-visible{
outline:2px solid var(--vibeui-date-003-accent);outline-offset:1px;border-color:var(--vibeui-date-003-accent);
}
[data-vibeui-block="date-003"] input::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.55}
[data-vibeui-block="date-003"] input::-webkit-calendar-picker-indicator:hover{opacity:1}
/* Длительность важнее самих дат: её всё равно считают в уме. */
[data-vibeui-block="date-003"] [data-part="summary"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
margin:0;padding:0.5rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-date-003-soft);
font-size:0.8125rem;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="date-003"] [data-part="nights"]{font-weight:700;color:var(--vibeui-date-003-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="date-003"] *{animation:none!important;transition:none!important}}
`

const DAY = 86400000

function nightsBetween(from: string, to: string) {
  const start = Date.parse(from)
  const end = Date.parse(to)
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0
  return Math.max(0, Math.round((end - start) / DAY))
}

function plusDay(date: string) {
  const next = Date.parse(date)
  if (!Number.isFinite(next)) return date
  return new Date(next + DAY).toISOString().slice(0, 10)
}

function nightsWord(count: number) {
  const tail = count % 10
  const teen = count % 100
  if (teen > 10 && teen < 20) return "ночей"
  if (tail === 1) return "ночь"
  if (tail > 1 && tail < 5) return "ночи"
  return "ночей"
}

/**
 * Диапазон дат двумя полями: порядок чинится сам, длительность считается сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Date003({
  legend = "Даты проживания",
  defaultFrom = "2026-09-14",
  defaultTo = "2026-09-19",
  min = "2026-09-01",
  accent,
  className,
  style,
  ...props
}: Date003Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const nights = nightsBetween(from, to)

  const palette = {
    ...(accent ? { "--vibeui-date-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-date-003" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="date-003"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="pair">
          <div data-part="cell">
            <label htmlFor={`${id}-from`}>Заезд</label>
            <input
              id={`${id}-from`}
              type="date"
              value={from}
              min={min}
              onChange={(event) => {
                const next = event.target.value
                setFrom(next)
                // Конец подтягивается за началом: перевыбирать обе даты обидно.
                if (next && next >= to) setTo(plusDay(next))
              }}
            />
          </div>
          <div data-part="cell">
            <label htmlFor={`${id}-to`}>Выезд</label>
            <input
              id={`${id}-to`}
              type="date"
              value={to}
              min={plusDay(from)}
              onChange={(event) => setTo(event.target.value)}
            />
          </div>
        </div>
        <p data-part="summary" aria-live="polite">
          <span>Длительность</span>
          <span data-part="nights">
            {nights} {nightsWord(nights)}
          </span>
        </p>
      </fieldset>
    </>
  )
}
