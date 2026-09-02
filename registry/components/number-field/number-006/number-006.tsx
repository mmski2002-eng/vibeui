"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  steps?: number[]
  defaultValue?: number
  max?: number
  unit?: string
  /** Подпись кнопки возврата к исходной сумме. */
  resetText?: string
  /** Подпись кнопки-дозы для скринридера. Подстановки: {step}, {unit}. */
  addLabel?: string
  /** Строка про верхнюю границу. Подстановки: {max}, {unit}. */
  hintText?: string
  /** Локаль форматирования чисел. */
  locale?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: быстрые кнопки не задают значение, а прибавляют к нему.
// «+10» и «+50» — это дозы, из которых складывается любое число: три нажатия
// быстрее, чем набор с клавиатуры, и не требуют угадывать готовый вариант.
// Раз добавление накапливается, обязателен обратный ход: «сбросить» возвращает
// исходное значение, иначе перебор чинят только выделением и стиранием.
//
// Тема берётся из color-scheme окружения через light-dark(): поле темнеет
// вместе со страницей и не носит собственной тёмной темы.
const STYLES = `
:where([data-vibeui-block="number-006"]){
--vibeui-number-006-surface:transparent;
--vibeui-number-006-chip:light-dark(oklch(1 0 0),oklch(0.3 0.012 265));
--vibeui-number-006-field:light-dark(oklch(0.98 0.003 265),oklch(0.25 0.011 265));
--vibeui-number-006-shell:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-number-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-number-006-muted:light-dark(oklch(0.55 0.014 265),oklch(0.7 0.012 265));
--vibeui-number-006-border:light-dark(oklch(0.88 0.008 265),oklch(0.42 0.014 265));
--vibeui-number-006-accent:light-dark(oklch(0.56 0.18 45),oklch(0.76 0.15 45));
--vibeui-number-006-soft:light-dark(oklch(0.56 0.18 45 / 10%),oklch(0.76 0.15 45 / 18%));
--vibeui-number-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Подложки по умолчанию нет: поле ложится на фон страницы. */
[data-vibeui-block="number-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-006-surface);
border:1px solid var(--vibeui-number-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-006-font);color:var(--vibeui-number-006-fg);
}
[data-vibeui-block="number-006"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
}
[data-vibeui-block="number-006"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-006"] [data-part="reset"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-number-006-muted);font:inherit;font-size:0.75rem;
text-decoration:underline;text-underline-offset:2px;
}
[data-vibeui-block="number-006"] [data-part="reset"]:hover{color:var(--vibeui-number-006-fg)}
[data-vibeui-block="number-006"] [data-part="reset"]:disabled{opacity:.4;cursor:default;text-decoration:none}
[data-vibeui-block="number-006"] [data-part="field"]{
display:flex;align-items:baseline;gap:0.375rem;
padding:0 0.75rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-number-006-border);border-radius:0.75rem;
background:var(--vibeui-number-006-field);
}
[data-vibeui-block="number-006"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-006-accent);
box-shadow:0 0 0 2px var(--vibeui-number-006-soft);
}
[data-vibeui-block="number-006"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
color:inherit;font:inherit;font-size:1.5rem;font-weight:700;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-006"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-006"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="number-006"] [data-part="unit"]{
flex:none;font-size:0.875rem;font-weight:650;color:var(--vibeui-number-006-muted);
}
/* Дозы прибавляются, а не задают значение: любое число складывается из них. */
[data-vibeui-block="number-006"] [data-part="steps"]{display:flex;flex-wrap:wrap;gap:0.375rem}
[data-vibeui-block="number-006"] [data-part="steps"] button{
appearance:none;cursor:pointer;flex:1 1 auto;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-number-006-border);border-radius:0.5rem;
background:var(--vibeui-number-006-chip);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:650;font-variant-numeric:tabular-nums;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="number-006"] [data-part="steps"] button:hover:not(:disabled){
border-color:var(--vibeui-number-006-accent);background:var(--vibeui-number-006-soft);
}
[data-vibeui-block="number-006"] [data-part="steps"] button:focus-visible{outline:2px solid var(--vibeui-number-006-accent);outline-offset:2px}
[data-vibeui-block="number-006"] [data-part="steps"] button:disabled{opacity:.45;cursor:default}
[data-vibeui-block="number-006"] [data-part="hint"]{
margin:0;font-size:0.75rem;color:var(--vibeui-number-006-muted);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_STEPS = [10, 50, 100]

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
 * Число с кнопками-дозами: они прибавляют к значению, а не задают его.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number006({
  label = "Пополнить счёт",
  steps = DEFAULT_STEPS,
  defaultValue = 250,
  max = 5000,
  unit = "₽",
  resetText = "сбросить",
  addLabel = "Прибавить {step} {unit}",
  hintText = "Максимум {max} {unit} за одно пополнение",
  locale = "ru-RU",
  background = "",
  accent,
  className,
  style,
  ...props
}: Number006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-number-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-number-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="number-006"
        className={className}
        style={palette}
      >
        <p data-part="head">
          <label htmlFor={id}>{label}</label>
          <button
            type="button"
            data-part="reset"
            disabled={value === defaultValue}
            onClick={() => setValue(defaultValue)}
          >
            {resetText}
          </button>
        </p>
        <div data-part="field">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            max={max}
            step={1}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(
                Number.isFinite(next) ? Math.min(max, Math.max(0, next)) : 0,
              )
            }}
          />
          <span data-part="unit" aria-hidden="true">
            {unit}
          </span>
        </div>
        <div data-part="steps">
          {steps.map((step) => (
            <button
              key={step}
              type="button"
              disabled={value + step > max}
              aria-label={addLabel
                .replace("{step}", String(step))
                .replace("{unit}", unit)}
              onClick={() => setValue(Math.min(max, value + step))}
            >
              +{step}
            </button>
          ))}
        </div>
        <p id={`${id}-hint`} data-part="hint">
          {hintText
            .replace("{max}", max.toLocaleString(locale))
            .replace("{unit}", unit)}
        </p>
      </div>
    </>
  )
}
