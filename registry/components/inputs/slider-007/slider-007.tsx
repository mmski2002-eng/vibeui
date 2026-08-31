"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider007Props = Omit<
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

// Идея компонента: вертикальный ползунок для величин, которые в голове
// «выше — больше»: яркость, уровень, температура. Поворот сделан не
// трансформом, а writing-mode: элемент честно занимает вертикальную коробку,
// поэтому раскладка вокруг него не разъезжается и клавиатура работает как
// ожидается — стрелка вверх увеличивает значение.
const STYLES = `
:where([data-vibeui-block="slider-007"]){
--vibeui-slider-007-bg:oklch(1 0 0);
--vibeui-slider-007-fg:oklch(0.22 0.014 265);
--vibeui-slider-007-muted:oklch(0.55 0.014 265);
--vibeui-slider-007-border:oklch(0.9 0.006 265);
--vibeui-slider-007-track:oklch(0.92 0.006 265);
--vibeui-slider-007-accent:oklch(0.62 0.15 85);
--vibeui-slider-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-007-fill:50%;
}
[data-vibeui-block="slider-007"]{
display:flex;flex-direction:column;align-items:center;gap:0.625rem;
width:100%;max-width:9rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-007-bg);
border:1px solid var(--vibeui-slider-007-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-007-font);color:var(--vibeui-slider-007-fg);
text-align:center;
}
[data-vibeui-block="slider-007"] [data-part="label"]{font-size:0.75rem;font-weight:600;line-height:1.3}
[data-vibeui-block="slider-007"] [data-part="rail"]{display:flex;align-items:center;gap:0.625rem}
/* writing-mode вместо rotate: повёрнутый трансформом input остаётся
   горизонтальным для раскладки и накрывает соседей своей коробкой. */
[data-vibeui-block="slider-007"] input{
appearance:none;-webkit-appearance:none;
writing-mode:vertical-lr;direction:rtl;
width:1.25rem;height:9rem;margin:0;padding:0;background:none;cursor:pointer;
}
[data-vibeui-block="slider-007"] input::-webkit-slider-runnable-track{
width:0.5rem;border-radius:9999px;
background:linear-gradient(to top,var(--vibeui-slider-007-accent) var(--vibeui-slider-007-fill),var(--vibeui-slider-007-track) var(--vibeui-slider-007-fill));
}
[data-vibeui-block="slider-007"] input::-moz-range-track{
width:0.5rem;border-radius:9999px;
background:linear-gradient(to top,var(--vibeui-slider-007-accent) var(--vibeui-slider-007-fill),var(--vibeui-slider-007-track) var(--vibeui-slider-007-fill));
}
[data-vibeui-block="slider-007"] input::-webkit-slider-thumb{
appearance:none;-webkit-appearance:none;margin-left:-0.3125rem;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-slider-007-bg);border:3px solid var(--vibeui-slider-007-accent);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-007"] input::-moz-range-thumb{
width:1.125rem;height:1.125rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-007-bg);border:3px solid var(--vibeui-slider-007-accent);
}
[data-vibeui-block="slider-007"] input:focus-visible{outline:2px solid var(--vibeui-slider-007-accent);outline-offset:3px;border-radius:0.75rem}
/* Шкала стоит рядом столбиком и подписана сверху вниз: снизу минимум,
   сверху максимум — так же, как читается сам ползунок. */
[data-vibeui-block="slider-007"] [data-part="scale"]{
display:flex;flex-direction:column;justify-content:space-between;
height:9rem;margin:0;padding:0;list-style:none;
font-size:0.625rem;color:var(--vibeui-slider-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-007"] [data-part="value"]{
font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-007"] *{animation:none!important;transition:none!important}}
`

/**
 * Вертикальный ползунок на writing-mode: клавиатура и раскладка не ломаются.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider007({
  label = "Яркость лампы",
  min = 0,
  max = 100,
  step = 5,
  defaultValue = 65,
  unit = "%",
  accent,
  className,
  style,
  ...props
}: Slider007Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    "--vibeui-slider-007-fill": `${((value - min) / (max - min)) * 100}%`,
    ...(accent ? { "--vibeui-slider-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-007"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="rail">
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-valuetext={`${value}${unit}`}
            onChange={(event) => setValue(Number(event.target.value))}
          />
          <ul data-part="scale" aria-hidden="true">
            <li>{max}</li>
            <li>{Math.round((min + max) / 2)}</li>
            <li>{min}</li>
          </ul>
        </div>
        <p data-part="value" role="status">
          {value}
          {unit}
        </p>
      </div>
    </>
  )
}
