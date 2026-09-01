"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup023Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  currency?: string
  presets?: number[]
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
  hint?: string
  accent?: string
}

const DEFAULT_PRESETS = [500, 1000, 5000]

function formatAmount(value: number) {
  return value.toLocaleString("ru-RU")
}

// Идея компонента: быстрые суммы — не отдельная сущность, а короткий путь к
// тому же числовому полю. Кнопка не добавляет пресет к текущему значению, а
// заменяет его целиком — так пресет предсказуем и не зависит от того, что
// было в поле раньше. Активный пресет подсвечивается aria-pressed, только
// пока значение совпадает с ним в точности; ручной ввод гасит подсветку.
const STYLES = `
:where([data-vibeui-block="inputgroup-023"]){
--vibeui-inputgroup-023-surface:oklch(1 0 0);
--vibeui-inputgroup-023-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-023-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-023-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-023-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-023-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-023-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-023-accent:oklch(0.58 0.15 142);
--vibeui-inputgroup-023-radius:0.75rem;
--vibeui-inputgroup-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-023"]{
display:flex;flex-direction:column;gap:0.5625rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-023-surface);
border:1px solid var(--vibeui-inputgroup-023-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-023-font);color:var(--vibeui-inputgroup-023-fg);
}
[data-vibeui-block="inputgroup-023"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-023"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-023"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-023-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-023-radius) 0 0 var(--vibeui-inputgroup-023-radius);
}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-023-radius) var(--vibeui-inputgroup-023-radius) 0;
}
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-023"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-023-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-023-accent);
}
[data-vibeui-block="inputgroup-023"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-023-field);
font-size:0.9375rem;font-weight:600;font-variant-numeric:tabular-nums;
text-align:right;
}
[data-vibeui-block="inputgroup-023"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-023"] input::-webkit-inner-spin-button{
-webkit-appearance:none;margin:0;
}
[data-vibeui-block="inputgroup-023"] input{appearance:textfield}
[data-vibeui-block="inputgroup-023"] [data-part="unit"]{
flex:none;width:2.75rem;display:grid;place-items:center;
background:var(--vibeui-inputgroup-023-fixed);
font-size:0.875rem;font-weight:650;color:var(--vibeui-inputgroup-023-muted);
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"]{
display:flex;flex-wrap:wrap;gap:0.375rem;
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button{
appearance:none;cursor:pointer;height:2rem;padding:0 0.75rem;border-radius:999px;
border:1px solid var(--vibeui-inputgroup-023-border);
background:var(--vibeui-inputgroup-023-surface);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-023-fg);
transition:background-color .16s ease,border-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button:hover{
border-color:var(--vibeui-inputgroup-023-accent);
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button:focus-visible{
outline:2px solid var(--vibeui-inputgroup-023-accent);outline-offset:1px;
}
[data-vibeui-block="inputgroup-023"] [data-part="presets"] button[aria-pressed="true"]{
background:var(--vibeui-inputgroup-023-accent);border-color:var(--vibeui-inputgroup-023-accent);
color:oklch(1 0 0);
}
[data-vibeui-block="inputgroup-023"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-023-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-023"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «сумма + валюта» и ряд кнопок быстрого выбора под ней: пресет
 * заменяет значение целиком, подсветка активной кнопки следит за точным
 * совпадением с числом в поле.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup023({
  name = "amount",
  label = "Сумма пополнения",
  currency = "₽",
  presets = DEFAULT_PRESETS,
  defaultValue = 500,
  min = 0,
  max = 200000,
  step = 50,
  onChange,
  hint = "Кнопки ниже заменяют сумму целиком — число всегда можно поправить и вручную.",
  accent,
  className,
  style,
  ...props
}: Inputgroup023Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  const setAmount = (next: number) => {
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-inputgroup-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-023"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name={name}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setAmount(Number.isNaN(next) ? 0 : next)
            }}
          />
          <span data-part="unit" aria-hidden="true">
            {currency}
          </span>
        </div>
        <div data-part="presets" role="group" aria-label="Быстрый выбор суммы">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              aria-pressed={value === preset}
              onClick={() => setAmount(preset)}
            >
              {formatAmount(preset)} {currency}
            </button>
          ))}
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
