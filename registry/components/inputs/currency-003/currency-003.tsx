"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Currency003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  currency?: string
  defaultValue?: number
  hint?: string
  accent?: string
}

// Идея компонента: кассовый ввод справа налево. Сумма хранится в копейках
// целым числом, а каждая набранная цифра сдвигает её на разряд: набрали «12345»
// — получили 123,45. Точку и запятую вводить не нужно вовсе, а значит некуда и
// промахнуться; заодно исчезает главная беда денег в JS — дробная арифметика,
// потому что складываются копейки, а не 0.1 + 0.2. Разряды расставляются на
// каждом нажатии, но курсор всегда в конце строки, поэтому ничего не прыгает.
const STYLES = `
:where([data-vibeui-block="currency-003"]){
--vibeui-currency-003-surface:oklch(1 0 0);
--vibeui-currency-003-field:oklch(0.985 0.002 265);
--vibeui-currency-003-shell:oklch(0.9 0.006 265);
--vibeui-currency-003-fg:oklch(0.22 0.014 265);
--vibeui-currency-003-muted:oklch(0.55 0.014 265);
--vibeui-currency-003-border:oklch(0.88 0.008 265);
--vibeui-currency-003-accent:oklch(0.5 0.15 150);
--vibeui-currency-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="currency-003"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-003-surface);
border:1px solid var(--vibeui-currency-003-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-003-font);color:var(--vibeui-currency-003-fg);
}
[data-vibeui-block="currency-003"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-003"] [data-part="row"]{
display:flex;align-items:baseline;gap:0.375rem;
padding:0.625rem 0.875rem;box-sizing:border-box;
border:1px solid var(--vibeui-currency-003-border);border-radius:0.75rem;
background:var(--vibeui-currency-003-field);
}
[data-vibeui-block="currency-003"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-003-accent);
box-shadow:0 0 0 2px oklch(0.5 0.15 150 / 18%);
}
/* Числа моноширинные: при вводе справа налево дрожание разрядов заметно. */
[data-vibeui-block="currency-003"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
color:inherit;font:inherit;font-size:1.625rem;font-weight:750;
text-align:right;font-variant-numeric:tabular-nums;letter-spacing:-0.01em;
}
[data-vibeui-block="currency-003"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:700;color:var(--vibeui-currency-003-muted);
}
[data-vibeui-block="currency-003"] [data-part="foot"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
font-size:0.75rem;color:var(--vibeui-currency-003-muted);
}
[data-vibeui-block="currency-003"] [data-part="kopecks"]{
font-weight:650;color:var(--vibeui-currency-003-fg);font-variant-numeric:tabular-nums;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-003"] *{animation:none!important;transition:none!important}}
`

// Форматируется всегда целое число копеек: дробная арифметика к деньгам не
// подпускается вовсе.
function format(cents: number) {
  const whole = Math.floor(cents / 100)
  const rest = String(cents % 100).padStart(2, "0")
  return `${whole.toLocaleString("ru-RU")},${rest}`
}

/**
 * Кассовый ввод суммы: цифры набираются справа налево, копейки встают сами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency003({
  label = "Сумма чека",
  currency = "₽",
  defaultValue = 1499.9,
  hint = "Точку вводить не нужно — копейки встают сами",
  accent,
  className,
  style,
  ...props
}: Currency003Props) {
  const id = useId()
  const [cents, setCents] = useState(Math.round(defaultValue * 100))

  const palette = {
    ...(accent ? { "--vibeui-currency-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="currency-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <input
            id={id}
            type="text"
            inputMode="numeric"
            value={format(cents)}
            aria-describedby={`${id}-foot`}
            onChange={(event) => {
              // Из строки берутся только цифры: разделители не редактируются,
              // а каждая новая цифра сдвигает сумму на разряд.
              const digits = event.target.value.replace(/\D/g, "").slice(0, 11)
              setCents(Number(digits) || 0)
            }}
          />
          <span data-part="sign" aria-hidden="true">
            {currency}
          </span>
        </div>
        <p id={`${id}-foot`} data-part="foot">
          <span>{hint}</span>
          <span data-part="kopecks">{cents % 100} коп.</span>
        </p>
      </div>
    </>
  )
}
