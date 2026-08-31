"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Range004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultFrom?: number
  defaultTo?: number
  unit?: string
  accent?: string
}

// Идея компонента: у диапазона две руки — ползунок и поля по краям. Ползунком
// удобно прикидывать, но попасть им ровно в 25 000 нельзя, а поле принимает
// точное число мгновенно. Значения здесь одни и те же: правка поля двигает
// ручку и наоборот. Поля хранят строки, поэтому во время набора можно очистить
// содержимое, не получив ноль; приведение к границам и к соседней ручке
// происходит по уходу из поля, а не на каждой букве.
const STYLES = `
:where([data-vibeui-block="range-004"]){
--vibeui-range-004-surface:oklch(1 0 0);
--vibeui-range-004-field:oklch(0.985 0.002 265);
--vibeui-range-004-shell:oklch(0.9 0.006 265);
--vibeui-range-004-fg:oklch(0.23 0.014 265);
--vibeui-range-004-muted:oklch(0.55 0.014 265);
--vibeui-range-004-border:oklch(0.88 0.008 265);
--vibeui-range-004-track:oklch(0.93 0.006 265);
--vibeui-range-004-accent:oklch(0.55 0.16 145);
--vibeui-range-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-004-from:0%;
--vibeui-range-004-to:100%;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="range-004"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-004-surface);
border:1px solid var(--vibeui-range-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-004-font);color:var(--vibeui-range-004-fg);
}
[data-vibeui-block="range-004"] [data-part="label"]{margin:0;font-size:0.8125rem;font-weight:650}
/* Поля по краям: ползунком в 25 000 не попасть, а полем — сразу. */
[data-vibeui-block="range-004"] [data-part="fields"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="range-004"] [data-part="cell"]{
flex:1 1 0;min-width:0;display:flex;align-items:center;gap:0.25rem;
padding:0 0.625rem;box-sizing:border-box;height:2.5rem;
border:1px solid var(--vibeui-range-004-border);border-radius:0.625rem;
background:var(--vibeui-range-004-field);
}
[data-vibeui-block="range-004"] [data-part="cell"]:focus-within{
border-color:var(--vibeui-range-004-accent);
box-shadow:0 0 0 2px oklch(0.55 0.16 145 / 18%);
}
[data-vibeui-block="range-004"] input[type="number"]{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="range-004"] input[type="number"]::-webkit-outer-spin-button,
[data-vibeui-block="range-004"] input[type="number"]::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="range-004"] [data-part="unit"]{
flex:none;font-size:0.75rem;font-weight:650;color:var(--vibeui-range-004-muted);
}
[data-vibeui-block="range-004"] [data-part="dash"]{flex:none;color:var(--vibeui-range-004-muted)}
[data-vibeui-block="range-004"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-004"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-004-track) var(--vibeui-range-004-from),
var(--vibeui-range-004-accent) var(--vibeui-range-004-from),
var(--vibeui-range-004-accent) var(--vibeui-range-004-to),
var(--vibeui-range-004-track) var(--vibeui-range-004-to));
}
[data-vibeui-block="range-004"] input[type="range"]{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-004"] input[type="range"]::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-004"] input[type="range"]::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-004"] input[type="range"]::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-004-surface);border:2px solid var(--vibeui-range-004-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 25%);
}
[data-vibeui-block="range-004"] input[type="range"]::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-004-surface);border:2px solid var(--vibeui-range-004-accent);
}
[data-vibeui-block="range-004"] input[type="range"]:focus-visible{outline:2px solid var(--vibeui-range-004-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-004"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-004-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Диапазон с полями ввода по краям: ползунок и числа правят одно значение.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range004({
  label = "Зарплатные ожидания",
  min = 0,
  max = 400000,
  step = 5000,
  defaultFrom = 120000,
  defaultTo = 260000,
  unit = "₽",
  accent,
  className,
  style,
  ...props
}: Range004Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  // Строки на время набора: числовое состояние превращает пустое поле в ноль.
  const [fromText, setFromText] = useState(String(defaultFrom))
  const [toText, setToText] = useState(String(defaultTo))

  const percent = (value: number) => `${((value - min) / (max - min)) * 100}%`

  const applyFrom = (value: number) => {
    const next = Math.min(Math.max(min, value), to - step)
    setFrom(next)
    setFromText(String(next))
  }

  const applyTo = (value: number) => {
    const next = Math.max(Math.min(max, value), from + step)
    setTo(next)
    setToText(String(next))
  }

  const palette = {
    "--vibeui-range-004-from": percent(from),
    "--vibeui-range-004-to": percent(to),
    ...(accent ? { "--vibeui-range-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="range-004"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <div data-part="fields">
          <div data-part="cell">
            <input
              id={`${id}-from`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              step={step}
              value={fromText}
              aria-label={`${label}: от`}
              onChange={(event) => setFromText(event.target.value)}
              onBlur={() => applyFrom(Number(fromText) || min)}
            />
            <span data-part="unit" aria-hidden="true">
              {unit}
            </span>
          </div>
          <span data-part="dash" aria-hidden="true">
            —
          </span>
          <div data-part="cell">
            <input
              id={`${id}-to`}
              type="number"
              inputMode="numeric"
              min={min}
              max={max}
              step={step}
              value={toText}
              aria-label={`${label}: до`}
              onChange={(event) => setToText(event.target.value)}
              onBlur={() => applyTo(Number(toText) || max)}
            />
            <span data-part="unit" aria-hidden="true">
              {unit}
            </span>
          </div>
        </div>
        <div data-part="rail">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={from}
            aria-label={`${label}: ползунок «от»`}
            onChange={(event) => applyFrom(Number(event.target.value))}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={to}
            aria-label={`${label}: ползунок «до»`}
            onChange={(event) => applyTo(Number(event.target.value))}
          />
        </div>
        <p data-part="scale">
          <span>
            {min.toLocaleString("ru-RU")} {unit}
          </span>
          <span>
            {max.toLocaleString("ru-RU")} {unit}
          </span>
        </p>
      </div>
    </>
  )
}
