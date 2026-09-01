"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup011Currency = {
  code: string
  symbol: string
}

export type Inputgroup011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue"
> & {
  name?: string
  label?: string
  currencies?: Inputgroup011Currency[]
  defaultValue?: number
  hint?: string
  accent?: string
}

// Идея компонента: символ валюты слева не выбирается — он лишь отражает то,
// что выбрано в select справа. Два родственных поля живут в одной рамке:
// правый select управляет состоянием, левый префикс о нём только сообщает.
// Символ не интерактивен (span с aria-hidden), поэтому таб-порядок остаётся
// коротким — сумма и выбор валюты, без остановки на декорации.
const STYLES = `
:where([data-vibeui-block="inputgroup-011"]){
--vibeui-inputgroup-011-surface:oklch(1 0 0);
--vibeui-inputgroup-011-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-011-fg:oklch(0.21 0.014 265);
--vibeui-inputgroup-011-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-011-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-011-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-011-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-011-accent:oklch(0.5 0.16 145);
--vibeui-inputgroup-011-radius:0.75rem;
--vibeui-inputgroup-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-011"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-011-surface);
border:1px solid var(--vibeui-inputgroup-011-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-011-font);color:var(--vibeui-inputgroup-011-fg);
}
[data-vibeui-block="inputgroup-011"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-011"] [data-part="group"]{display:flex;align-items:stretch}
[data-vibeui-block="inputgroup-011"] [data-part="group"] > *{
position:relative;height:2.875rem;
border:1px solid var(--vibeui-inputgroup-011-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-011"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-011-radius) 0 0 var(--vibeui-inputgroup-011-radius);
}
[data-vibeui-block="inputgroup-011"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-011-radius) var(--vibeui-inputgroup-011-radius) 0;
}
[data-vibeui-block="inputgroup-011"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-011"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-011-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-011-accent);
}
/* Символ отражает состояние select, но сам не мишень: без курсора и фокуса. */
[data-vibeui-block="inputgroup-011"] [data-part="symbol"]{
flex:none;width:2.75rem;display:grid;place-items:center;
background:var(--vibeui-inputgroup-011-fixed);
font-size:1.0625rem;font-weight:700;color:var(--vibeui-inputgroup-011-accent);
user-select:none;
}
[data-vibeui-block="inputgroup-011"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-011-field);
font-size:1.125rem;font-weight:650;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-011"] input::-webkit-outer-spin-button,
[data-vibeui-block="inputgroup-011"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="inputgroup-011"] select{
appearance:none;flex:none;width:6.5ch;padding:0 1.5rem 0 0.75rem;cursor:pointer;
background:var(--vibeui-inputgroup-011-fixed);
font-size:0.875rem;font-weight:650;color:var(--vibeui-inputgroup-011-muted);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.9rem) 50%,calc(100% - 0.6rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-011"] select:focus{color:var(--vibeui-inputgroup-011-fg)}
[data-vibeui-block="inputgroup-011"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-011-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_CURRENCIES: Inputgroup011Currency[] = [
  { code: "RUB", symbol: "₽" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "KZT", symbol: "₸" },
]

/**
 * Сцепка «символ + сумма + валюта»: символ слева следует за выбором справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup011({
  name = "amount",
  label = "Сумма перевода",
  currencies = DEFAULT_CURRENCIES,
  defaultValue = 5000,
  hint = "Символ слева меняется вместе с выбором валюты — сверять их не нужно.",
  accent,
  className,
  style,
  ...props
}: Inputgroup011Props) {
  const id = useId()
  const [code, setCode] = useState(currencies[0]?.code ?? "RUB")

  const selected =
    currencies.find((currency) => currency.code === code) ?? currencies[0]

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-011"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="symbol" aria-hidden="true">
            {selected?.symbol}
          </span>
          <input
            id={id}
            name={name}
            type="number"
            inputMode="decimal"
            min={0}
            step={50}
            defaultValue={defaultValue}
            aria-describedby={`${id}-hint`}
          />
          <select
            name={`${name}-currency`}
            aria-label="Валюта"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code}
              </option>
            ))}
          </select>
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
