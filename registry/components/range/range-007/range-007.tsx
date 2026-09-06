"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Range007Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  presets?: { text: string; from: number; to: number }[]
  unit?: string
  /** Подписи ручек для скринридера: компонент несёт русские. */
  boundText?: Record<string, string>
  /** Локаль форматирования чисел на шкале и в заголовке. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пресеты задают обе границы разом. Человек редко думает
// числами — он думает «эконом» или «бизнес», а перевод в рубли и обратно
// делает система. Кнопка отмечается только тогда, когда обе ручки стоят ровно
// на её значениях, поэтому после ручной правки отметка гаснет сама и не врёт.
// Ползунок остаётся рабочим: пресет — это быстрый старт, а не единственный
// способ ответить.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// фильтра по умолчанию нет, он лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="range-007"]){
--vibeui-range-007-surface:transparent;
--vibeui-range-007-knob:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-range-007-shell:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-range-007-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-range-007-muted:color-mix(in oklab,var(--vibeui-range-007-fg) 68%,transparent);
--vibeui-range-007-border:light-dark(oklch(0.88 0 265),oklch(0.39 0 265));
--vibeui-range-007-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-range-007-accent:light-dark(oklch(0.55 0.18 45),oklch(0.79 0.14 45));
--vibeui-range-007-soft:light-dark(oklch(0.55 0.18 45 / 12%),oklch(0.79 0.14 45 / 20%));
--vibeui-range-007-shadow:light-dark(oklch(0.2 0 265 / 25%),oklch(0 0 0 / 45%));
--vibeui-range-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-007-from:0%;
--vibeui-range-007-to:100%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="range-007"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы, плашку включает проп background. */
[data-vibeui-block="range-007"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-007-surface);
border:1px solid var(--vibeui-range-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-007-font);color:var(--vibeui-range-007-fg);
}
[data-vibeui-block="range-007"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.8125rem;
}
[data-vibeui-block="range-007"] [data-part="value"]{font-weight:700;font-variant-numeric:tabular-nums}
/* Пресеты словами: человек думает «эконом», а не «до 4 000». */
[data-vibeui-block="range-007"] [data-part="presets"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="range-007"] button{
appearance:none;cursor:pointer;flex:1 1 auto;
height:1.875rem;padding:0 0.75rem;border-radius:9999px;
border:1px solid var(--vibeui-range-007-border);
background:none;color:inherit;
font:inherit;font-size:0.75rem;font-weight:650;
transition:background-color .14s ease,border-color .14s ease,color .14s ease;
}
[data-vibeui-block="range-007"] button:hover{border-color:var(--vibeui-range-007-accent)}
[data-vibeui-block="range-007"] button:focus-visible{outline:2px solid var(--vibeui-range-007-accent);outline-offset:2px}
/* Отметка гаснет после ручной правки: иначе кнопка врёт о текущем фильтре. */
[data-vibeui-block="range-007"] button[aria-pressed="true"]{
background:var(--vibeui-range-007-soft);border-color:var(--vibeui-range-007-accent);
color:var(--vibeui-range-007-accent);
}
[data-vibeui-block="range-007"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-007"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-007-track) var(--vibeui-range-007-from),
var(--vibeui-range-007-accent) var(--vibeui-range-007-from),
var(--vibeui-range-007-accent) var(--vibeui-range-007-to),
var(--vibeui-range-007-track) var(--vibeui-range-007-to));
}
[data-vibeui-block="range-007"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-007"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-007"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-007"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-007-knob);border:2px solid var(--vibeui-range-007-accent);
box-shadow:0 1px 3px var(--vibeui-range-007-shadow);
}
[data-vibeui-block="range-007"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-007-knob);border:2px solid var(--vibeui-range-007-accent);
}
[data-vibeui-block="range-007"] input:focus-visible{outline:2px solid var(--vibeui-range-007-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-007"] [data-part="scale"]{
display:flex;justify-content:space-between;margin:0;
font-size:0.6875rem;color:var(--vibeui-range-007-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_PRESETS = [
  { text: "Эконом", from: 0, to: 4000 },
  { text: "Средний", from: 4000, to: 9000 },
  { text: "Премиум", from: 9000, to: 20000 },
]

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
 * Диапазон с пресетами: кнопка задаёт обе границы, ползунок остаётся рабочим.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range007({
  label = "Бюджет на ночь",
  min = 0,
  max = 20000,
  step = 500,
  presets = DEFAULT_PRESETS,
  unit = "₽",
  boundText = BOUND_TEXT,
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Range007Props) {
  // Стартуем с середины списка пресетов: пустой фильтр ничего не сообщает.
  const start = presets[Math.floor(presets.length / 2)]
  const [from, setFrom] = useState(start?.from ?? min)
  const [to, setTo] = useState(start?.to ?? max)
  const tag = safeLocale(locale, "ru-RU")
  const percent = (value: number) => `${((value - min) / (max - min)) * 100}%`

  const palette = {
    "--vibeui-range-007-from": percent(from),
    "--vibeui-range-007-to": percent(to),
    ...(accent ? { "--vibeui-range-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-range-007-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="range"
        data-vibeui-block="range-007"
        className={className}
        style={palette}
      >
        <p data-part="head">
          {label}
          <span data-part="value">
            {from.toLocaleString(tag)} — {to.toLocaleString(tag)} {unit}
          </span>
        </p>
        <div data-part="presets">
          {presets.map((preset) => (
            <button
              key={preset.text}
              type="button"
              // Отметка считается от текущих границ, а не хранится отдельно.
              aria-pressed={from === preset.from && to === preset.to}
              onClick={() => {
                setFrom(preset.from)
                setTo(preset.to)
              }}
            >
              {preset.text}
            </button>
          ))}
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
        <p data-part="scale">
          <span>
            {min.toLocaleString(tag)} {unit}
          </span>
          <span>
            {max.toLocaleString(tag)} {unit}
          </span>
        </p>
      </div>
    </>
  )
}
