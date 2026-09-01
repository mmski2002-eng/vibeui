"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup036Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  name?: string
  legend?: string
  defaultFrom?: number | string
  defaultTo?: number | string
  min?: number
  max?: number
  onChange?: (from: string, to: string, valid: boolean) => void
  hint?: string
  accent?: string
}

// Идея компонента: в отличие от диапазона с датами, у чисел нет нативного
// min/max, который бы сам не пускал пользователя ввести «до» меньше «от» —
// проверку приходится делать в JS после каждого изменения любой половины.
// Ошибка красит всю сцепку целиком, а не одну половину: «от» без «до» и
// «до» без «от» одинаково неполны, виновата пара, а не один инпут.
const STYLES = `
:where([data-vibeui-block="inputgroup-036"]){
--vibeui-inputgroup-036-surface:oklch(1 0 0);
--vibeui-inputgroup-036-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-036-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-036-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-036-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-036-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-036-accent:oklch(0.55 0.15 280);
--vibeui-inputgroup-036-error:oklch(0.56 0.19 25);
--vibeui-inputgroup-036-radius:0.75rem;
--vibeui-inputgroup-036-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-036"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-036-surface);
border:1px solid var(--vibeui-inputgroup-036-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-036-font);color:var(--vibeui-inputgroup-036-fg);
}
[data-vibeui-block="inputgroup-036"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-036"] fieldset{margin:0;padding:0;border:0;display:flex;flex-direction:column;gap:0.4375rem}
[data-vibeui-block="inputgroup-036"] legend{padding:0;font-size:0.8125rem;font-weight:600;float:left;width:100%}
[data-vibeui-block="inputgroup-036"] [data-part="group"]{
display:flex;align-items:stretch;clear:both;
border-radius:var(--vibeui-inputgroup-036-radius);
box-shadow:0 0 0 1px var(--vibeui-inputgroup-036-border);
}
[data-vibeui-block="inputgroup-036"] [data-part="group"][data-invalid="true"]{
box-shadow:0 0 0 2px var(--vibeui-inputgroup-036-error);
}
[data-vibeui-block="inputgroup-036"] [data-part="half"]{
flex:1;min-width:0;display:flex;flex-direction:column;position:relative;
}
[data-vibeui-block="inputgroup-036"] [data-part="half"] + [data-part="half"]{
box-shadow:inset 1px 0 0 var(--vibeui-inputgroup-036-border);
}
[data-vibeui-block="inputgroup-036"] [data-part="half"] span{
padding:0.4375rem 0.75rem 0;font-size:0.6875rem;color:var(--vibeui-inputgroup-036-muted);
}
[data-vibeui-block="inputgroup-036"] input{
height:2.375rem;border:0;background:var(--vibeui-inputgroup-036-field);
padding:0 0.75rem;font:inherit;font-size:0.875rem;color:inherit;
font-variant-numeric:tabular-nums;border-radius:inherit;
}
[data-vibeui-block="inputgroup-036"] [data-part="half"]:first-child input{
border-radius:var(--vibeui-inputgroup-036-radius) 0 0 var(--vibeui-inputgroup-036-radius);
}
[data-vibeui-block="inputgroup-036"] [data-part="half"]:last-child input{
border-radius:0 var(--vibeui-inputgroup-036-radius) var(--vibeui-inputgroup-036-radius) 0;
}
[data-vibeui-block="inputgroup-036"] input:focus,
[data-vibeui-block="inputgroup-036"] input:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-036-accent);outline-offset:-2px;
}
[data-vibeui-block="inputgroup-036"] [data-part="error"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-036-error);font-weight:600;
}
[data-vibeui-block="inputgroup-036"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-036-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-036"] *{transition:none!important}}
`

function toNumber(value: string): number | null {
  if (value.trim() === "") return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

/**
 * Сцепка «от — до» с общей рамкой и активной проверкой порядка: значение
 * «до» меньше «от» красит всю группу и выводит сообщение об ошибке, а не
 * полагается на нативный min, которого у произвольных чисел нет.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup036({
  name = "range",
  legend = "Возраст участников",
  defaultFrom = 18,
  defaultTo = 65,
  min,
  max,
  onChange,
  hint = "Проверка порядка идёт на лету: «до» меньше «от» подсвечивает всю сцепку.",
  accent,
  className,
  style,
  ...props
}: Inputgroup036Props) {
  const id = useId()
  const [from, setFrom] = useState(String(defaultFrom))
  const [to, setTo] = useState(String(defaultTo))

  const fromNumber = toNumber(from)
  const toNumberValue = toNumber(to)
  const invalid =
    fromNumber !== null && toNumberValue !== null && fromNumber > toNumberValue

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-036-accent": accent } : null),
    ...style,
  } as CSSProperties

  const emit = (nextFrom: string, nextTo: string) => {
    const a = toNumber(nextFrom)
    const b = toNumber(nextTo)
    const valid = !(a !== null && b !== null && a > b)
    onChange?.(nextFrom, nextTo, valid)
  }

  return (
    <>
      <style href="vibeui-inputgroup-036" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-036"
        className={className}
        style={palette}
      >
        <fieldset aria-describedby={invalid ? `${id}-error` : `${id}-hint`}>
          <legend>{legend}</legend>
          <div data-part="group" data-invalid={invalid}>
            <div data-part="half">
              <span id={`${id}-from-label`}>От</span>
              <input
                id={`${id}-from`}
                name={`${name}-from`}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={from}
                aria-labelledby={`${id}-from-label`}
                aria-invalid={invalid}
                onChange={(event) => {
                  const next = event.target.value
                  setFrom(next)
                  emit(next, to)
                }}
              />
            </div>
            <div data-part="half">
              <span id={`${id}-to-label`}>До</span>
              <input
                id={`${id}-to`}
                name={`${name}-to`}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={to}
                aria-labelledby={`${id}-to-label`}
                aria-invalid={invalid}
                onChange={(event) => {
                  const next = event.target.value
                  setTo(next)
                  emit(from, next)
                }}
              />
            </div>
          </div>
        </fieldset>
        {invalid ? (
          <p data-part="error" id={`${id}-error`} role="alert">
            Значение «до» не может быть меньше значения «от».
          </p>
        ) : (
          <p data-part="hint" id={`${id}-hint`}>
            {hint}
          </p>
        )}
      </div>
    </>
  )
}
