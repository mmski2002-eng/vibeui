"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select026Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  name?: string
  stock?: number
  maxOption?: number
  defaultValue?: number
  lowStockThreshold?: number
  accent?: string
}

// Идея компонента: список количества не может предложить больше, чем есть
// на складе — варианты выше остатка не рисуются вовсе, а не просто
// выключены. Подпись под полем честно называет остаток и меняет тон, когда
// он близок к нулю, чтобы решение "успею ли я" принималось до оформления.
const STYLES = `
:where([data-vibeui-block="select-026"]){
--vibeui-select-026-surface:oklch(1 0 0);
--vibeui-select-026-surface-border:oklch(0.91 0.006 265);
--vibeui-select-026-fg:oklch(0.22 0.014 265);
--vibeui-select-026-muted:oklch(0.55 0.014 265);
--vibeui-select-026-field:oklch(0.985 0.002 265);
--vibeui-select-026-border:oklch(0.87 0.008 265);
--vibeui-select-026-accent:oklch(0.55 0.19 262);
--vibeui-select-026-warn:oklch(0.6 0.19 45);
--vibeui-select-026-danger:oklch(0.55 0.21 25);
--vibeui-select-026-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-026"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:18rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-026-surface);
border:1px solid var(--vibeui-select-026-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-026-font);color:var(--vibeui-select-026-fg);
container-type:inline-size;
}
[data-vibeui-block="select-026"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-026"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-026"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.75rem;
padding:0 2.5rem 0 0.875rem;
border:1px solid var(--vibeui-select-026-border);border-radius:0.625rem;
background:var(--vibeui-select-026-field);color:inherit;
font:inherit;font-size:0.9375rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-026"] select:focus-visible{
outline:none;border-color:var(--vibeui-select-026-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-026-accent) 22%,transparent);
}
[data-vibeui-block="select-026"] select:disabled{
color:var(--vibeui-select-026-muted);cursor:not-allowed;
background:color-mix(in oklab,var(--vibeui-select-026-border) 22%,var(--vibeui-select-026-field));
}
[data-vibeui-block="select-026"] [data-part="arrow"]{
position:absolute;right:1rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-026-muted);
border-bottom:1.5px solid var(--vibeui-select-026-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-026"] [data-part="hint"]{margin:0;font-size:0.8125rem;color:var(--vibeui-select-026-muted)}
[data-vibeui-block="select-026"] [data-part="hint"][data-tone="warn"]{color:var(--vibeui-select-026-warn);font-weight:600}
[data-vibeui-block="select-026"] [data-part="hint"][data-tone="danger"]{color:var(--vibeui-select-026-danger);font-weight:600}
@container (max-width: 13rem){
[data-vibeui-block="select-026"] select{padding:0 2.25rem 0 0.625rem}
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-026"] *{animation:none!important;transition:none!important}}
`

/**
 * Select количества, ограниченный остатком на складе: вариантов выше
 * остатка нет в списке, а подпись сообщает, сколько штук осталось, и
 * меняет тон при малом остатке. Один файл, ноль зависимостей.
 */
export function Select026({
  label = "Количество",
  name,
  stock = 7,
  maxOption = 10,
  defaultValue = 1,
  lowStockThreshold = 3,
  accent,
  id,
  className,
  style,
  ...props
}: Select026Props) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const available = Math.max(0, stock)
  const options = Array.from(
    { length: Math.min(available, maxOption) },
    (_, index) => index + 1,
  )
  const [quantity, setQuantity] = useState(
    Math.min(Math.max(1, defaultValue), Math.max(options.length, 1)),
  )

  const tone =
    available === 0
      ? "danger"
      : available <= lowStockThreshold
        ? "warn"
        : undefined

  const hint =
    available === 0
      ? "Нет в наличии"
      : available <= lowStockThreshold
        ? `Осталось всего ${available} шт.`
        : `В наличии: ${available} шт.`

  const palette = {
    ...(accent ? { "--vibeui-select-026-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-026" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-026"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={fieldId}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={fieldId}
            name={name}
            value={options.length === 0 ? "" : quantity}
            disabled={options.length === 0}
            onChange={(event) => setQuantity(Number(event.target.value))}
          >
            {options.length === 0 ? (
              <option value="">—</option>
            ) : (
              options.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))
            )}
          </select>
          <span data-part="arrow" aria-hidden="true" />
        </span>
        <p data-part="hint" data-tone={tone} role="status">
          {hint}
        </p>
      </div>
    </>
  )
}
