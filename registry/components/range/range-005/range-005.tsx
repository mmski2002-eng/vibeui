"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Range005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  stops?: string[]
  defaultFrom?: number
  defaultTo?: number
  accent?: string
}

// Идея компонента: диапазон по подписанным делениям, а не по числам. «Студия»
// и «5 и больше» — не числа, но лежат на одной шкале, и ползунок ходит по их
// номерам. Деления подписаны прямо под дорожкой, поэтому промежуточных
// значений не существует: попасть между «двумя» и «тремя» комнатами нельзя ни
// мышью, ни стрелками. Подписи выровнены по центрам делений через долю ширины,
// а не расставлены поровну: иначе крайние подписи уезжают за края дорожки.
const STYLES = `
:where([data-vibeui-block="range-005"]){
--vibeui-range-005-surface:oklch(1 0 0);
--vibeui-range-005-shell:oklch(0.9 0.006 265);
--vibeui-range-005-fg:oklch(0.23 0.014 265);
--vibeui-range-005-muted:oklch(0.55 0.014 265);
--vibeui-range-005-track:oklch(0.93 0.006 265);
--vibeui-range-005-accent:oklch(0.5 0.17 320);
--vibeui-range-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-005-from:0%;
--vibeui-range-005-to:100%;
--vibeui-range-005-gutter:8%;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="range-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-005-surface);
border:1px solid var(--vibeui-range-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-005-font);color:var(--vibeui-range-005-fg);
}
[data-vibeui-block="range-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.8125rem;
}
[data-vibeui-block="range-005"] [data-part="value"]{font-weight:700;color:var(--vibeui-range-005-accent)}
/* Отступы по половине деления: крайние подписи иначе уезжают за дорожку. */
[data-vibeui-block="range-005"] [data-part="area"]{
position:relative;padding:0 var(--vibeui-range-005-gutter);
}
[data-vibeui-block="range-005"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-005"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-005-track) var(--vibeui-range-005-from),
var(--vibeui-range-005-accent) var(--vibeui-range-005-from),
var(--vibeui-range-005-accent) var(--vibeui-range-005-to),
var(--vibeui-range-005-track) var(--vibeui-range-005-to));
}
[data-vibeui-block="range-005"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-005"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-005"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-005"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-005-surface);border:2px solid var(--vibeui-range-005-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 25%);
}
[data-vibeui-block="range-005"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-005-surface);border:2px solid var(--vibeui-range-005-accent);
}
[data-vibeui-block="range-005"] input:focus-visible{outline:2px solid var(--vibeui-range-005-accent);outline-offset:4px;border-radius:0.5rem}
/* Подписи делений: промежуточных значений на такой шкале не существует. */
[data-vibeui-block="range-005"] [data-part="ticks"]{display:flex;margin:0.25rem 0 0}
[data-vibeui-block="range-005"] [data-part="tick"]{
flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:0.1875rem;
font-size:0.6875rem;color:var(--vibeui-range-005-muted);
}
[data-vibeui-block="range-005"] [data-part="tick"]::before{
content:"";width:1px;height:0.3125rem;background:var(--vibeui-range-005-track);
}
[data-vibeui-block="range-005"] [data-part="tick"][data-in="true"]{color:var(--vibeui-range-005-fg);font-weight:650}
[data-vibeui-block="range-005"] [data-part="tick"][data-in="true"]::before{background:var(--vibeui-range-005-accent)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STOPS = ["Студия", "1", "2", "3", "4", "5 и больше"]

/**
 * Диапазон по подписанным делениям: ползунок ходит по номерам остановок.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range005({
  label = "Комнат в квартире",
  stops = DEFAULT_STOPS,
  defaultFrom = 1,
  defaultTo = 3,
  accent,
  className,
  style,
  ...props
}: Range005Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const last = stops.length - 1
  const percent = (value: number) => `${(value / last) * 100}%`

  const palette = {
    "--vibeui-range-005-from": percent(from),
    "--vibeui-range-005-to": percent(to),
    "--vibeui-range-005-gutter": `${50 / stops.length}%`,
    ...(accent ? { "--vibeui-range-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="range-005"
        className={className}
        style={palette}
      >
        <p data-part="head">
          {label}
          <span data-part="value" aria-live="polite">
            {from === to ? stops[from] : `${stops[from]} — ${stops[to]}`}
          </span>
        </p>
        <div data-part="area">
          <div data-part="rail">
            <input
              type="range"
              min={0}
              max={last}
              step={1}
              value={from}
              aria-label={`${label}: от`}
              aria-valuetext={stops[from]}
              onChange={(event) =>
                setFrom(Math.min(Number(event.target.value), to))
              }
            />
            <input
              type="range"
              min={0}
              max={last}
              step={1}
              value={to}
              aria-label={`${label}: до`}
              aria-valuetext={stops[to]}
              onChange={(event) =>
                setTo(Math.max(Number(event.target.value), from))
              }
            />
          </div>
        </div>
        <p data-part="ticks" aria-hidden="true">
          {stops.map((stop, index) => (
            <span
              key={stop}
              data-part="tick"
              data-in={index >= from && index <= to}
            >
              {stop}
            </span>
          ))}
        </p>
      </div>
    </>
  )
}
