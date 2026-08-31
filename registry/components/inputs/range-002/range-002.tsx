"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Range002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultFrom?: number
  defaultTo?: number
  histogram?: number[]
  unit?: string
  accent?: string
}

// Идея компонента: над ползунком стоит гистограмма предложений. Голый диапазон
// цен ничего не говорит о рынке: выбрав «до 5 000», пользователь не знает, что
// под этот фильтр попадают три товара из тысячи. Столбики вне выбранного
// отрезка приглушены, поэтому видно и то, что отсекли. Гистограмма считается
// снаружи и приходит массивом: рисовать её по случайным числам нельзя — она
// обязана соответствовать выдаче.
const STYLES = `
:where([data-vibeui-block="range-002"]){
--vibeui-range-002-surface:oklch(1 0 0);
--vibeui-range-002-shell:oklch(0.9 0.006 265);
--vibeui-range-002-fg:oklch(0.23 0.014 265);
--vibeui-range-002-muted:oklch(0.55 0.014 265);
--vibeui-range-002-track:oklch(0.93 0.006 265);
--vibeui-range-002-accent:oklch(0.55 0.19 275);
--vibeui-range-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-002-from:0%;
--vibeui-range-002-to:100%;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="range-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-002-surface);
border:1px solid var(--vibeui-range-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-002-font);color:var(--vibeui-range-002-fg);
}
[data-vibeui-block="range-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.8125rem;
}
[data-vibeui-block="range-002"] [data-part="value"]{font-weight:700;font-variant-numeric:tabular-nums}
/* Гистограмма: диапазон без плотности предложений ничего не говорит о рынке. */
[data-vibeui-block="range-002"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.0625rem;height:3rem;
}
[data-vibeui-block="range-002"] [data-part="bar"]{
flex:1 1 0;border-radius:0.125rem 0.125rem 0 0;
background:var(--vibeui-range-002-track);
transition:background-color .16s ease;
}
[data-vibeui-block="range-002"] [data-part="bar"][data-in="true"]{background:var(--vibeui-range-002-accent)}
[data-vibeui-block="range-002"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-002"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-002-track) var(--vibeui-range-002-from),
var(--vibeui-range-002-accent) var(--vibeui-range-002-from),
var(--vibeui-range-002-accent) var(--vibeui-range-002-to),
var(--vibeui-range-002-track) var(--vibeui-range-002-to));
}
[data-vibeui-block="range-002"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-002"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-002"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-002"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-002-surface);border:2px solid var(--vibeui-range-002-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 25%);
}
[data-vibeui-block="range-002"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-002-surface);border:2px solid var(--vibeui-range-002-accent);
}
[data-vibeui-block="range-002"] input:focus-visible{outline:2px solid var(--vibeui-range-002-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-002"] [data-part="foot"]{
display:flex;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-002-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HISTOGRAM = [
  4, 9, 17, 28, 41, 55, 62, 58, 47, 39, 30, 24, 18, 12, 7, 3,
]

/**
 * Диапазон цены с гистограммой предложений: вне отрезка столбики приглушены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range002({
  label = "Цена за ночь",
  min = 0,
  max = 16000,
  step = 500,
  defaultFrom = 3000,
  defaultTo = 11000,
  histogram = DEFAULT_HISTOGRAM,
  unit = "₽",
  accent,
  className,
  style,
  ...props
}: Range002Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const peak = Math.max(...histogram, 1)
  const span = max - min || 1
  const percent = (value: number) => `${((value - min) / span) * 100}%`
  const inside = histogram.reduce((sum, amount, index) => {
    const start = min + (span / histogram.length) * index
    const end = start + span / histogram.length
    return end > from && start < to ? sum + amount : sum
  }, 0)

  const palette = {
    "--vibeui-range-002-from": percent(from),
    "--vibeui-range-002-to": percent(to),
    ...(accent ? { "--vibeui-range-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="range-002"
        className={className}
        style={palette}
      >
        <p data-part="head">
          {label}
          <span data-part="value">
            {from.toLocaleString("ru-RU")} — {to.toLocaleString("ru-RU")} {unit}
          </span>
        </p>
        <div data-part="chart" aria-hidden="true">
          {histogram.map((amount, index) => {
            const start = min + (span / histogram.length) * index
            const end = start + span / histogram.length
            return (
              <span
                key={start}
                data-part="bar"
                data-in={end > from && start < to}
                style={{ height: `${Math.max(6, (amount / peak) * 100)}%` }}
              />
            )
          })}
        </div>
        <div data-part="rail">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={from}
            aria-label={`${label}: от`}
            onChange={(event) =>
              setFrom(Math.min(Number(event.target.value), to - step))
            }
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={to}
            aria-label={`${label}: до`}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + step))
            }
          />
        </div>
        <p data-part="foot" aria-live="polite">
          <span>
            {min.toLocaleString("ru-RU")} {unit}
          </span>
          <span>Подходит вариантов: {inside}</span>
          <span>
            {max.toLocaleString("ru-RU")} {unit}
          </span>
        </p>
      </div>
    </>
  )
}
