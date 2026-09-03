"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Range002Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultFrom?: number
  defaultTo?: number
  histogram?: number[]
  unit?: string
  /** Подписи ручек для скринридера: компонент несёт русские. */
  boundText?: Record<string, string>
  /** Счётчик под шкалой; {count} — число подходящих вариантов. */
  matchesText?: string
  /** Локаль форматирования чисел на шкале и в заголовке. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: над ползунком стоит гистограмма предложений. Голый диапазон
// цен ничего не говорит о рынке: выбрав «до 5 000», пользователь не знает, что
// под этот фильтр попадают три товара из тысячи. Столбики вне выбранного
// отрезка приглушены, поэтому видно и то, что отсекли. Гистограмма считается
// снаружи и приходит массивом: рисовать её по случайным числам нельзя — она
// обязана соответствовать выдаче.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// фильтра по умолчанию нет, он лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="range-002"]){
--vibeui-range-002-surface:transparent;
--vibeui-range-002-knob:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-range-002-shell:light-dark(oklch(0.9 0.006 265),oklch(0.36 0.011 265));
--vibeui-range-002-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-range-002-muted:color-mix(in oklab,var(--vibeui-range-002-fg) 68%,transparent);
--vibeui-range-002-track:light-dark(oklch(0.93 0.006 265),oklch(0.33 0.012 265));
--vibeui-range-002-accent:light-dark(oklch(0.55 0.19 275),oklch(0.74 0.15 275));
--vibeui-range-002-shadow:light-dark(oklch(0.2 0.02 265 / 25%),oklch(0 0 0 / 45%));
--vibeui-range-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-002-from:0%;
--vibeui-range-002-to:100%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="range-002"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы, плашку включает проп background. */
[data-vibeui-block="range-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-002-surface);
border:1px solid var(--vibeui-range-002-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-002-font);color:var(--vibeui-range-002-fg);
}
[data-vibeui-block="range-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.8125rem;
}
[data-vibeui-block="range-002"] [data-part="value"]{font-weight:700;font-variant-numeric:tabular-nums}
/* Гистограмма: диапазон без плотности предложений ничего не говорит о рынке. */
[data-vibeui-block="range-002"] [data-part="chart"]{
display:flex;align-items:flex-end;gap:0.0625rem;height:3rem;
}
[data-vibeui-block="range-002"] [data-part="bar"]{
flex:1 1 0;border-radius:0.125rem 0.125rem 0 0;
background:var(--vibeui-range-002-track);
transition:background-color .16s ease;
}
[data-vibeui-block="range-002"] [data-part="bar"][data-in="true"]{background:var(--vibeui-range-002-accent)}
[data-vibeui-block="range-002"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-002"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-002-track) var(--vibeui-range-002-from),
var(--vibeui-range-002-accent) var(--vibeui-range-002-from),
var(--vibeui-range-002-accent) var(--vibeui-range-002-to),
var(--vibeui-range-002-track) var(--vibeui-range-002-to));
}
[data-vibeui-block="range-002"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-002"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-002"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-002"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-002-knob);border:2px solid var(--vibeui-range-002-accent);
box-shadow:0 1px 3px var(--vibeui-range-002-shadow);
}
[data-vibeui-block="range-002"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-002-knob);border:2px solid var(--vibeui-range-002-accent);
}
[data-vibeui-block="range-002"] input:focus-visible{outline:2px solid var(--vibeui-range-002-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-002"] [data-part="foot"]{
display:flex;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-002-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_HISTOGRAM = [
  4, 9, 17, 28, 41, 55, 62, 58, 47, 39, 30, 24, 18, 12, 7, 3,
]

const BOUND_TEXT: Record<string, string> = { from: "от", to: "до" }
const MATCHES_TEXT = "Подходит вариантов: {count}"

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
 * Диапазон цены с гистограммой предложений: вне отрезка столбики приглушены.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range002({
  label = "Цена за ночь",
  min = 0,
  max = 16000,
  step = 500,
  defaultFrom = 3000,
  defaultTo = 11000,
  histogram = DEFAULT_HISTOGRAM,
  unit = "₽",
  boundText = BOUND_TEXT,
  matchesText = MATCHES_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Range002Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const tag = safeLocale(locale, "ru-RU")
  const peak = Math.max(...histogram, 1)
  const span = max - min || 1
  const percent = (value: number) => `${((value - min) / span) * 100}%`
  const inside = histogram.reduce((sum, amount, index) => {
    const start = min + (span / histogram.length) * index
    const end = start + span / histogram.length
    return end > from && start < to ? sum + amount : sum
  }, 0)

  const palette = {
    "--vibeui-range-002-from": percent(from),
    "--vibeui-range-002-to": percent(to),
    ...(accent ? { "--vibeui-range-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-range-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="range"
        data-vibeui-block="range-002"
        className={className}
        style={palette}
      >
        <p data-part="head">
          {label}
          <span data-part="value">
            {from.toLocaleString(tag)} — {to.toLocaleString(tag)} {unit}
          </span>
        </p>
        <div data-part="chart" aria-hidden="true">
          {histogram.map((amount, index) => {
            const start = min + (span / histogram.length) * index
            const end = start + span / histogram.length
            return (
              <span
                key={start}
                data-part="bar"
                data-in={end > from && start < to}
                style={{ height: `${Math.max(6, (amount / peak) * 100)}%` }}
              />
            )
          })}
        </div>
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
        <p data-part="foot" aria-live="polite">
          <span>
            {min.toLocaleString(tag)} {unit}
          </span>
          <span>{matchesText.replace("{count}", String(inside))}</span>
          <span>
            {max.toLocaleString(tag)} {unit}
          </span>
        </p>
      </div>
    </>
  )
}
