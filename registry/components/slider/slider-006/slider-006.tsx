"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  /** Подпись кнопки «−». Шаблон: {step} и {unit} подставляются. */
  decreaseText?: string
  /** Подпись кнопки «+». Шаблон: {step} и {unit} подставляются. */
  increaseText?: string
  /** Подпись шага под дорожкой. Шаблон: {step} подставляется. */
  stepText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: величина с шагом и единицей измерения. Ползунком трудно
// попасть в конкретное значение, поэтому рядом стоят кнопки «−» и «+» —
// они двигают ровно на шаг. Единица написана рядом с числом, а не в
// заголовке: «18» и «18 °C» — это разное количество информации.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-006"]){
--vibeui-slider-006-bg:transparent;
--vibeui-slider-006-surface:light-dark(oklch(1 0 0),oklch(0.28 0.012 265));
--vibeui-slider-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-slider-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-slider-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.38 0.012 265));
--vibeui-slider-006-track:light-dark(oklch(0.92 0.006 265),oklch(0.42 0.012 265));
--vibeui-slider-006-accent:light-dark(oklch(0.6 0.16 45),oklch(0.74 0.15 45));
--vibeui-slider-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-006-fill:50%;
}
[data-vibeui-block="slider-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-006-bg);
border:1px solid var(--vibeui-slider-006-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-006-font);color:var(--vibeui-slider-006-fg);
}
[data-vibeui-block="slider-006"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="slider-006"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="slider-006"] [data-part="stepper"]{display:flex;align-items:center;gap:0.5rem}
[data-vibeui-block="slider-006"] [data-part="value"]{
min-width:4rem;text-align:center;
font-size:1rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="slider-006"] [data-part="unit"]{font-size:0.75rem;font-weight:600;color:var(--vibeui-slider-006-muted)}
/* Кнопки шага: знаки нарисованы полосками, поэтому «−» и «+» не зависят
   от шрифта и не прыгают по базовой линии. */
[data-vibeui-block="slider-006"] button{
position:relative;appearance:none;cursor:pointer;flex:none;
width:1.75rem;height:1.75rem;padding:0;border-radius:0.5rem;
border:1px solid var(--vibeui-slider-006-border);
background:var(--vibeui-slider-006-surface);color:inherit;
transition:border-color .16s ease,background-color .16s ease;
}
[data-vibeui-block="slider-006"] button:hover:not(:disabled){border-color:var(--vibeui-slider-006-accent)}
[data-vibeui-block="slider-006"] button:disabled{opacity:.4;cursor:not-allowed}
[data-vibeui-block="slider-006"] button:focus-visible{outline:2px solid var(--vibeui-slider-006-accent);outline-offset:2px}
[data-vibeui-block="slider-006"] button::before{
content:"";position:absolute;left:50%;top:50%;
width:0.625rem;height:1.5px;margin:-0.75px 0 0 -0.3125rem;
background:currentColor;border-radius:1px;
}
[data-vibeui-block="slider-006"] [data-part="plus"]::after{
content:"";position:absolute;left:50%;top:50%;
width:1.5px;height:0.625rem;margin:-0.3125rem 0 0 -0.75px;
background:currentColor;border-radius:1px;
}
[data-vibeui-block="slider-006"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;display:block;
}
[data-vibeui-block="slider-006"] input::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-006-accent) var(--vibeui-slider-006-fill),var(--vibeui-slider-006-track) var(--vibeui-slider-006-fill));
}
[data-vibeui-block="slider-006"] input::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-006-accent) var(--vibeui-slider-006-fill),var(--vibeui-slider-006-track) var(--vibeui-slider-006-fill));
}
[data-vibeui-block="slider-006"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-slider-006-surface);border:3px solid var(--vibeui-slider-006-accent);
box-shadow:0 1px 3px oklch(0.2 0.02 265 / 28%);
}
[data-vibeui-block="slider-006"] input::-moz-range-thumb{
width:1rem;height:1rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-006-surface);border:3px solid var(--vibeui-slider-006-accent);
}
[data-vibeui-block="slider-006"] input:focus-visible{outline:2px solid var(--vibeui-slider-006-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="slider-006"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-slider-006-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-006"] *{animation:none!important;transition:none!important}}
`

/** Подстановка {step} и {unit} в шаблон подписи. */
function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(
    /\{(\w+)\}/g,
    (match, key: string) => values[key] ?? match,
  )
}

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
 * Ползунок с шагом и единицей: кнопки «−» и «+» двигают ровно на шаг.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider006({
  label = "Температура в спальне",
  min = 16,
  max = 28,
  step = 0.5,
  defaultValue = 21,
  unit = "°C",
  decreaseText = "Убавить на {step} {unit}",
  increaseText = "Прибавить на {step} {unit}",
  stepText = "шаг {step}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Slider006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const clamp = (next: number) => Math.min(max, Math.max(min, next))
  const words = { step: String(step), unit }

  const palette = {
    "--vibeui-slider-006-fill": `${((value - min) / (max - min)) * 100}%`,
    ...(accent ? { "--vibeui-slider-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-slider-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-006"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
          <div data-part="stepper">
            <button
              type="button"
              data-part="minus"
              disabled={value <= min}
              aria-label={fillTemplate(decreaseText, words)}
              onClick={() => setValue(clamp(value - step))}
            />
            <span data-part="value">
              {value}
              <span data-part="unit"> {unit}</span>
            </span>
            <button
              type="button"
              data-part="plus"
              disabled={value >= max}
              aria-label={fillTemplate(increaseText, words)}
              onClick={() => setValue(clamp(value + step))}
            />
          </div>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={`${value} ${unit}`}
          onChange={(event) => setValue(Number(event.target.value))}
        />
        <p data-part="scale">
          <span>
            {min} {unit}
          </span>
          <span>{fillTemplate(stepText, words)}</span>
          <span>
            {max} {unit}
          </span>
        </p>
      </div>
    </>
  )
}
