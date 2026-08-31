"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Number004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "defaultValue" | "onChange"
> & {
  label?: string
  defaultValue?: number
  error?: string
  accent?: string
}

// Идея компонента: процент, который не зажимается молча. 150 вместо 15 —
// это опечатка, и подменять её на 100 значит спрятать ошибку: пользователь
// увидит верное на вид число и уедет с неверными данными. Поэтому выход за
// 0–100 остаётся в поле, помечается aria-invalid и объясняется словами.
// Полоса под полем показывает долю сразу: проценты воспринимают площадью.
const STYLES = `
:where([data-vibeui-block="number-004"]){
--vibeui-number-004-surface:oklch(1 0 0);
--vibeui-number-004-field:oklch(1 0 0);
--vibeui-number-004-shell:oklch(0.9 0.006 265);
--vibeui-number-004-fg:oklch(0.23 0.014 265);
--vibeui-number-004-muted:oklch(0.55 0.014 265);
--vibeui-number-004-border:oklch(0.88 0.008 265);
--vibeui-number-004-track:oklch(0.93 0.006 265);
--vibeui-number-004-accent:oklch(0.58 0.17 285);
--vibeui-number-004-danger:oklch(0.55 0.19 25);
--vibeui-number-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-number-004-fill:0%;
}
/* Своя светлая подложка: поле показывают поверх любого фона. */
[data-vibeui-block="number-004"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-number-004-surface);
border:1px solid var(--vibeui-number-004-shell);border-radius:0.875rem;
font-family:var(--vibeui-number-004-font);color:var(--vibeui-number-004-fg);
}
[data-vibeui-block="number-004"] label{font-size:0.8125rem;font-weight:650}
[data-vibeui-block="number-004"] [data-part="field"]{
display:flex;align-items:center;gap:0.25rem;
padding:0 0.75rem;box-sizing:border-box;height:2.75rem;
border:1px solid var(--vibeui-number-004-border);border-radius:0.625rem;
background:var(--vibeui-number-004-field);
transition:border-color .14s ease,box-shadow .14s ease;
}
[data-vibeui-block="number-004"] [data-part="field"]:focus-within{
border-color:var(--vibeui-number-004-accent);
box-shadow:0 0 0 2px oklch(0.58 0.17 285 / 20%);
}
/* Ошибка не прячется: неверное число остаётся в поле и подсвечивается. */
[data-vibeui-block="number-004"][data-invalid="true"] [data-part="field"]{
border-color:var(--vibeui-number-004-danger);
box-shadow:0 0 0 2px oklch(0.55 0.19 25 / 18%);
}
[data-vibeui-block="number-004"] input{
flex:1 1 auto;min-width:0;width:100%;
appearance:none;border:0;background:none;outline:none;
height:100%;color:inherit;
font:inherit;font-size:1.375rem;font-weight:700;text-align:right;
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="number-004"] input::-webkit-outer-spin-button,
[data-vibeui-block="number-004"] input::-webkit-inner-spin-button{appearance:none;margin:0}
[data-vibeui-block="number-004"] [data-part="sign"]{
flex:none;font-size:1.125rem;font-weight:650;color:var(--vibeui-number-004-muted);
}
/* Долю читают площадью, а не цифрой: полоса отвечает мгновенно. */
[data-vibeui-block="number-004"] [data-part="bar"]{
height:0.375rem;border-radius:9999px;overflow:hidden;
background:var(--vibeui-number-004-track);
}
[data-vibeui-block="number-004"] [data-part="fill"]{
display:block;height:100%;width:var(--vibeui-number-004-fill);
background:var(--vibeui-number-004-accent);
transition:width .18s ease;
}
[data-vibeui-block="number-004"][data-invalid="true"] [data-part="fill"]{background:var(--vibeui-number-004-danger)}
[data-vibeui-block="number-004"] [data-part="note"]{
margin:0;min-height:1.05rem;font-size:0.75rem;line-height:1.4;color:var(--vibeui-number-004-muted);
}
[data-vibeui-block="number-004"][data-invalid="true"] [data-part="note"]{color:var(--vibeui-number-004-danger);font-weight:600}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="number-004"] *{animation:none!important;transition:none!important}}
`

/**
 * Ввод процента: выход за 0–100 не зажимается, а объясняется.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Number004({
  label = "Доля скидки",
  defaultValue = 15,
  error = "Процент бывает только от 0 до 100.",
  accent,
  className,
  style,
  ...props
}: Number004Props) {
  const id = useId()
  const [raw, setRaw] = useState(String(defaultValue))
  const value = Number(raw)
  const filled = raw !== "" && Number.isFinite(value)
  const invalid = filled && (value < 0 || value > 100)
  const fill = filled ? Math.min(100, Math.max(0, value)) : 0

  const palette = {
    "--vibeui-number-004-fill": `${fill}%`,
    ...(accent ? { "--vibeui-number-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-number-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="number-004"
        data-invalid={invalid ? "true" : "false"}
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={1}
            value={raw}
            aria-invalid={invalid}
            aria-describedby={`${id}-note`}
            onChange={(event) => setRaw(event.target.value)}
          />
          <span data-part="sign" aria-hidden="true">
            %
          </span>
        </div>
        <div
          data-part="bar"
          role="progressbar"
          aria-hidden="true"
          aria-valuenow={fill}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span data-part="fill" />
        </div>
        <p id={`${id}-note`} data-part="note" aria-live="polite">
          {invalid ? error : `Останется ${(100 - fill).toFixed(0)}% от цены`}
        </p>
      </div>
    </>
  )
}
