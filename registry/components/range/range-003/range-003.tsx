"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Range003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  startDate?: string
  days?: number
  defaultFrom?: number
  defaultTo?: number
  accent?: string
}

// Идея компонента: диапазон дат ползунком, а не двумя календарями. Когда даты
// плавающие — «где-то в конце сентября, на неделю» — календарь заставляет
// решать точно то, что человек ещё не решил, а ползунок позволяет прикинуть.
// Внутри двигаются номера дней от базовой даты: целые числа сравниваются и
// шагают без арифметики с датами. Даты собираются через Date.UTC и печатаются
// в UTC — иначе на минусовых поясах подпись съедет на день назад.
const STYLES = `
:where([data-vibeui-block="range-003"]){
--vibeui-range-003-surface:oklch(1 0 0);
--vibeui-range-003-shell:oklch(0.9 0.006 265);
--vibeui-range-003-fg:oklch(0.23 0.014 265);
--vibeui-range-003-muted:oklch(0.55 0.014 265);
--vibeui-range-003-track:oklch(0.93 0.006 265);
--vibeui-range-003-accent:oklch(0.52 0.16 210);
--vibeui-range-003-soft:oklch(0.52 0.16 210 / 12%);
--vibeui-range-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-003-from:0%;
--vibeui-range-003-to:100%;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="range-003"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-003-surface);
border:1px solid var(--vibeui-range-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-003-font);color:var(--vibeui-range-003-fg);
}
[data-vibeui-block="range-003"] [data-part="label"]{margin:0;font-size:0.8125rem;font-weight:650}
/* Даты крупно: ползунок точен, но читают всё равно подпись. */
[data-vibeui-block="range-003"] [data-part="dates"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin:0;
}
[data-vibeui-block="range-003"] [data-part="date"]{
padding:0.3125rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-range-003-soft);color:var(--vibeui-range-003-accent);
font-size:0.875rem;font-weight:700;
}
[data-vibeui-block="range-003"] [data-part="nights"]{font-size:0.6875rem;color:var(--vibeui-range-003-muted)}
[data-vibeui-block="range-003"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-003"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-003-track) var(--vibeui-range-003-from),
var(--vibeui-range-003-accent) var(--vibeui-range-003-from),
var(--vibeui-range-003-accent) var(--vibeui-range-003-to),
var(--vibeui-range-003-track) var(--vibeui-range-003-to));
}
[data-vibeui-block="range-003"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-003"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-003"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-003"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-003-surface);border:2px solid var(--vibeui-range-003-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 25%);
}
[data-vibeui-block="range-003"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-003-surface);border:2px solid var(--vibeui-range-003-accent);
}
[data-vibeui-block="range-003"] input:focus-visible{outline:2px solid var(--vibeui-range-003-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-003"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-003"] *{animation:none!important;transition:none!important}}
`

// Дата собирается в UTC и печатается в UTC: иначе на минусовых поясах подпись
// съезжает на день назад.
function dayLabel(startDate: string, offset: number) {
  const [year, month, day] = startDate.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + offset))
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
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
 * Диапазон дат ползунком: внутри номера дней, снаружи подписи датами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range003({
  label = "Когда поедем",
  startDate = "2026-09-01",
  days = 60,
  defaultFrom = 12,
  defaultTo = 19,
  accent,
  className,
  style,
  ...props
}: Range003Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const percent = (value: number) => `${(value / days) * 100}%`

  const palette = {
    "--vibeui-range-003-from": percent(from),
    "--vibeui-range-003-to": percent(to),
    ...(accent ? { "--vibeui-range-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="range-003"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="dates" aria-live="polite">
          <span data-part="date">{dayLabel(startDate, from)}</span>
          <span data-part="nights">
            {to - from} {nightsWord(to - from)}
          </span>
          <span data-part="date">{dayLabel(startDate, to)}</span>
        </p>
        <div data-part="rail">
          <input
            type="range"
            min={0}
            max={days}
            step={1}
            value={from}
            aria-label="Дата заезда"
            aria-valuetext={dayLabel(startDate, from)}
            onChange={(event) =>
              setFrom(Math.min(Number(event.target.value), to - 1))
            }
          />
          <input
            type="range"
            min={0}
            max={days}
            step={1}
            value={to}
            aria-label="Дата выезда"
            aria-valuetext={dayLabel(startDate, to)}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + 1))
            }
          />
        </div>
        <p data-part="scale">
          <span>{dayLabel(startDate, 0)}</span>
          <span>{dayLabel(startDate, days)}</span>
        </p>
      </div>
    </>
  )
}
