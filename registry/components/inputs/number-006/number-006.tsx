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
  accent?: string
}

// Идея компонента: быстрые кнопки не задают значение, а прибавляют к нему.
// «+10» и «+50» — это дозы, из которых складывается любое число: три нажатия
// быстрее, чем набор с клавиатуры, и не требуют угадывать готовый вариант.
// Раз добавление накапливается, обязателен обратный ход: «сбросить» возвращает
// исходное значение, иначе перебор чинят только выделением и стиранием.
const STYLES = `
:where([data-vibeui-block="number-006"]){
--vibeui-number-006-surface:oklch(1 0 0);
--vibeui-number-006-field:oklch(0.98 0.003 265);
--vibeui-number-006-shell:oklch(0.9 0.006 265);
--vibeui-number-006-fg:oklch(0.23 0.014 265);
--vibeui-number-006-muted:oklch(0.55 0.014 265);
--vibeui-number-006-border:oklch(0.88 0.008 265);
--vibeui-number-006-accent:oklch(0.56 0.18 45);
--vibeui-number-006-soft:oklch(0.56 0.18 45 / 10%);
--vibeui-number-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
background:var(--vibeui-number-006-surface);color:inherit;
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
 * Число с кнопками-дозами: они прибавляют к значению, а не задают его.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number006({
  label = "Пополнить счёт",
  steps = DEFAULT_STEPS,
  defaultValue = 250,
  max = 5000,
  unit = "₽",
  accent,
  className,
  style,
  ...props
}: Number006Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-number-006-accent": accent } : null),
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
            сбросить
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
              aria-label={`Прибавить ${step} ${unit}`}
              onClick={() => setValue(Math.min(max, value + step))}
            >
              +{step}
            </button>
          ))}
        </div>
        <p id={`${id}-hint`} data-part="hint">
          Максимум {max.toLocaleString("ru-RU")} {unit} за одно пополнение
        </p>
      </div>
    </>
  )
}
