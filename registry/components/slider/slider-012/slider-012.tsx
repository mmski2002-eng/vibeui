"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Slider012Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  zones?: [string, string, string]
  /** Объявление значения. Шаблон: {value}, {unit} и {zone} подставляются. */
  zoneText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
}

// Идея компонента: дорожка целиком закрашена трёхцветным градиентом —
// зелёный, жёлтый, красный — и не меняется от значения, это карта всей
// шкалы сразу. Меняется только подпись зоны рядом с ручкой: она читает
// проценты по границам низкой и высокой трети и не пересчитывает цвета,
// только текст и цвет самой таблетки.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он лежит прямо на фоне страницы.
const STYLES = `
:where([data-vibeui-block="slider-012"]){
--vibeui-slider-012-bg:transparent;
--vibeui-slider-012-surface:light-dark(oklch(1 0 0),oklch(0.28 0.012 265));
--vibeui-slider-012-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-slider-012-muted:light-dark(oklch(0.55 0.014 265),oklch(0.71 0.012 265));
--vibeui-slider-012-border:light-dark(oklch(0.9 0.006 265),oklch(0.37 0.012 265));
--vibeui-slider-012-low:light-dark(oklch(0.62 0.16 150),oklch(0.7 0.15 150));
--vibeui-slider-012-mid:light-dark(oklch(0.75 0.15 90),oklch(0.8 0.14 90));
--vibeui-slider-012-high:light-dark(oklch(0.6 0.19 25),oklch(0.68 0.18 25));
/* Таблетка зоны разбавляется не белым, а собственным токеном: в тёмной
   теме подмешивать белое означало бы выбелить её вопреки окружению. */
--vibeui-slider-012-zone-blend:light-dark(oklch(1 0 0),oklch(0.25 0.012 265));
--vibeui-slider-012-on-zone:light-dark(oklch(0.2 0.02 265),oklch(0.95 0.006 265));
--vibeui-slider-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-slider-012-thumb:var(--vibeui-slider-012-high);
}
[data-vibeui-block="slider-012"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-slider-012-bg);
border:1px solid var(--vibeui-slider-012-border);border-radius:0.875rem;
font-family:var(--vibeui-slider-012-font);color:var(--vibeui-slider-012-fg);
}
[data-vibeui-block="slider-012"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="slider-012"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
/* Таблетка зоны: цвет и текст переключаются одним data-атрибутом на
   корне, а не тремя условными классами. */
[data-vibeui-block="slider-012"] [data-part="zone"]{
flex:none;padding:0.1875rem 0.625rem;border-radius:9999px;
font-size:0.75rem;font-weight:650;color:var(--vibeui-slider-012-on-zone);
}
[data-vibeui-block="slider-012"][data-zone="0"] [data-part="zone"]{background:color-mix(in oklab,var(--vibeui-slider-012-low) 35%,var(--vibeui-slider-012-zone-blend))}
[data-vibeui-block="slider-012"][data-zone="1"] [data-part="zone"]{background:color-mix(in oklab,var(--vibeui-slider-012-mid) 40%,var(--vibeui-slider-012-zone-blend))}
[data-vibeui-block="slider-012"][data-zone="2"] [data-part="zone"]{background:color-mix(in oklab,var(--vibeui-slider-012-high) 35%,var(--vibeui-slider-012-zone-blend))}
[data-vibeui-block="slider-012"] input{
appearance:none;width:100%;height:1.25rem;margin:0;background:none;cursor:pointer;display:block;
}
/* Дорожка красится градиентом целиком и не зависит от значения — это
   карта шкалы, а не индикатор заполнения. */
[data-vibeui-block="slider-012"] input::-webkit-slider-runnable-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-012-low),var(--vibeui-slider-012-mid),var(--vibeui-slider-012-high));
}
[data-vibeui-block="slider-012"] input::-moz-range-track{
height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,var(--vibeui-slider-012-low),var(--vibeui-slider-012-mid),var(--vibeui-slider-012-high));
}
[data-vibeui-block="slider-012"] input::-webkit-slider-thumb{
appearance:none;margin-top:-0.34375rem;
width:1.0625rem;height:1.0625rem;border-radius:9999px;
background:var(--vibeui-slider-012-surface);border:3px solid var(--vibeui-slider-012-thumb);
box-shadow:0 1px 4px oklch(0.2 0.02 265 / 30%);
transition:border-color .16s ease;
}
[data-vibeui-block="slider-012"] input::-moz-range-thumb{
width:1.0625rem;height:1.0625rem;border-radius:9999px;box-sizing:border-box;
background:var(--vibeui-slider-012-surface);border:3px solid var(--vibeui-slider-012-thumb);
transition:border-color .16s ease;
}
[data-vibeui-block="slider-012"] input:focus-visible{outline:2px solid var(--vibeui-slider-012-thumb);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="slider-012"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-slider-012-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="slider-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ZONES: [string, string, string] = ["низкий", "средний", "высокий"]

function zoneIndex(ratio: number) {
  if (ratio < 1 / 3) return 0
  if (ratio < 2 / 3) return 1
  return 2
}

/** Подстановка значений в шаблон подписи. */
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
 * Ползунок с трёхцветной дорожкой-градиентом и подписью текущей зоны.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Slider012({
  label = "Уровень нагрузки",
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  unit = "%",
  zones = DEFAULT_ZONES,
  zoneText = "{value}{unit}, зона: {zone}",
  background = "",
  className,
  style,
  ...props
}: Slider012Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const ratio = (value - min) / (max - min)
  const zone = zoneIndex(ratio)
  const zoneColors = ["low", "mid", "high"] as const

  const palette = {
    "--vibeui-slider-012-thumb": `var(--vibeui-slider-012-${zoneColors[zone]})`,
    ...(background
      ? {
          "--vibeui-slider-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-slider-012" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="slider-012"
        data-zone={zone}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label data-part="label" htmlFor={id}>
            {label}
          </label>
          <span data-part="zone" role="status">
            {zones[zone]}
          </span>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-valuetext={fillTemplate(zoneText, {
            value: String(value),
            unit,
            zone: zones[zone],
          })}
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
