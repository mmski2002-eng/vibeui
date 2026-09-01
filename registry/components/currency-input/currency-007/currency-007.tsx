"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Currency007Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "defaultValue"
> & {
  legend?: string
  defaultFrom?: string
  defaultTo?: string
  currency?: string
  accent?: string
}

// Идея компонента: цена «от» и «до» двумя полями, где перепутанный порядок
// молча меняется местами по уходу из поля. Ругаться на «от 12000 до 3000»
// бессмысленно: человек уже сказал, чего хочет, и просто набрал не в том поле.
// Каждая граница необязательна: одно «до 5000» — самый частый фильтр, и
// заставлять придумывать нижнюю границу не за что. Итоговая формулировка
// собирается словами и меняется в зависимости от того, что заполнено.
const STYLES = `
:where([data-vibeui-block="currency-007"]){
--vibeui-currency-007-surface:oklch(1 0 0);
--vibeui-currency-007-field:oklch(0.985 0.002 265);
--vibeui-currency-007-shell:oklch(0.9 0.006 265);
--vibeui-currency-007-fg:oklch(0.22 0.014 265);
--vibeui-currency-007-muted:oklch(0.55 0.014 265);
--vibeui-currency-007-border:oklch(0.88 0.008 265);
--vibeui-currency-007-accent:oklch(0.55 0.18 40);
--vibeui-currency-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="currency-007"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:21rem;box-sizing:border-box;margin:0;padding:0.875rem;
background:var(--vibeui-currency-007-surface);
border:1px solid var(--vibeui-currency-007-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-007-font);color:var(--vibeui-currency-007-fg);
}
/* legend во float даёт обтекание: clear возвращает нормальный поток. */
[data-vibeui-block="currency-007"] legend{
float:left;width:100%;padding:0;margin-bottom:0.5rem;font-size:0.875rem;font-weight:650;
}
[data-vibeui-block="currency-007"] [data-part="pair"]{
clear:both;display:flex;align-items:stretch;gap:0.375rem;
}
[data-vibeui-block="currency-007"] [data-part="cell"]{
flex:1 1 0;min-width:0;display:flex;align-items:center;gap:0.25rem;
padding:0 0.625rem;box-sizing:border-box;height:2.75rem;
border:1px solid var(--vibeui-currency-007-border);border-radius:0.625rem;
background:var(--vibeui-currency-007-field);
}
[data-vibeui-block="currency-007"] [data-part="cell"]:focus-within{
border-color:var(--vibeui-currency-007-accent);
box-shadow:0 0 0 2px oklch(0.55 0.18 40 / 18%);
}
[data-vibeui-block="currency-007"] [data-part="prefix"]{
flex:none;font-size:0.75rem;font-weight:650;color:var(--vibeui-currency-007-muted);
}
[data-vibeui-block="currency-007"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:0.9375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-007"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-007"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-007"] input::placeholder{font-weight:500;color:var(--vibeui-currency-007-muted)}
[data-vibeui-block="currency-007"] [data-part="dash"]{
display:flex;align-items:center;flex:none;color:var(--vibeui-currency-007-muted);
}
[data-vibeui-block="currency-007"] [data-part="sign"]{
flex:none;font-size:0.8125rem;font-weight:650;color:var(--vibeui-currency-007-muted);
}
[data-vibeui-block="currency-007"] [data-part="summary"]{
margin:0;font-size:0.75rem;color:var(--vibeui-currency-007-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-007"] [data-part="summary"] b{color:var(--vibeui-currency-007-fg);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-007"] *{animation:none!important;transition:none!important}}
`

function pretty(value: string) {
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString("ru-RU") : value
}

/**
 * Цена «от» и «до»: обе границы необязательны, перепутанный порядок меняется местами.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency007({
  legend = "Цена",
  defaultFrom = "3000",
  defaultTo = "12000",
  currency = "₽",
  accent,
  className,
  style,
  ...props
}: Currency007Props) {
  const id = useId()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)

  // Порядок чинится обменом, а не ошибкой: человек просто набрал не в том поле.
  const settle = () => {
    if (from !== "" && to !== "" && Number(from) > Number(to)) {
      setFrom(to)
      setTo(from)
    }
  }

  const summary =
    from === "" && to === ""
      ? "Любая цена"
      : from === ""
        ? `До ${pretty(to)} ${currency}`
        : to === ""
          ? `От ${pretty(from)} ${currency}`
          : `От ${pretty(from)} до ${pretty(to)} ${currency}`

  const palette = {
    ...(accent ? { "--vibeui-currency-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-007" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="currency-007"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        <div data-part="pair">
          <div data-part="cell">
            <span data-part="prefix" aria-hidden="true">
              от
            </span>
            <input
              id={`${id}-from`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={from}
              placeholder="0"
              aria-label={`Цена от, ${currency}`}
              onChange={(event) => setFrom(event.target.value)}
              onBlur={settle}
            />
            <span data-part="sign" aria-hidden="true">
              {currency}
            </span>
          </div>
          <span data-part="dash" aria-hidden="true">
            —
          </span>
          <div data-part="cell">
            <span data-part="prefix" aria-hidden="true">
              до
            </span>
            <input
              id={`${id}-to`}
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              value={to}
              placeholder="∞"
              aria-label={`Цена до, ${currency}`}
              onChange={(event) => setTo(event.target.value)}
              onBlur={settle}
            />
            <span data-part="sign" aria-hidden="true">
              {currency}
            </span>
          </div>
        </div>
        <p data-part="summary" aria-live="polite">
          Фильтр: <b>{summary}</b>
        </p>
      </fieldset>
    </>
  )
}
