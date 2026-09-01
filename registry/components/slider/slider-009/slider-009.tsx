"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  accent?: string
}

// Идея компонента: громкость между двумя статичными значками-ориентирами.
// Слева тихий уровень — одна короткая полоска, справа громкий — три
// растущие, как индикатор сигнала. Значки не реагируют на перетаскивание:
// это подписи концов шкалы, а не кнопки. Текущее значение читается в пузыре
// над ручкой — глаз не должен искать его в стороне от жеста.
const STYLES = `
:where([data-vibeui-block="slider-009"]){
--vibeui-slider-009-bg:oklch(1 0 0);
--vibeui-slider-009-fg:oklch(0.22 0.014 265);
--vibeui-slider-009-muted:oklch(0.6 0.014 265);
--vibeui-slider-009-border:oklch(0.9 0.006 265);
--vibeui-slider-009-track:oklch(0.92 0.006 265);
--vibeui-slider-009-accent:oklch(0.58 0.19 292);
--vibeui-slider-009-on-accent:oklch(1 0 0);
--vibeui-slider-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-009-fill:60%;
--vibeui-slider-009-ratio:0.6;
}
[data-vibeui-block="slider-009"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-009-bg);
border:1px solid var(--vibeui-slider-009-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-009-font);color:var(--vibeui-slider-009-fg);
}
[data-vibeui-block="slider-009"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="slider-009"] [data-part="row"]{display:flex;align-items:center;gap:0.625rem}
/* Значки — столбики одинаковой ширины, растущие по высоте. Тихий значок —
   один короткий столбик, громкий — три, как индикатор уровня сигнала. */
[data-vibeui-block="slider-009"] [data-part="icon"]{
display:flex;align-items:flex-end;gap:0.125rem;flex:none;height:0.875rem;
}
[data-vibeui-block="slider-009"] [data-part="icon"] span{
display:block;width:0.1875rem;border-radius:1px;background:currentColor;
}
[data-vibeui-block="slider-009"] [data-part="icon"][data-icon="quiet"]{color:var(--vibeui-slider-009-muted)}
[data-vibeui-block="slider-009"] [data-part="icon"][data-icon="quiet"] span{height:0.3125rem}
[data-vibeui-block="slider-009"] [data-part="icon"][data-icon="loud"]{color:var(--vibeui-slider-009-accent)}
[data-vibeui-block="slider-009"] [data-part="icon"][data-icon="loud"] span:nth-child(1){height:0.375rem}
[data-vibeui-block="slider-009"] [data-part="icon"][data-icon="loud"] span:nth-child(2){height:0.625rem}
[data-vibeui-block="slider-009"] [data-part="icon"][data-icon="loud"] span:nth-child(3){height:0.875rem}
[data-vibeui-block="slider-009"] [data-part="rail"]{position:relative;flex:1 1 auto;min-width:0;padding-top:2.25rem}
/* Пузырь значения сдвигается по проценту с поправкой на половину своей
   ширины — без неё на краях шкалы он вылезает за дорожку. */
[data-vibeui-block="slider-009"] [data-part="bubble"]{
position:absolute;top:0;left:var(--vibeui-slider-009-fill);
transform:translateX(calc(-50% + (0.5 - var(--vibeui-slider-009-ratio)) * 1.25rem));
padding:0.1875rem 0.5rem;border-radius:0.5rem;white-space:nowrap;
background:var(--vibeui-slider-009-accent);color:var(--vibeui-slider-009-on-accent);
font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-009"] [data-part="bubble"]::after{
content:"";position:absolute;left:50%;bottom:-0.1875rem;
width:0.5rem;height:0.5rem;margin-left:-0.25rem;
background:var(--vibeui-slider-009-accent);transform:rotate(45deg);border-radius:0.0625rem;
}
[data-vibeui-block="slider-009"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;display:block;
}
[data-vibeui-block="slider-009"] input::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-009-accent) var(--vibeui-slider-009-fill),var(--vibeui-slider-009-track) var(--vibeui-slider-009-fill));
}
[data-vibeui-block="slider-009"] input::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-009-accent) var(--vibeui-slider-009-fill),var(--vibeui-slider-009-track) var(--vibeui-slider-009-fill));
}
[data-vibeui-block="slider-009"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.375rem;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-slider-009-accent);border:3px solid var(--vibeui-slider-009-bg);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-009"] input::-moz-range-thumb{
width:1.125rem;height:1.125rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-009-accent);border:3px solid var(--vibeui-slider-009-bg);
}
[data-vibeui-block="slider-009"] input:focus-visible{outline:2px solid var(--vibeui-slider-009-accent);outline-offset:4px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-009"] *{animation:none!important;transition:none!important}}
`

/**
 * Ползунок громкости между двумя статичными значками уровня, с пузырём
 * значения над ручкой. Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider009({
  label = "Громкость звонка",
  defaultValue = 60,
  accent,
  className,
  style,
  ...props
}: Slider009Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const ratio = value / 100

  const palette = {
    "--vibeui-slider-009-fill": `${value}%`,
    "--vibeui-slider-009-ratio": String(ratio),
    ...(accent ? { "--vibeui-slider-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-009"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <div data-part="row">
          <span data-part="icon" data-icon="quiet" aria-hidden="true">
            <span />
          </span>
          <div data-part="rail">
            <output data-part="bubble" htmlFor={id}>
              {value}%
            </output>
            <input
              id={id}
              type="range"
              min={0}
              max={100}
              step={1}
              value={value}
              onChange={(event) => setValue(Number(event.target.value))}
            />
          </div>
          <span data-part="icon" data-icon="loud" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </div>
      </div>
    </>
  )
}
