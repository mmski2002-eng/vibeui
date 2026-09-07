"use client"

import { useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Number009Props = Omit<ComponentProps<"div">, "children"> & {
  /** Подпись над числом. */
  label?: string
  /** Стартовое значение счётчика. */
  defaultValue?: number
  /** На сколько меняется число за одно нажатие. */
  step?: number
  min?: number
  max?: number
  /** Подпись кнопки «меньше»: компонент несёт русскую, проект подставляет свою. */
  decrementLabel?: string
  /** Подпись кнопки «больше». */
  incrementLabel?: string
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: счётчик, у которого видно само изменение. Цифра не
// подменяется молча — она подпрыгивает по направлению шага и оседает с
// перелётом, поэтому «плюс один» читается боковым зрением. Перезапуск
// анимации держится не на таймере, а на key: быстрые нажатия монтируют
// цифру заново, и пружина каждый раз начинается с нуля.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-009"]){
--vibeui-number-009-bg:transparent;
--vibeui-number-009-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-number-009-muted:color-mix(in oklab,var(--vibeui-number-009-fg) 62%,transparent);
--vibeui-number-009-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-number-009-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-number-009-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-number-009-accent-text:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-number-009-on-accent:oklch(0.15 0.02 39.8);
--vibeui-number-009-lift:-0.375rem;
--vibeui-number-009-radius:0.625rem;
--vibeui-number-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="number-009"]{color-scheme:dark}
[data-vibeui-block="number-009"]{
display:flex;flex-direction:column;align-items:center;gap:0.5rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-number-009-bg);color:var(--vibeui-number-009-fg);
font-family:var(--vibeui-number-009-font);
}
[data-vibeui-block="number-009"] *{box-sizing:border-box}
[data-vibeui-block="number-009"] [data-part="label"]{
font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;
color:var(--vibeui-number-009-muted);
}
[data-vibeui-block="number-009"] [data-part="row"]{
display:flex;align-items:center;gap:0.875rem;
}
[data-vibeui-block="number-009"] [data-part="step"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2.5rem;height:2.5rem;border-radius:9999px;
border:1px solid var(--vibeui-number-009-border);
background:var(--vibeui-number-009-card);color:inherit;
font:inherit;font-size:1.125rem;font-weight:700;line-height:1;
transition:transform .18s ease,border-color .18s ease;
}
[data-vibeui-block="number-009"] [data-part="step"]:hover:not(:disabled){
border-color:var(--vibeui-number-009-accent);transform:scale(1.06);
}
[data-vibeui-block="number-009"] [data-part="step"]:active:not(:disabled){transform:scale(0.94)}
[data-vibeui-block="number-009"] [data-part="step"]:focus-visible{
outline:2px solid var(--vibeui-number-009-accent);outline-offset:2px;
}
/* Край диапазона: кнопка выключена, а не молчит. */
[data-vibeui-block="number-009"] [data-part="step"]:disabled{
color:var(--vibeui-number-009-muted);opacity:.45;cursor:default;
}
[data-vibeui-block="number-009"] [data-part="value"]{
display:block;min-width:3.5ch;text-align:center;
font-size:3.25rem;font-weight:800;line-height:1;letter-spacing:-0.03em;
font-variant-numeric:tabular-nums;
color:var(--vibeui-number-009-accent-text);
}
/* Цифра — отдельный слой: анимируется она, а не вся строка, иначе прыгали
   бы и кнопки. Перелёт даёт пружина, поэтому на выходе масштаб ненадолго
   уходит чуть ниже единицы — это и читается как «пришлёпнулось». */
[data-vibeui-block="number-009"] [data-part="digit"]{display:inline-block}
[data-vibeui-block="number-009"] [data-part="digit"][data-bump]{
animation:vibeui-number-009-bump .4s cubic-bezier(.22,1.2,.36,1);
animation:vibeui-number-009-bump .4s linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
}
@keyframes vibeui-number-009-bump{
from{transform:scale(1.22) translateY(var(--vibeui-number-009-lift))}
to{transform:none}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-009"] *{animation:none!important;transition:none!important}}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-009"] [data-part="step"]:hover:not(:disabled){transform:none}}
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
 * Счётчик, у которого цифра подпрыгивает и оседает с перелётом на каждом шаге.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number009({
  label = "Гостей",
  defaultValue = 12,
  step = 1,
  min = 0,
  max = 99,
  decrementLabel = "Меньше",
  incrementLabel = "Больше",
  accent,
  background = "",
  className,
  style,
  ...props
}: Number009Props) {
  const [value, setValue] = useState(defaultValue)
  // tick меняет key у цифры: React монтирует её заново, и пружина
  // перезапускается даже на очередном нажатии в середине предыдущей.
  const [bump, setBump] = useState({ tick: 0, lift: "-0.375rem" })

  const shift = (delta: number) => {
    const next = Math.min(max, Math.max(min, value + delta))

    if (next === value) {
      return
    }

    setValue(next)
    setBump((previous) => ({
      tick: previous.tick + 1,
      lift: delta > 0 ? "-0.375rem" : "0.375rem",
    }))
  }

  const palette = {
    ...(accent ? { "--vibeui-number-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="number-field"
        data-vibeui-block="number-009"
        className={className}
        style={palette}
      >
        <span data-part="label">{label}</span>
        <div data-part="row">
          <button
            type="button"
            data-part="step"
            onClick={() => shift(-step)}
            disabled={value <= min}
            aria-label={decrementLabel}
          >
            −
          </button>
          <output data-part="value" aria-live="polite">
            <span
              key={bump.tick}
              data-part="digit"
              data-bump={bump.tick > 0 ? "" : undefined}
              style={{ "--vibeui-number-009-lift": bump.lift } as CSSProperties}
            >
              {value}
            </span>
          </output>
          <button
            type="button"
            data-part="step"
            onClick={() => shift(step)}
            disabled={value >= max}
            aria-label={incrementLabel}
          >
            +
          </button>
        </div>
      </div>
    </>
  )
}
