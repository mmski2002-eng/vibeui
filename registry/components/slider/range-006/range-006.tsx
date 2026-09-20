"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Range006Props = Omit<
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
  /** Левая плашка; {value} — число, {unit} — единица. */
  fromText?: string
  /** Правая плашка на закрытом верхе; {value} и {unit}. */
  toText?: string
  /** Правая плашка на открытом верхе; {value} и {unit}. */
  openText?: string
  /** Пояснение под шкалой на открытом верхе. */
  openNote?: string
  /** Пояснение под шкалой на закрытом верхе; {step} и {unit}. */
  stepNote?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: диапазон площади с открытым верхом. Любая шкала где-то
// кончается, и на последнем делении фильтр начинает врать: «до 200 м²» тихо
// отсекает дом на 300. Здесь верхняя ручка на максимуме означает «и больше», о
// чём написано словами и сказано через aria-valuetext. Единица подписана у
// каждого края, а не один раз в заголовке: числа на дорожке читают отдельно от
// подписи, и «40 — 120» без «м²» превращается в загадку.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// фильтра по умолчанию нет, он лежит на фоне страницы и темнеет вместе с ней.
const STYLES = `
:where([data-vibeui-block="range-006"]){
--vibeui-range-006-surface:transparent;
--vibeui-range-006-knob:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-range-006-shell:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-range-006-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-range-006-muted:color-mix(in oklab,var(--vibeui-range-006-fg) 68%,transparent);
--vibeui-range-006-track:light-dark(oklch(0.93 0 265),oklch(0.33 0 265));
--vibeui-range-006-accent:light-dark(oklch(0.28 0 0),oklch(0.912 0 0));
--vibeui-range-006-soft:light-dark(oklch(0.28 0 0 / 12%),oklch(0.912 0 0 / 20%));
--vibeui-range-006-shadow:light-dark(oklch(0.2 0 265 / 25%),oklch(0 0 0 / 45%));
--vibeui-range-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-range-006-from:0%;
--vibeui-range-006-to:100%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="range-006"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы, плашку включает проп background. */
[data-vibeui-block="range-006"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-range-006-surface);
border:1px solid var(--vibeui-range-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-range-006-font);color:var(--vibeui-range-006-fg);
}
[data-vibeui-block="range-006"] [data-part="label"]{margin:0;font-size:0.8125rem;font-weight:650}
/* Единица у каждого края: «40 — 120» без «м²» ничего не значит. */
[data-vibeui-block="range-006"] [data-part="values"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin:0;
}
[data-vibeui-block="range-006"] [data-part="chip"]{
padding:0.3125rem 0.625rem;border-radius:0.5rem;
background:var(--vibeui-range-006-soft);color:var(--vibeui-range-006-accent);
font-size:0.875rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;
}
[data-vibeui-block="range-006"] [data-part="dash"]{flex:1 1 auto;height:1px;background:var(--vibeui-range-006-track)}
[data-vibeui-block="range-006"] [data-part="rail"]{position:relative;height:1.25rem}
[data-vibeui-block="range-006"] [data-part="rail"]::before{
content:"";position:absolute;left:0;right:0;top:0.4375rem;height:0.375rem;border-radius:9999px;
background:linear-gradient(to right,
var(--vibeui-range-006-track) var(--vibeui-range-006-from),
var(--vibeui-range-006-accent) var(--vibeui-range-006-from),
var(--vibeui-range-006-accent) var(--vibeui-range-006-to),
var(--vibeui-range-006-track) var(--vibeui-range-006-to));
}
[data-vibeui-block="range-006"] input{
position:absolute;left:0;top:0;width:100%;height:1.25rem;margin:0;
appearance:none;background:none;pointer-events:none;
}
[data-vibeui-block="range-006"] input::-webkit-slider-runnable-track{background:none;height:0.375rem}
[data-vibeui-block="range-006"] input::-moz-range-track{background:none;height:0.375rem}
/* Дорожка событий не ловит, ручки ловят: иначе верхний ползунок съедает клики. */
[data-vibeui-block="range-006"] input::-webkit-slider-thumb{
appearance:none;pointer-events:auto;cursor:pointer;margin-top:-0.3125rem;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-006-knob);border:2px solid var(--vibeui-range-006-accent);
box-shadow:0 1px 3px var(--vibeui-range-006-shadow);
}
[data-vibeui-block="range-006"] input::-moz-range-thumb{
pointer-events:auto;cursor:pointer;box-sizing:border-box;
width:1rem;height:1rem;border-radius:9999px;
background:var(--vibeui-range-006-knob);border:2px solid var(--vibeui-range-006-accent);
}
[data-vibeui-block="range-006"] input:focus-visible{outline:2px solid var(--vibeui-range-006-accent);outline-offset:4px;border-radius:0.5rem}
[data-vibeui-block="range-006"] [data-part="note"]{
margin:0;font-size:0.6875rem;line-height:1.4;color:var(--vibeui-range-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="range-006"] *{animation:none!important;transition:none!important}}
`

const BOUND_TEXT: Record<string, string> = { from: "от", to: "до" }
const FROM_TEXT = "от {value} {unit}"
const TO_TEXT = "{value} {unit}"
const OPEN_TEXT = "{value} {unit} и больше"
const OPEN_NOTE =
  "Верхняя граница снята: в выдачу попадут и самые большие дома."
const STEP_NOTE =
  "Шаг {step} {unit}. Доведите правую ручку до края, чтобы снять верхнюю границу."

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    values[key] === undefined ? match : String(values[key]),
  )
}

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
 * Диапазон площади с единицами и открытым верхом: максимум значит «и больше».
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Range006({
  label = "Площадь дома",
  min = 20,
  max = 200,
  step = 5,
  defaultFrom = 40,
  defaultTo = 120,
  unit = "м²",
  boundText = BOUND_TEXT,
  fromText = FROM_TEXT,
  toText = TO_TEXT,
  openText = OPEN_TEXT,
  openNote = OPEN_NOTE,
  stepNote = STEP_NOTE,
  background = "",
  accent,
  className,
  style,
  ...props
}: Range006Props) {
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const percent = (value: number) => `${((value - min) / (max - min)) * 100}%`
  // Верх шкалы означает «и больше»: иначе фильтр тихо отсекает крупные дома.
  const openEnded = to >= max
  const topText = openEnded
    ? fill(openText, { value: max, unit })
    : fill(toText, { value: to, unit })

  const palette = {
    "--vibeui-range-006-from": percent(from),
    "--vibeui-range-006-to": percent(to),
    ...(accent ? { "--vibeui-range-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-range-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-range-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="range"
        data-vibeui-block="range-006"
        className={className}
        style={palette}
      >
        <p data-part="label">{label}</p>
        <p data-part="values" aria-live="polite">
          <span data-part="chip">{fill(fromText, { value: from, unit })}</span>
          <span data-part="dash" aria-hidden="true" />
          <span data-part="chip">{topText}</span>
        </p>
        <div data-part="rail">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={from}
            aria-label={`${label}: ${boundText.from ?? BOUND_TEXT.from}`}
            aria-valuetext={fill(fromText, { value: from, unit })}
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
            aria-valuetext={topText}
            onChange={(event) =>
              setTo(Math.max(Number(event.target.value), from + step))
            }
          />
        </div>
        <p data-part="note">
          {openEnded ? openNote : fill(stepNote, { step, unit })}
        </p>
      </div>
    </>
  )
}
