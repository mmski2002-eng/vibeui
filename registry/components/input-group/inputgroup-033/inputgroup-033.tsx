"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup033Unit = {
  value: string
  label: string
}

export type Inputgroup033Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  name?: string
  label?: string
  units?: Inputgroup033Unit[]
  defaultValue?: string
  defaultUnit?: string
  onChange?: (value: string, unit: string) => void
  hint?: string
  accent?: string
}

const UNITS: Inputgroup033Unit[] = [
  { value: "min", label: "мин" },
  { value: "hour", label: "час" },
  { value: "day", label: "день" },
]

// Идея компонента: длительность — это число и единица измерения вместе, а не
// два независимых поля. Единица уходит нативным select справа от числа: она
// не пересчитывает значение (10 минут при смене на «час» не становится
// 10 часами случайно), это осознанно — пересчёт делает вызывающий код через
// onChange, у которого всегда есть оба значения разом.
const STYLES = `
:where([data-vibeui-block="inputgroup-033"]){
--vibeui-inputgroup-033-surface:oklch(1 0 0);
--vibeui-inputgroup-033-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-033-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-033-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-033-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-033-fixed:oklch(0.965 0.003 265);
--vibeui-inputgroup-033-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-033-accent:oklch(0.55 0.15 200);
--vibeui-inputgroup-033-radius:0.75rem;
--vibeui-inputgroup-033-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-033"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-033-surface);
border:1px solid var(--vibeui-inputgroup-033-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-033-font);color:var(--vibeui-inputgroup-033-fg);
}
[data-vibeui-block="inputgroup-033"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-033"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-033"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-033"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-033-border);
border-radius:0;margin-left:-1px;font:inherit;font-size:0.875rem;color:inherit;
}
[data-vibeui-block="inputgroup-033"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-033-radius) 0 0 var(--vibeui-inputgroup-033-radius);
}
[data-vibeui-block="inputgroup-033"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-033-radius) var(--vibeui-inputgroup-033-radius) 0;
}
[data-vibeui-block="inputgroup-033"] [data-part="group"] > *:focus{
z-index:1;outline:2px solid var(--vibeui-inputgroup-033-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-033-accent);
}
[data-vibeui-block="inputgroup-033"] input{
flex:1;min-width:0;padding:0 0.875rem;
background:var(--vibeui-inputgroup-033-field);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-033"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-033"] input::-webkit-inner-spin-button{margin:0}
[data-vibeui-block="inputgroup-033"] select{
appearance:none;flex:none;width:5.5ch;padding:0 1.5rem 0 0.75rem;cursor:pointer;
background:var(--vibeui-inputgroup-033-fixed);
font-weight:600;
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.9rem) 50%,calc(100% - 0.6rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-033"] [data-part="preview"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-033-muted);
}
[data-vibeui-block="inputgroup-033"] [data-part="preview"] strong{
color:var(--vibeui-inputgroup-033-fg);font-weight:650;
}
[data-vibeui-block="inputgroup-033"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-033-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-033"] *{transition:none!important}}
`

/**
 * Сцепка «число + единица времени»: числовое поле слева, нативный select
 * с мин/час/день справа, итог одной фразой под рамкой. Единица не
 * пересчитывает число — это делает вызывающий код через onChange.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup033({
  name = "delay",
  label = "Через сколько напомнить",
  units = UNITS,
  defaultValue = "30",
  defaultUnit = units[0]?.value ?? "min",
  onChange,
  hint = "Единица не пересчитывает число: 30 минут при смене на «час» не станут 30 часами.",
  accent,
  className,
  style,
  ...props
}: Inputgroup033Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [unit, setUnit] = useState(defaultUnit)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-033-accent": accent } : null),
    ...style,
  } as CSSProperties

  const unitLabel =
    units.find((item) => item.value === unit)?.label ?? units[0]?.label ?? ""

  return (
    <>
      <style href="vibeui-inputgroup-033" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-033"
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
            min={0}
            step={1}
            value={value}
            aria-describedby={`${id}-preview ${id}-hint`}
            onChange={(event) => {
              const next = event.target.value
              setValue(next)
              onChange?.(next, unit)
            }}
          />
          <select
            name={`${name}-unit`}
            aria-label="Единица времени"
            value={unit}
            onChange={(event) => {
              const next = event.target.value
              setUnit(next)
              onChange?.(value, next)
            }}
          >
            {units.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <p data-part="preview" id={`${id}-preview`}>
          Напомнить через <strong>{value || "0"} {unitLabel}</strong>
        </p>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
