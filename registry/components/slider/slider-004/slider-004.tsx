"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Slider004Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultFrom?: number
  defaultTo?: number
  unit?: string
  /** Подпись нижней ручки для скринридера. */
  fromText?: string
  /** Подпись верхней ручки для скринридера. */
  toText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: диапазон двумя нативными range поверх одной дорожки.
// Второго типа input'а для диапазона в браузере нет, а самодельные ручки
// теряют клавиатуру и касания. Здесь оба input'а прозрачны, дорожка одна,
// закрашен только промежуток между ручками, а значения не могут
// перепрыгнуть друг друга: каждое ограничивает соседа при вводе.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-004"]){
--vibeui-slider-004-bg:transparent;
--vibeui-slider-004-surface:light-dark(oklch(1 0 0),oklch(0.28 0 265));
--vibeui-slider-004-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-slider-004-muted:color-mix(in oklab,var(--vibeui-slider-004-fg) 68%,transparent);
--vibeui-slider-004-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-slider-004-track:light-dark(oklch(0.92 0 265),oklch(0.42 0 265));
--vibeui-slider-004-accent:light-dark(oklch(0.55 0.19 39.8),oklch(0.72 0.16 39.8));
--vibeui-slider-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-004-from:20%;
--vibeui-slider-004-to:70%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="slider-004"]{color-scheme:dark}
[data-vibeui-block="slider-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-004-bg);
border:1px solid var(--vibeui-slider-004-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-004-font);color:var(--vibeui-slider-004-fg);
}
[data-vibeui-block="slider-004"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;font-size:0.8125rem;
}
[data-vibeui-block="slider-004"] [data-part="title"]{font-weight:600}
[data-vibeui-block="slider-004"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
/* Дорожка нарисована один раз, а не каждым input'ом: иначе на пересечении
   ручек видно две полосы. Закрашен ровно промежуток между значениями. */
[data-vibeui-block="slider-004"] [data-part="rail"]{position:relative;height:1.5rem}
[data-vibeui-block="slider-004"] [data-part="line"]{
position:absolute;left:0;right:0;top:0.5625rem;height:0.375rem;
border-radius:9999px;pointer-events:none;
background:linear-gradient(to right,
var(--vibeui-slider-004-track) var(--vibeui-slider-004-from),
var(--vibeui-slider-004-accent) var(--vibeui-slider-004-from),
var(--vibeui-slider-004-accent) var(--vibeui-slider-004-to),
var(--vibeui-slider-004-track) var(--vibeui-slider-004-to));
}
[data-vibeui-block="slider-004"] input{
appearance:none;position:absolute;left:0;top:0;
width:100%;height:1.5rem;margin:0;background:none;
pointer-events:none;
}
[data-vibeui-block="slider-004"] input::-webkit-slider-runnable-track{height:1.5rem;background:transparent}
[data-vibeui-block="slider-004"] input::-moz-range-track{height:1.5rem;background:transparent}
/* Прозрачен весь input, кроме ручки: иначе верхний из двух перекрывал бы
   нижний по всей ширине и вторую ручку было бы не поймать. */
[data-vibeui-block="slider-004"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;
width:1.125rem;height:1.125rem;margin-top:0.1875rem;border-radius:9999px;
background:var(--vibeui-slider-004-surface);border:3px solid var(--vibeui-slider-004-accent);
box-shadow:0 1px 4px oklch(0.2 0 265 / 28%);
}
[data-vibeui-block="slider-004"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1.125rem;height:1.125rem;border-radius:9999px;
background:var(--vibeui-slider-004-surface);border:3px solid var(--vibeui-slider-004-accent);
}
[data-vibeui-block="slider-004"] input:focus-visible{outline:2px solid var(--vibeui-slider-004-accent);outline-offset:2px;border-radius:0.75rem}
[data-vibeui-block="slider-004"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-slider-004-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-004"] *{animation:none!important;transition:none!important}}
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
 * Двойной ползунок диапазона: два нативных range на одной дорожке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider004({
  label = "Цена",
  min = 0,
  max = 20000,
  step = 500,
  defaultFrom = 4000,
  defaultTo = 14000,
  unit = " ₽",
  fromText = "от",
  toText = "до",
  background = "",
  accent,
  className,
  style,
  ...props
}: Slider004Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const percent = (value: number) => `${((value - min) / (max - min)) * 100}%`

  const palette = {
    "--vibeui-slider-004-from": percent(from),
    "--vibeui-slider-004-to": percent(to),
    ...(accent ? { "--vibeui-slider-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-slider-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="slider"
        data-vibeui-block="slider-004"
        className={className}
        style={palette}
      >
        <p data-part="head">
          <span data-part="title">{label}</span>
          <span data-part="value" role="status">
            {from}
            {unit} — {to}
            {unit}
          </span>
        </p>
        <div data-part="rail">
          <span data-part="line" aria-hidden="true" />
          <input
            id={`${id}-from`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={from}
            aria-label={`${label}: ${fromText}`}
            onChange={(event) =>
              setFrom(Math.min(Number(event.target.value), to - step))
            }
          />
          <input
            id={`${id}-to`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={to}
            aria-label={`${label}: ${toText}`}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + step))
            }
          />
        </div>
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
