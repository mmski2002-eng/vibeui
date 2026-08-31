"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Currency005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  limit?: number
  defaultValue?: number
  currency?: string
  accent?: string
}

// Идея компонента: бюджет с потолком, который виден до ошибки, а не после.
// Обычное поле с max молчит до отправки формы, и о превышении узнают на
// последнем шаге. Здесь полоса заполняется по мере ввода, а на подходе к
// лимиту меняет цвет: остаток читается площадью быстрее, чем цифрой. Ввод
// выше лимита не запрещается — он помечается как ошибка, потому что человек
// часто сначала набирает нужную сумму, а потом идёт повышать лимит.
const STYLES = `
:where([data-vibeui-block="currency-005"]){
--vibeui-currency-005-surface:oklch(1 0 0);
--vibeui-currency-005-field:oklch(0.985 0.002 265);
--vibeui-currency-005-shell:oklch(0.9 0.006 265);
--vibeui-currency-005-fg:oklch(0.22 0.014 265);
--vibeui-currency-005-muted:oklch(0.55 0.014 265);
--vibeui-currency-005-border:oklch(0.88 0.008 265);
--vibeui-currency-005-track:oklch(0.93 0.006 265);
--vibeui-currency-005-ok:oklch(0.55 0.15 160);
--vibeui-currency-005-near:oklch(0.68 0.15 70);
--vibeui-currency-005-over:oklch(0.56 0.19 25);
--vibeui-currency-005-accent:var(--vibeui-currency-005-ok);
--vibeui-currency-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-currency-005-fill:0%;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="currency-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-currency-005-surface);
border:1px solid var(--vibeui-currency-005-shell);border-radius:0.875rem;
font-family:var(--vibeui-currency-005-font);color:var(--vibeui-currency-005-fg);
}
/* Одна переменная на состояние: полоса, рамка и текст меняются разом. */
[data-vibeui-block="currency-005"][data-state="near"]{--vibeui-currency-005-accent:var(--vibeui-currency-005-near)}
[data-vibeui-block="currency-005"][data-state="over"]{--vibeui-currency-005-accent:var(--vibeui-currency-005-over)}
[data-vibeui-block="currency-005"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;margin:0;
}
[data-vibeui-block="currency-005"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="currency-005"] [data-part="limit"]{
font-size:0.6875rem;color:var(--vibeui-currency-005-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-005"] [data-part="row"]{
display:flex;align-items:center;gap:0.375rem;
padding:0 0.875rem;box-sizing:border-box;height:3rem;
border:1px solid var(--vibeui-currency-005-border);border-radius:0.75rem;
background:var(--vibeui-currency-005-field);
transition:border-color .16s ease;
}
[data-vibeui-block="currency-005"][data-state="over"] [data-part="row"]{border-color:var(--vibeui-currency-005-over)}
[data-vibeui-block="currency-005"] [data-part="row"]:focus-within{
border-color:var(--vibeui-currency-005-accent);
box-shadow:0 0 0 2px color-mix(in oklch,var(--vibeui-currency-005-accent) 20%,transparent);
}
[data-vibeui-block="currency-005"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;text-align:right;
font:inherit;font-size:1.375rem;font-weight:700;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="currency-005"] input::-webkit-outer-spin-button,
[data-vibeui-block="currency-005"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="currency-005"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:700;color:var(--vibeui-currency-005-muted);
}
/* Остаток читается площадью быстрее, чем цифрой. */
[data-vibeui-block="currency-005"] [data-part="bar"]{
height:0.375rem;border-radius:9999px;background:var(--vibeui-currency-005-track);overflow:hidden;
}
[data-vibeui-block="currency-005"] [data-part="fill"]{
display:block;height:100%;width:var(--vibeui-currency-005-fill);
background:var(--vibeui-currency-005-accent);
transition:width .18s ease,background-color .18s ease;
}
[data-vibeui-block="currency-005"] [data-part="note"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-currency-005-muted);
}
[data-vibeui-block="currency-005"][data-state="over"] [data-part="note"]{color:var(--vibeui-currency-005-over);font-weight:650}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="currency-005"] *{animation:none!important;transition:none!important}}
`

/**
 * Поле бюджета с потолком: полоса остатка и предупреждение до отправки формы.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Currency005({
  label = "Бюджет кампании",
  limit = 100000,
  defaultValue = 68000,
  currency = "₽",
  accent,
  className,
  style,
  ...props
}: Currency005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const share = limit > 0 ? value / limit : 0
  const state = share > 1 ? "over" : share >= 0.85 ? "near" : "ok"
  const rest = limit - value

  const palette = {
    "--vibeui-currency-005-fill": `${Math.min(100, Math.max(0, share * 100))}%`,
    ...(accent ? { "--vibeui-currency-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-currency-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="currency-005"
        data-state={state}
        className={className}
        style={palette}
      >
        <p data-part="head">
          <label htmlFor={id}>{label}</label>
          <span data-part="limit">
            потолок {limit.toLocaleString("ru-RU")} {currency}
          </span>
        </p>
        <div data-part="row">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={value}
            aria-invalid={state === "over"}
            aria-describedby={`${id}-note`}
            onChange={(event) => {
              const next = Number(event.target.value)
              setValue(Number.isFinite(next) ? Math.max(0, next) : 0)
            }}
          />
          <span data-part="sign" aria-hidden="true">
            {currency}
          </span>
        </div>
        <div data-part="bar" aria-hidden="true">
          <span data-part="fill" />
        </div>
        <p id={`${id}-note`} data-part="note" aria-live="polite">
          {state === "over"
            ? `Превышение на ${Math.abs(rest).toLocaleString("ru-RU")} ${currency} — уменьшите сумму или поднимите лимит.`
            : `Останется ${rest.toLocaleString("ru-RU")} ${currency} из месячного лимита.`}
        </p>
      </div>
    </>
  )
}
