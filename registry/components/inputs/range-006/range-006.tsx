"use client"

import { useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Range006Props = Omit<
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

// Идея компонента: диапазон площади с открытым верхом. Любая шкала где-то
// кончается, и на последнем делении фильтр начинает врать: «до 200 м²» тихо
// отсекает дом на 300. Здесь верхняя ручка на максимуме означает «и больше», о
// чём написано словами и сказано через aria-valuetext. Единица подписана у
// каждого края, а не один раз в заголовке: числа на дорожке читают отдельно от
// подписи, и «40 — 120» без «м²» превращается в загадку.
const STYLES = `
:where([data-vibeui-block="range-006"]){
--vibeui-range-006-surface:oklch(1 0 0);
--vibeui-range-006-shell:oklch(0.9 0.006 265);
--vibeui-range-006-fg:oklch(0.23 0.014 265);
--vibeui-range-006-muted:oklch(0.55 0.014 265);
--vibeui-range-006-track:oklch(0.93 0.006 265);
--vibeui-range-006-accent:oklch(0.52 0.14 180);
--vibeui-range-006-soft:oklch(0.52 0.14 180 / 12%);
--vibeui-range-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-006-from:0%;
--vibeui-range-006-to:100%;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="range-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-006-surface);
border:1px solid var(--vibeui-range-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-006-font);color:var(--vibeui-range-006-fg);
}
[data-vibeui-block="range-006"] [data-part="label"]{margin:0;font-size:0.8125rem;font-weight:650}
/* Единица у каждого края: «40 — 120» без «м²» ничего не значит. */
[data-vibeui-block="range-006"] [data-part="values"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin:0;
}
[data-vibeui-block="range-006"] [data-part="chip"]{
padding:0.3125rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-range-006-soft);color:var(--vibeui-range-006-accent);
font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="range-006"] [data-part="dash"]{flex:1 1 auto;height:1px;background:var(--vibeui-range-006-track)}
[data-vibeui-block="range-006"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-006"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-006-track) var(--vibeui-range-006-from),
var(--vibeui-range-006-accent) var(--vibeui-range-006-from),
var(--vibeui-range-006-accent) var(--vibeui-range-006-to),
var(--vibeui-range-006-track) var(--vibeui-range-006-to));
}
[data-vibeui-block="range-006"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-006"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-006"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-006"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-006-surface);border:2px solid var(--vibeui-range-006-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 25%);
}
[data-vibeui-block="range-006"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-006-surface);border:2px solid var(--vibeui-range-006-accent);
}
[data-vibeui-block="range-006"] input:focus-visible{outline:2px solid var(--vibeui-range-006-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-006"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-range-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-006"] *{animation:none!important;transition:none!important}}
`

/**
 * Диапазон площади с единицами и открытым верхом: максимум значит «и больше».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range006({
  label = "Площадь дома",
  min = 20,
  max = 200,
  step = 5,
  defaultFrom = 40,
  defaultTo = 120,
  unit = "м²",
  accent,
  className,
  style,
  ...props
}: Range006Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const percent = (value: number) => `${((value - min) / (max - min)) * 100}%`
  // Верх шкалы означает «и больше»: иначе фильтр тихо отсекает крупные дома.
  const openEnded = to >= max
  const topText = openEnded ? `${max} ${unit} и больше` : `${to} ${unit}`

  const palette = {
    "--vibeui-range-006-from": percent(from),
    "--vibeui-range-006-to": percent(to),
    ...(accent ? { "--vibeui-range-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="range-006"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="values" aria-live="polite">
          <span data-part="chip">
            от {from} {unit}
          </span>
          <span data-part="dash" aria-hidden="true" />
          <span data-part="chip">{topText}</span>
        </p>
        <div data-part="rail">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={from}
            aria-label={`${label}: от`}
            aria-valuetext={`от ${from} ${unit}`}
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
            aria-valuetext={topText}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + step))
            }
          />
        </div>
        <p data-part="note">
          {openEnded
            ? "Верхняя граница снята: в выдачу попадут и самые большие дома."
            : `Шаг ${step} ${unit}. Доведите правую ручку до края, чтобы снять верхнюю границу.`}
        </p>
      </div>
    </>
  )
}
