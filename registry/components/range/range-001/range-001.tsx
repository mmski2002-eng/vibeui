"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Range001Props = Omit<
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
  /** Подписи ручек для скринридера: компонент несёт русские. */
  boundText?: Record<string, string>
  /** Локаль форматирования чисел на шкале и в заголовке. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: диапазон двумя нативными ползунками. Один ползунок не умеет
// хранить две границы, а свой драг пришлось бы учить клавиатуре и касаниям.
// Ползунки лежат друг на друге: дорожка отключена для событий, а ручки — нет,
// поэтому обе доступны мышью. Границы не перепрыгивают: каждая упирается в
// соседнюю, иначе «от» становится больше «до» и фильтр возвращает пустоту.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// фильтра по умолчанию нет, он лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="range-001"]){
--vibeui-range-001-bg:transparent;
--vibeui-range-001-knob:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-range-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-range-001-muted:color-mix(in oklab,var(--vibeui-range-001-fg) 68%,transparent);
--vibeui-range-001-border:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.011 265));
--vibeui-range-001-track:light-dark(oklch(0.92 0.006 265),oklch(0.33 0.012 265));
--vibeui-range-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.16 262));
--vibeui-range-001-shadow:light-dark(oklch(0.2 0.02 265 / 25%),oklch(0 0 0 / 45%));
--vibeui-range-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-001-from:0%;
--vibeui-range-001-to:100%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="range-001"]{color-scheme:dark}
[data-vibeui-block="range-001"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-001-bg);
border:1px solid var(--vibeui-range-001-border);border-radius:0.875rem;
font-family:var(--vibeui-range-001-font);color:var(--vibeui-range-001-fg);
}
[data-vibeui-block="range-001"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
margin:0;font-size:0.8125rem;
}
[data-vibeui-block="range-001"] [data-part="value"]{font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="range-001"] [data-part="rail"]{
position:relative;height:1.25rem;
}
/* Дорожка одна на два ползунка: закрашен отрезок между границами. */
[data-vibeui-block="range-001"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;
border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-001-track) var(--vibeui-range-001-from),
var(--vibeui-range-001-accent) var(--vibeui-range-001-from),
var(--vibeui-range-001-accent) var(--vibeui-range-001-to),
var(--vibeui-range-001-track) var(--vibeui-range-001-to));
}
[data-vibeui-block="range-001"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-001"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-001"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-001"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-001-knob);border:2px solid var(--vibeui-range-001-accent);
box-shadow:0 1px 3px var(--vibeui-range-001-shadow);
}
[data-vibeui-block="range-001"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-001-knob);border:2px solid var(--vibeui-range-001-accent);
}
[data-vibeui-block="range-001"] input:focus-visible{outline:2px solid var(--vibeui-range-001-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-001"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-001-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-001"] *{animation:none!important;transition:none!important}}
`

const BOUND_TEXT: Record<string, string> = { from: "от", to: "до" }

/**
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы тексту
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
 * Неверная локаль из пропа не должна ронять страницу-хост: toLocaleString
 * бросает на ней RangeError, поэтому непригодное значение откатываем на дефолт.
 */
function safeLocale(value: string, fallback: string) {
  try {
    Intl.NumberFormat.supportedLocalesOf(value)
    return value
  } catch {
    return fallback
  }
}

/**
 * Диапазон двумя нативными ползунками: границы не перепрыгивают друг друга.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range001({
  label = "Цена",
  min = 0,
  max = 20000,
  step = 500,
  defaultFrom = 4000,
  defaultTo = 14000,
  unit = " ₽",
  boundText = BOUND_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Range001Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const tag = safeLocale(locale, "ru-RU")
  const percent = (value: number) => `${((value - min) / (max - min)) * 100}%`

  const palette = {
    "--vibeui-range-001-from": percent(from),
    "--vibeui-range-001-to": percent(to),
    ...(accent ? { "--vibeui-range-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-range-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="range"
        data-vibeui-block="range-001"
        className={className}
        style={palette}
      >
        <p data-part="head">
          {label}
          <span data-part="value">
            {from.toLocaleString(tag)}
            {unit} — {to.toLocaleString(tag)}
            {unit}
          </span>
        </p>
        <div data-part="rail">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={from}
            aria-label={`${label}: ${boundText.from ?? BOUND_TEXT.from}`}
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
            aria-label={`${label}: ${boundText.to ?? BOUND_TEXT.to}`}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + step))
            }
          />
        </div>
        <p data-part="scale">
          <span>
            {min.toLocaleString(tag)}
            {unit}
          </span>
          <span>
            {max.toLocaleString(tag)}
            {unit}
          </span>
        </p>
      </div>
    </>
  )
}
