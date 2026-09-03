"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Slider009Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: громкость между двумя статичными значками-ориентирами.
// Слева тихий уровень — одна короткая полоска, справа громкий — три
// растущие, как индикатор сигнала. Значки не реагируют на перетаскивание:
// это подписи концов шкалы, а не кнопки. Текущее значение читается в пузыре
// над ручкой — глаз не должен искать его в стороне от жеста.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-009"]){
--vibeui-slider-009-bg:transparent;
--vibeui-slider-009-surface:light-dark(oklch(1 0 0),oklch(0.28 0.012 265));
--vibeui-slider-009-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-slider-009-muted:color-mix(in oklab,var(--vibeui-slider-009-fg) 68%,transparent);
--vibeui-slider-009-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-slider-009-track:light-dark(oklch(0.92 0.006 265),oklch(0.42 0.012 265));
--vibeui-slider-009-accent:light-dark(oklch(0.58 0.19 292),oklch(0.74 0.16 292));
--vibeui-slider-009-on-accent:light-dark(oklch(1 0 0),oklch(0.18 0.014 292));
--vibeui-slider-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-009-fill:60%;
--vibeui-slider-009-ratio:0.6;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="slider-009"]{color-scheme:dark}
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
background:var(--vibeui-slider-009-accent);border:3px solid var(--vibeui-slider-009-surface);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
}
[data-vibeui-block="slider-009"] input::-moz-range-thumb{
width:1.125rem;height:1.125rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-009-accent);border:3px solid var(--vibeui-slider-009-surface);
}
[data-vibeui-block="slider-009"] input:focus-visible{outline:2px solid var(--vibeui-slider-009-accent);outline-offset:4px;border-radius:0.5rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-009"] *{animation:none!important;transition:none!important}}
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
 * Ползунок громкости между двумя статичными значками уровня, с пузырём
 * значения над ручкой. Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider009({
  label = "Громкость звонка",
  defaultValue = 60,
  background = "",
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
    ...(background
      ? {
          "--vibeui-slider-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="slider"
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
