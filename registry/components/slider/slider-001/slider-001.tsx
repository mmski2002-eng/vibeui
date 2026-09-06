"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Slider001Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: ползунок на нативном input[type=range]. Свой ползунок пришлось
// бы учить перетаскиванию, клавиатуре и касаниям — браузер умеет это сам.
// Пройденная часть дорожки закрашивается градиентом по проценту, поэтому
// значение видно и без подписи, а подпись всё равно есть: цифра точнее позиции.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-001"]){
--vibeui-slider-001-bg:transparent;
--vibeui-slider-001-surface:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-slider-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-slider-001-muted:color-mix(in oklab,var(--vibeui-slider-001-fg) 68%,transparent);
--vibeui-slider-001-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-slider-001-track:light-dark(oklch(0.92 0 265),oklch(0.41 0 265));
--vibeui-slider-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.72 0.16 39.8));
--vibeui-slider-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-001-fill:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="slider-001"]{color-scheme:dark}
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
background:var(--vibeui-slider-001-surface);border:2px solid var(--vibeui-slider-001-accent);
box-shadow:0 1px 3px oklch(0.2 0 265 / 25%);
}
[data-vibeui-block="slider-001"] input::-moz-range-thumb{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-001-surface);border:2px solid var(--vibeui-slider-001-accent);
}
[data-vibeui-block="slider-001"] input:focus-visible{outline:2px solid var(--vibeui-slider-001-accent);outline-offset:4px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-001"] *{animation:none!important;transition:none!important}}
`

/**
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

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
  background = "",
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
    ...(background
      ? {
          "--vibeui-slider-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="slider"
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
