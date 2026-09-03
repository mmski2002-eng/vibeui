"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Number001Props = Omit<
  ComponentProps<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  /** Подпись кнопки «меньше»: компонент несёт русскую, проект подставляет свою. */
  decrementLabel?: string
  /** Подпись кнопки «больше». */
  incrementLabel?: string
  /** Строка под полем. Подстановки: {unit}, {min}, {max}. */
  rangeText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: число с кнопками. Поле остаётся вводимым с клавиатуры —
// набрать 47 быстрее, чем нажать кнопку сорок семь раз. Кнопки на краях
// отключаются, а не молчат: иначе непонятно, почему число перестало меняться.
// Ввод хранится строкой, поэтому промежуточное пустое поле не превращается в 0.
//
// Тема берётся из color-scheme окружения через light-dark(): компонент
// темнеет вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-001"]){
--vibeui-number-001-bg:light-dark(oklch(1 0 0),oklch(0.26 0.012 265));
--vibeui-number-001-surface:transparent;
--vibeui-number-001-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-number-001-fg:light-dark(oklch(0.24 0.014 265),oklch(0.94 0.005 265));
--vibeui-number-001-muted:color-mix(in oklab,var(--vibeui-number-001-fg) 68%,transparent);
--vibeui-number-001-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-number-001-hover:light-dark(oklch(0.55 0.02 265 / 8%),oklch(0.85 0.02 265 / 12%));
--vibeui-number-001-accent:light-dark(oklch(0.55 0.2 262),oklch(0.74 0.17 262));
--vibeui-number-001-ring:light-dark(oklch(0.55 0.2 262 / 22%),oklch(0.74 0.17 262 / 32%));
--vibeui-number-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="number-001"]{color-scheme:dark}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="number-001"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.875rem;
background:var(--vibeui-number-001-surface);
border:1px solid var(--vibeui-number-001-shell);border-radius:0.875rem;
width:100%;max-width:15rem;box-sizing:border-box;
font-family:var(--vibeui-number-001-font);color:var(--vibeui-number-001-fg);
}
[data-vibeui-block="number-001"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="number-001"] [data-part="field"]{
display:flex;align-items:center;
border:1px solid var(--vibeui-number-001-border);border-radius:0.625rem;
background:var(--vibeui-number-001-bg);overflow:hidden;
}
[data-vibeui-block="number-001"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-001-accent);
box-shadow:0 0 0 2px var(--vibeui-number-001-ring);
}
[data-vibeui-block="number-001"] button{
appearance:none;border:0;background:none;cursor:pointer;flex:none;
width:2.5rem;height:2.5rem;color:inherit;font:inherit;font-size:1rem;line-height:1;
}
[data-vibeui-block="number-001"] button:hover:not(:disabled){background:var(--vibeui-number-001-hover)}
[data-vibeui-block="number-001"] button:focus-visible{outline:2px solid var(--vibeui-number-001-accent);outline-offset:-2px}
/* Край диапазона: кнопка выключена, а не молчит. */
[data-vibeui-block="number-001"] button:disabled{color:var(--vibeui-number-001-muted);opacity:.5;cursor:default}
/* Поле остаётся вводимым: набрать число быстрее, чем дожать кнопкой. */
[data-vibeui-block="number-001"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:2.5rem;padding:0 0.25rem;color:inherit;
font:inherit;font-size:0.9375rem;font-weight:650;text-align:center;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-001"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-001"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="number-001"] [data-part="unit"]{margin:0;font-size:0.75rem;color:var(--vibeui-number-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-001"] *{animation:none!important;transition:none!important}}
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
 * Число с кнопками, но с сохранённым ручным вводом.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number001({
  label = "Количество мест",
  min = 1,
  max = 20,
  step = 1,
  defaultValue = 4,
  unit = "шт.",
  decrementLabel = "Меньше",
  incrementLabel = "Больше",
  rangeText = "{unit} · от {min} до {max}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number001Props) {
  const id = useId()
  const [raw, setRaw] = useState(String(defaultValue))
  const value = Number(raw)
  const valid = raw !== "" && Number.isFinite(value)

  const shift = (delta: number) => {
    const next = Math.min(max, Math.max(min, (valid ? value : min) + delta))
    setRaw(String(next))
  }

  const palette = {
    ...(accent ? { "--vibeui-number-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-001-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="number-field"
        data-vibeui-block="number-001"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <button
            type="button"
            onClick={() => shift(-step)}
            disabled={valid && value <= min}
            aria-label={decrementLabel}
          >
            −
          </button>
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={raw}
            aria-describedby={`${id}-unit`}
            onChange={(event) => setRaw(event.target.value)}
            onBlur={() => {
              if (!valid) return setRaw(String(min))
              setRaw(String(Math.min(max, Math.max(min, value))))
            }}
          />
          <button
            type="button"
            onClick={() => shift(step)}
            disabled={valid && value >= max}
            aria-label={incrementLabel}
          >
            +
          </button>
        </div>
        <p id={`${id}-unit`} data-part="unit">
          {rangeText
            .replace("{unit}", unit)
            .replace("{min}", String(min))
            .replace("{max}", String(max))}
        </p>
      </div>
    </>
  )
}
