"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Input022Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  unitA?: string
  unitB?: string
  factor?: number
  defaultValue?: number
  defaultUnit?: "a" | "b"
  onChange?: (value: number, unit: string) => void
  accent?: string
}

// Идея компонента: единица измерения из выпадающего списка уже есть
// (input-010), но там число при смене единицы намеренно не пересчитывается —
// для срока действия ссылки это честно. Для веса или роста нет: килограмм и
// фунт описывают одну и ту же величину, и при переключении число обязано
// смениться вместе с единицей. Поэтому здесь не список, а переключатель из
// двух кнопок, и значение конвертируется по заданному множителю.
const STYLES = `
:where([data-vibeui-block="input-022"]){
--vibeui-input-022-surface:oklch(1 0 0);
--vibeui-input-022-shell:oklch(0.91 0.006 265);
--vibeui-input-022-fg:oklch(0.23 0.014 265);
--vibeui-input-022-muted:oklch(0.55 0.014 265);
--vibeui-input-022-field:oklch(0.985 0.002 265);
--vibeui-input-022-border:oklch(0.88 0.008 265);
--vibeui-input-022-accent:oklch(0.55 0.16 40);
--vibeui-input-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="input-022"]{
display:flex;flex-direction:column;gap:0.4375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-input-022-surface);
border:1px solid var(--vibeui-input-022-shell);border-radius:0.875rem;
font-family:var(--vibeui-input-022-font);color:var(--vibeui-input-022-fg);
}
[data-vibeui-block="input-022"] *{box-sizing:border-box}
[data-vibeui-block="input-022"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="input-022"] [data-part="frame"]{
display:flex;align-items:stretch;
height:2.75rem;
background:var(--vibeui-input-022-field);
border:1px solid var(--vibeui-input-022-border);border-radius:0.75rem;
overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="input-022"] [data-part="frame"]:focus-within{
border-color:var(--vibeui-input-022-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-input-022-accent) 18%,transparent);
}
[data-vibeui-block="input-022"] input{
flex:1;min-width:0;padding:0 0.75rem;
border:0;background:none;color:inherit;
font:inherit;font-size:1rem;font-weight:600;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="input-022"] input:focus{outline:none}
[data-vibeui-block="input-022"] input::-webkit-outer-spin-button,
[data-vibeui-block="input-022"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="input-022"] [data-part="units"]{
flex:none;display:flex;align-items:center;padding:0.25rem;gap:0.125rem;
border-left:1px solid var(--vibeui-input-022-border);
}
[data-vibeui-block="input-022"] [data-part="unit"]{
appearance:none;cursor:pointer;
height:100%;padding:0 0.625rem;border:0;border-radius:0.5rem;
background:none;color:var(--vibeui-input-022-muted);
font:inherit;font-size:0.8125rem;font-weight:650;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="input-022"] [data-part="unit"][data-active="1"]{
background:var(--vibeui-input-022-accent);color:oklch(1 0 0);
}
[data-vibeui-block="input-022"] [data-part="unit"]:hover:not([data-active="1"]){
background:color-mix(in oklab,var(--vibeui-input-022-fg) 8%,transparent);
}
[data-vibeui-block="input-022"] [data-part="unit"]:focus-visible{
outline:2px solid var(--vibeui-input-022-accent);outline-offset:2px;
}
[data-vibeui-block="input-022"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-input-022-muted);
}
[data-vibeui-block="input-022"] [data-part="note"] b{
color:var(--vibeui-input-022-fg);font-weight:650;font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="input-022"] *{animation:none!important;transition:none!important}}
`

function round(value: number) {
  return Math.round(value * 10) / 10
}

/**
 * Число с переключателем единиц из двух кнопок: значение пересчитывается
 * при смене единицы, а не остаётся прежним. Один файл, ноль зависимостей.
 */
export function Input022({
  label = "Вес",
  unitA = "кг",
  unitB = "фунты",
  factor = 2.20462,
  defaultValue = 72,
  defaultUnit = "a",
  onChange,
  accent,
  className,
  style,
  ...props
}: Input022Props) {
  const id = useId()
  const [unit, setUnit] = useState<"a" | "b">(defaultUnit)
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-input-022-accent": accent } : null),
    ...style,
  } as CSSProperties

  const currentLabel = unit === "a" ? unitA : unitB
  const otherLabel = unit === "a" ? unitB : unitA
  const other = round(unit === "a" ? value * factor : value / factor)

  const switchTo = (next: "a" | "b") => {
    if (next === unit) return
    const converted = round(unit === "a" ? value * factor : value / factor)
    setUnit(next)
    setValue(converted)
    onChange?.(converted, next === "a" ? unitA : unitB)
  }

  return (
    <>
      <style href="vibeui-input-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="input-022"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="frame">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step="0.1"
            value={value}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(next)
              onChange?.(next, currentLabel)
            }}
          />
          <span data-part="units" role="group" aria-label="Единица измерения">
            <button
              type="button"
              data-part="unit"
              data-active={unit === "a" ? "1" : "0"}
              aria-pressed={unit === "a"}
              onClick={() => switchTo("a")}
            >
              {unitA}
            </button>
            <button
              type="button"
              data-part="unit"
              data-active={unit === "b" ? "1" : "0"}
              aria-pressed={unit === "b"}
              onClick={() => switchTo("b")}
            >
              {unitB}
            </button>
          </span>
        </div>
        <p data-part="note" id={`${id}-note`} aria-live="polite">
          Это ≈{" "}
          <b>
            {other} {otherLabel}
          </b>
          .
        </p>
      </div>
    </>
  )
}
