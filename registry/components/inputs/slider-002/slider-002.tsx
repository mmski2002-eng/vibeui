"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  suffix?: string
  accent?: string
}

// Идея компонента: цифра едет вместе с бегунком. Значение в углу карточки
// заставляет глаз прыгать между ручкой и подписью; пузырь стоит ровно над
// ручкой, поэтому цифру видно, не отрывая пальца. Сдвиг считается по
// проценту с поправкой на половину ручки — иначе на краях пузырь уезжает.
const STYLES = `
:where([data-vibeui-block="slider-002"]){
--vibeui-slider-002-bg:oklch(1 0 0);
--vibeui-slider-002-fg:oklch(0.22 0.014 265);
--vibeui-slider-002-muted:oklch(0.55 0.014 265);
--vibeui-slider-002-border:oklch(0.9 0.006 265);
--vibeui-slider-002-track:oklch(0.92 0.006 265);
--vibeui-slider-002-accent:oklch(0.56 0.2 25);
--vibeui-slider-002-on-accent:oklch(1 0 0);
--vibeui-slider-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-002-fill:50%;
}
[data-vibeui-block="slider-002"]{
display:flex;flex-direction:column;gap:0.25rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-002-bg);
border:1px solid var(--vibeui-slider-002-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-002-font);color:var(--vibeui-slider-002-fg);
}
[data-vibeui-block="slider-002"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="slider-002"] [data-part="rail"]{position:relative;padding-top:2.25rem}
/* Пузырь позиционируется по проценту, но сдвигается на половину ширины
   ручки: без этой поправки на 0% и 100% он висит мимо. */
[data-vibeui-block="slider-002"] [data-part="bubble"]{
position:absolute;top:0;left:var(--vibeui-slider-002-fill);
transform:translateX(calc(-50% + (0.5 - var(--vibeui-slider-002-ratio)) * 1.125rem));
padding:0.1875rem 0.5rem;border-radius:0.5rem;white-space:nowrap;
background:var(--vibeui-slider-002-accent);color:var(--vibeui-slider-002-on-accent);
font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
/* Хвостик пузыря — квадрат, повёрнутый на 45°. */
[data-vibeui-block="slider-002"] [data-part="bubble"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:var(--vibeui-slider-002-accent);transform:rotate(45deg);border-radius:0.0625rem;
}
[data-vibeui-block="slider-002"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;display:block;
}
[data-vibeui-block="slider-002"] input::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-002-accent) var(--vibeui-slider-002-fill),var(--vibeui-slider-002-track) var(--vibeui-slider-002-fill));
}
[data-vibeui-block="slider-002"] input::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-002-accent) var(--vibeui-slider-002-fill),var(--vibeui-slider-002-track) var(--vibeui-slider-002-fill));
}
[data-vibeui-block="slider-002"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.375rem;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-slider-002-accent);border:3px solid var(--vibeui-slider-002-bg);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-002"] input::-moz-range-thumb{
width:1.125rem;height:1.125rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-002-accent);border:3px solid var(--vibeui-slider-002-bg);
}
[data-vibeui-block="slider-002"] input:focus-visible{outline:2px solid var(--vibeui-slider-002-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="slider-002"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-slider-002-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-002"] *{animation:none!important;transition:none!important}}
`

/**
 * Ползунок с пузырём значения: цифра едет вместе с ручкой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider002({
  label = "Острота блюда",
  min = 0,
  max = 10,
  step = 1,
  defaultValue = 4,
  suffix = " из 10",
  accent,
  className,
  style,
  ...props
}: Slider002Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const ratio = (value - min) / (max - min)

  const palette = {
    "--vibeui-slider-002-fill": `${ratio * 100}%`,
    "--vibeui-slider-002-ratio": String(ratio),
    ...(accent ? { "--vibeui-slider-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-002"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="rail">
          <output data-part="bubble" htmlFor={id}>
            {value}
            {suffix}
          </output>
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
          />
        </div>
        <p data-part="scale">
          <span>мягко</span>
          <span>огонь</span>
        </p>
      </div>
    </>
  )
}
