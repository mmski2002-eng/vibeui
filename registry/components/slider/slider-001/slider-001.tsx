"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  accent?: string
}

// Идея компонента: ползунок на нативном input[type=range]. Свой ползунок пришлось
// бы учить перетаскиванию, клавиатуре и касаниям — браузер умеет это сам.
// Пройденная часть дорожки закрашивается градиентом по проценту, поэтому
// значение видно и без подписи, а подпись всё равно есть: цифра точнее позиции.
const STYLES = `
:where([data-vibeui-block="slider-001"]){
--vibeui-slider-001-bg:oklch(1 0 0);
--vibeui-slider-001-fg:oklch(0.24 0.014 265);
--vibeui-slider-001-muted:oklch(0.56 0.014 265);
--vibeui-slider-001-border:oklch(0.9 0.006 265);
--vibeui-slider-001-track:oklch(0.92 0.006 265);
--vibeui-slider-001-accent:oklch(0.55 0.2 262);
--vibeui-slider-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-001-fill:50%;
}
[data-vibeui-block="slider-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-001-bg);
border:1px solid var(--vibeui-slider-001-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-001-font);color:var(--vibeui-slider-001-fg);
}
[data-vibeui-block="slider-001"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
font-size:0.875rem;
}
/* Цифра рядом с ползунком: позиция ручки не читается точнее числа. */
[data-vibeui-block="slider-001"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="slider-001"] [data-part="scale"]{
display:flex;justify-content:space-between;
font-size:0.6875rem;color:var(--vibeui-slider-001-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-001"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;
}
[data-vibeui-block="slider-001"] input::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-001-accent) var(--vibeui-slider-001-fill),var(--vibeui-slider-001-track) var(--vibeui-slider-001-fill));
}
[data-vibeui-block="slider-001"] input::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-001-accent) var(--vibeui-slider-001-fill),var(--vibeui-slider-001-track) var(--vibeui-slider-001-fill));
}
[data-vibeui-block="slider-001"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-slider-001-bg);border:2px solid var(--vibeui-slider-001-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 25%);
}
[data-vibeui-block="slider-001"] input::-moz-range-thumb{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-001-bg);border:2px solid var(--vibeui-slider-001-accent);
}
[data-vibeui-block="slider-001"] input:focus-visible{outline:2px solid var(--vibeui-slider-001-accent);outline-offset:4px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ползунок на нативном range: закрашенная дорожка и цифра рядом с подписью.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider001({
  label = "Бюджет проекта",
  min = 10,
  max = 200,
  step = 5,
  defaultValue = 80,
  unit = " тыс. ₽",
  accent,
  className,
  style,
  ...props
}: Slider001Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const fill = `${((value - min) / (max - min)) * 100}%`

  const palette = {
    "--vibeui-slider-001-fill": fill,
    ...(accent ? { "--vibeui-slider-001-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-001"
        className={className}
        style={palette}
      >
        <label data-part="head" htmlFor={id}>
          {label}
          <span data-part="value">
            {value}
            {unit}
          </span>
        </label>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
        />
        <p data-part="scale">
          <span>
            {min}
            {unit}
          </span>
          <span>
            {max}
            {unit}
          </span>
        </p>
      </div>
    </>
  )
}
