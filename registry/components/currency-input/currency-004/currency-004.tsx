"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Currency004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  rate?: number
  from?: string
  to?: string
  defaultValue?: number
  updatedAt?: string
  accent?: string
}

// Идея компонента: две суммы, связанные курсом, и править можно любую. Обычный
// конвертер делает одно поле ведущим, и человек, который знает нужную сумму в
// валюте зачисления, вынужден подбирать её делением в уме. Здесь оба поля
// живые: правка верхнего умножает на курс, правка нижнего делит. Хранится одна
// база — сумма отправления, поэтому округление случается один раз и суммы не
// расходятся при правках туда-обратно. Курс подписан вместе со временем: без
// времени он выглядит как обещание, а не как справка.
const STYLES = `
:where([data-vibeui-block="currency-004"]){
--vibeui-currency-004-surface:oklch(1 0 0);
--vibeui-currency-004-field:oklch(0.985 0.002 265);
--vibeui-currency-004-shell:oklch(0.9 0.006 265);
--vibeui-currency-004-fg:oklch(0.22 0.014 265);
--vibeui-currency-004-muted:oklch(0.55 0.014 265);
--vibeui-currency-004-border:oklch(0.88 0.008 265);
--vibeui-currency-004-accent:oklch(0.53 0.16 285);
--vibeui-currency-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: конвертер показывают поверх любого фона. */
[data-vibeui-block="currency-004"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-004-surface);
border:1px solid var(--vibeui-currency-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-004-font);color:var(--vibeui-currency-004-fg);
}
[data-vibeui-block="currency-004"] [data-part="title"]{margin:0 0 0.125rem;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-004"] [data-part="line"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.875rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-currency-004-border);border-radius:0.75rem;
background:var(--vibeui-currency-004-field);
}
[data-vibeui-block="currency-004"] [data-part="line"]:focus-within{
border-color:var(--vibeui-currency-004-accent);
box-shadow:0 0 0 2px oklch(0.53 0.16 285 / 18%);
}
[data-vibeui-block="currency-004"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;
font:inherit;font-size:1.25rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-004"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-004"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-004"] [data-part="code"]{
flex:none;font-size:0.8125rem;font-weight:700;letter-spacing:0.04em;
color:var(--vibeui-currency-004-muted);
}
/* Стрелка между полями: связь двух сумм видна до первой правки. */
[data-vibeui-block="currency-004"] [data-part="link"]{
display:flex;align-items:center;gap:0.5rem;margin:0.0625rem 0;
font-size:0.6875rem;color:var(--vibeui-currency-004-muted);
}
[data-vibeui-block="currency-004"] [data-part="link"]::before,
[data-vibeui-block="currency-004"] [data-part="link"]::after{
content:"";flex:1 1 auto;height:1px;background:var(--vibeui-currency-004-border);
}
[data-vibeui-block="currency-004"] [data-part="rate"]{
margin:0.25rem 0 0;font-size:0.75rem;color:var(--vibeui-currency-004-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-004"] [data-part="rate"] b{color:var(--vibeui-currency-004-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-004"] *{animation:none!important;transition:none!important}}
`

function round(value: number) {
  return Math.round(value * 100) / 100
}

/**
 * Две суммы, связанные курсом: править можно любую, база хранится одна.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency004({
  label = "Перевод за границу",
  rate = 0.0104,
  from = "RUB",
  to = "EUR",
  defaultValue = 50000,
  updatedAt = "курс на 12:40, обновляется каждые 15 минут",
  accent,
  className,
  style,
  ...props
}: Currency004Props) {
  const id = useId()
  // База — сумма отправления: одно место округления вместо двух расходящихся.
  const [source, setSource] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-currency-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="currency-004"
        className={className}
        style={palette}
      >
        <p data-part="title">{label}</p>
        <div data-part="line">
          <input
            id={`${id}-from`}
            type="number"
            inputMode="decimal"
            min={0}
            value={round(source)}
            aria-label={`Сумма в ${from}`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setSource(Number.isFinite(next) ? Math.max(0, next) : 0)
            }}
          />
          <span data-part="code">{from}</span>
        </div>
        <p data-part="link">по курсу</p>
        <div data-part="line">
          <input
            id={`${id}-to`}
            type="number"
            inputMode="decimal"
            min={0}
            value={round(source * rate)}
            aria-label={`Сумма в ${to}`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setSource(Number.isFinite(next) ? Math.max(0, next) / rate : 0)
            }}
          />
          <span data-part="code">{to}</span>
        </div>
        <p data-part="rate">
          1 {to} = <b>{round(1 / rate).toLocaleString("ru-RU")}</b> {from} ·{" "}
          {updatedAt}
        </p>
      </div>
    </>
  )
}
