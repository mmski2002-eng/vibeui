"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Currency006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  percent?: number
  minFee?: number
  defaultValue?: number
  currency?: string
  accent?: string
}

// Идея компонента: сумма перевода вместе с комиссией и итогом к списанию.
// Поле, которое показывает только введённое число, врёт: со счёта уйдёт больше,
// и это выясняется на экране подтверждения. Здесь чек виден сразу — перевод,
// комиссия, итог, — а комиссия считается по правилу «процент, но не меньше
// минимума», как её и берут в жизни. Итог набран крупнее остального: это то
// число, которое человек сверяет с остатком на карте.
const STYLES = `
:where([data-vibeui-block="currency-006"]){
--vibeui-currency-006-surface:oklch(1 0 0);
--vibeui-currency-006-field:oklch(0.985 0.002 265);
--vibeui-currency-006-shell:oklch(0.9 0.006 265);
--vibeui-currency-006-fg:oklch(0.22 0.014 265);
--vibeui-currency-006-muted:oklch(0.55 0.014 265);
--vibeui-currency-006-border:oklch(0.88 0.008 265);
--vibeui-currency-006-accent:oklch(0.5 0.16 200);
--vibeui-currency-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: чек показывают поверх любого фона. */
[data-vibeui-block="currency-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-006-surface);
border:1px solid var(--vibeui-currency-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-006-font);color:var(--vibeui-currency-006-fg);
}
[data-vibeui-block="currency-006"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-006"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-currency-006-border);border-radius:0.75rem;
background:var(--vibeui-currency-006-field);
}
[data-vibeui-block="currency-006"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-006-accent);
box-shadow:0 0 0 2px oklch(0.5 0.16 200 / 18%);
}
[data-vibeui-block="currency-006"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-006"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-006"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-006"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:700;color:var(--vibeui-currency-006-muted);
}
/* Чек: перевод, комиссия, итог — до подтверждения, а не после. */
[data-vibeui-block="currency-006"] [data-part="check"]{
display:flex;flex-direction:column;gap:0.375rem;margin:0;
padding:0.625rem 0.75rem;border-radius:0.625rem;
background:var(--vibeui-currency-006-field);
}
[data-vibeui-block="currency-006"] [data-part="line"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
font-size:0.8125rem;color:var(--vibeui-currency-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-006"] [data-part="line"] span:last-child{color:var(--vibeui-currency-006-fg);font-weight:600}
/* Итог крупнее: это число сверяют с остатком на карте. */
[data-vibeui-block="currency-006"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
padding-top:0.375rem;border-top:1px solid var(--vibeui-currency-006-border);
font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="currency-006"] [data-part="total"] b{
font-size:1.125rem;font-weight:750;color:var(--vibeui-currency-006-accent);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-006"] [data-part="rule"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-currency-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-006"] *{animation:none!important;transition:none!important}}
`

function money(value: number) {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 2 })
}

/**
 * Сумма перевода с комиссией и итогом к списанию, посчитанными сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency006({
  label = "Сумма перевода",
  percent = 1.5,
  minFee = 50,
  defaultValue = 12000,
  currency = "₽",
  accent,
  className,
  style,
  ...props
}: Currency006Props) {
  const id = useId()
  const [amount, setAmount] = useState(defaultValue)
  // Комиссия по правилу «процент, но не меньше минимума» — так её и берут.
  const fee = amount > 0 ? Math.max(minFee, (amount * percent) / 100) : 0
  const total = amount + fee

  const palette = {
    ...(accent ? { "--vibeui-currency-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="currency-006"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="row">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            value={amount}
            aria-describedby={`${id}-check`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setAmount(Number.isFinite(next) ? Math.max(0, next) : 0)
            }}
          />
          <span data-part="sign" aria-hidden="true">
            {currency}
          </span>
        </div>
        <div id={`${id}-check`} data-part="check" aria-live="polite">
          <p data-part="line">
            <span>Получатель получит</span>
            <span>
              {money(amount)} {currency}
            </span>
          </p>
          <p data-part="line">
            <span>Комиссия {percent}%</span>
            <span>
              {money(fee)} {currency}
            </span>
          </p>
          <p data-part="total">
            <span>Спишется с карты</span>
            <b>
              {money(total)} {currency}
            </b>
          </p>
        </div>
        <p data-part="rule">
          Комиссия {percent}%, но не меньше {minFee} {currency}
        </p>
      </div>
    </>
  )
}
