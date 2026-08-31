"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  unit?: string
  accent?: string
}

// Идея компонента: число с кнопками. Поле остаётся вводимым с клавиатуры —
// набрать 47 быстрее, чем нажать кнопку сорок семь раз. Кнопки на краях
// отключаются, а не молчат: иначе непонятно, почему число перестало меняться.
// Ввод хранится строкой, поэтому промежуточное пустое поле не превращается в 0.
const STYLES = `
:where([data-vibeui-block="number-001"]){
--vibeui-number-001-bg:oklch(1 0 0);
--vibeui-number-001-surface:oklch(1 0 0);
--vibeui-number-001-shell:oklch(0.9 0.006 265);
--vibeui-number-001-fg:oklch(0.24 0.014 265);
--vibeui-number-001-muted:oklch(0.56 0.014 265);
--vibeui-number-001-border:oklch(0.88 0.008 265);
--vibeui-number-001-hover:oklch(0.55 0.02 265 / 8%);
--vibeui-number-001-accent:oklch(0.55 0.2 262);
--vibeui-number-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
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
box-shadow:0 0 0 2px oklch(0.55 0.2 262 / 22%);
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
            aria-label="Меньше"
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
            aria-label="Больше"
          >
            +
          </button>
        </div>
        <p data-part="unit">
          {unit} · от {min} до {max}
        </p>
      </div>
    </>
  )
}
