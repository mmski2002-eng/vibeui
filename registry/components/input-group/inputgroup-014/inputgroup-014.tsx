"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup014Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  unit?: string
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  hint?: string
  accent?: string
}

// Идея компонента: единица измерения — часть значения, а не соседний
// текст, поэтому она стоит внутри той же рамки сразу после числа, а не
// табличкой снаружи. Шаговые кнопки по краям меняют то же число, что и
// стрелки клавиатуры в поле — состояние одно на троих. На границе
// диапазона кнопка не прячется, а становится некликабельной: пропавшая
// кнопка на краю шкалы выглядит как баг, а не как предел.
const STYLES = `
:where([data-vibeui-block="inputgroup-014"]){
--vibeui-inputgroup-014-surface:oklch(1 0 0);
--vibeui-inputgroup-014-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-014-fg:oklch(0.23 0.014 265);
--vibeui-inputgroup-014-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-014-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-014-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-014-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-014-accent:oklch(0.52 0.17 40);
--vibeui-inputgroup-014-radius:0.75rem;
--vibeui-inputgroup-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-014"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:19rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-014-surface);
border:1px solid var(--vibeui-inputgroup-014-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-014-font);color:var(--vibeui-inputgroup-014-fg);
}
[data-vibeui-block="inputgroup-014"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-014"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-014"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *{
position:relative;height:2.875rem;
border:1px solid var(--vibeui-inputgroup-014-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-014-radius) 0 0 var(--vibeui-inputgroup-014-radius);
}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-014-radius) var(--vibeui-inputgroup-014-radius) 0;
}
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-014"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-014-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-014-accent);
}
[data-vibeui-block="inputgroup-014"] [data-part="step"]{
appearance:none;flex:none;width:2.75rem;cursor:pointer;
display:grid;place-items:center;
background:var(--vibeui-inputgroup-014-fixed);
color:var(--vibeui-inputgroup-014-fg);font-size:1.125rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="inputgroup-014"] [data-part="step"]:hover:not(:disabled){
background:color-mix(in oklab,var(--vibeui-inputgroup-014-accent) 16%,var(--vibeui-inputgroup-014-fixed));
}
/* На краю диапазона кнопка гаснет, но остаётся на месте — так виден предел. */
[data-vibeui-block="inputgroup-014"] [data-part="step"]:disabled{
cursor:not-allowed;color:var(--vibeui-inputgroup-014-muted);opacity:0.5;
}
[data-vibeui-block="inputgroup-014"] [data-part="step"] svg{width:0.8125rem;height:0.8125rem;display:block}
[data-vibeui-block="inputgroup-014"] input{
flex:1;min-width:0;padding:0 0.5rem;text-align:center;
background:var(--vibeui-inputgroup-014-field);
font-size:1.0625rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-014"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-014"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="inputgroup-014"] [data-part="unit"]{
flex:none;display:flex;align-items:center;padding:0 0.75rem;
background:var(--vibeui-inputgroup-014-fixed);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-014-muted);
user-select:none;
}
[data-vibeui-block="inputgroup-014"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-014-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-014"] *{animation:none!important;transition:none!important}}
`

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Сцепка «шаг вниз + число с единицей + шаг вверх»: одно состояние на все три части.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup014({
  name = "weight",
  label = "Вес посылки",
  unit = "кг",
  defaultValue = 5,
  min = 0,
  max = 50,
  step = 1,
  hint = "Меняйте кнопками по краям или стрелками клавиатуры внутри поля.",
  accent,
  className,
  style,
  ...props
}: Inputgroup014Props) {
  const id = useId()
  const [value, setValue] = useState(clamp(defaultValue, min, max))

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-014-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-014"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <button
            type="button"
            data-part="step"
            aria-label="Уменьшить"
            disabled={value <= min}
            onClick={() =>
              setValue((current) => clamp(current - step, min, max))
            }
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M2 6h8" strokeLinecap="round" />
            </svg>
          </button>
          <input
            id={id}
            name={name}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!Number.isNaN(next)) {
                setValue(clamp(next, min, max))
              }
            }}
          />
          <span data-part="unit" aria-hidden="true">
            {unit}
          </span>
          <button
            type="button"
            data-part="step"
            aria-label="Увеличить"
            disabled={value >= max}
            onClick={() =>
              setValue((current) => clamp(current + step, min, max))
            }
          >
            <svg
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 2v8M2 6h8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
