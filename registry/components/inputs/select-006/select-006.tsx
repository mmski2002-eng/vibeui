"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select006Size = {
  value: string
  label: string
  extra?: number
  soldOut?: boolean
}

export type Select006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  price?: number
  sizes?: Select006Size[]
  accent?: string
}

// Идея компонента: два select'а строки заказа, размер и количество, и итог,
// который пересчитывается сразу. Разошедшийся с выбором итог — классическая
// причина брошенной корзины, поэтому цифра живёт рядом с полями, а
// распроданный размер остаётся в списке, но выключен: так видно, что он есть.
const STYLES = `
:where([data-vibeui-block="select-006"]){
--vibeui-select-006-surface:oklch(1 0 0);
--vibeui-select-006-surface-border:oklch(0.91 0.006 265);
--vibeui-select-006-fg:oklch(0.22 0.014 265);
--vibeui-select-006-muted:oklch(0.55 0.014 265);
--vibeui-select-006-field:oklch(0.985 0.002 265);
--vibeui-select-006-border:oklch(0.87 0.008 265);
--vibeui-select-006-accent:oklch(0.52 0.16 32);
--vibeui-select-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-006"]{
display:flex;flex-direction:column;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-006-surface);
border:1px solid var(--vibeui-select-006-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-006-font);color:var(--vibeui-select-006-fg);
}
[data-vibeui-block="select-006"] [data-part="title"]{margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3}
[data-vibeui-block="select-006"] [data-part="row"]{display:flex;gap:0.5rem}
[data-vibeui-block="select-006"] [data-part="cell"]{display:flex;flex-direction:column;gap:0.25rem;min-width:0}
[data-vibeui-block="select-006"] [data-part="cell"]:first-child{flex:1 1 auto}
[data-vibeui-block="select-006"] [data-part="cell"]:last-child{flex:0 0 5.25rem}
[data-vibeui-block="select-006"] [data-part="caption"]{font-size:0.6875rem;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-select-006-muted)}
[data-vibeui-block="select-006"] [data-part="field"]{position:relative;display:block}
[data-vibeui-block="select-006"] select{
appearance:none;-webkit-appearance:none;
width:100%;box-sizing:border-box;margin:0;height:2.5rem;
padding:0 2rem 0 0.75rem;
border:1px solid var(--vibeui-select-006-border);border-radius:0.5rem;
background:var(--vibeui-select-006-field);color:inherit;
font:inherit;font-size:0.875rem;cursor:pointer;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-006"] select:focus{
outline:none;border-color:var(--vibeui-select-006-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-006-accent) 22%,transparent);
}
[data-vibeui-block="select-006"] option:disabled{color:var(--vibeui-select-006-muted)}
[data-vibeui-block="select-006"] [data-part="arrow"]{
position:absolute;right:0.75rem;top:50%;
width:0.375rem;height:0.375rem;margin-top:-0.28125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-006-muted);
border-bottom:1.5px solid var(--vibeui-select-006-muted);
transform:rotate(45deg);
}
[data-vibeui-block="select-006"] [data-part="total"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
margin:0;padding-top:0.625rem;border-top:1px dashed var(--vibeui-select-006-border);
font-size:0.8125rem;color:var(--vibeui-select-006-muted);
}
[data-vibeui-block="select-006"] [data-part="sum"]{
font-size:1.125rem;font-weight:700;font-variant-numeric:tabular-nums;
color:var(--vibeui-select-006-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SIZES: Select006Size[] = [
  { value: "s", label: "S · 44" },
  { value: "m", label: "M · 46" },
  { value: "l", label: "L · 48", extra: 300 },
  { value: "xl", label: "XL · 50", extra: 300, soldOut: true },
]

const QUANTITIES = [1, 2, 3, 4, 5]

// Свой разделитель разрядов: toLocaleString на сервере и в браузере может
// дать разные пробелы и развалить гидрацию.
function money(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

/**
 * Строка заказа: размер и количество в select'ах, итог считается сразу.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select006({
  title = "Худи «Ночная смена»",
  price = 4900,
  sizes = DEFAULT_SIZES,
  accent,
  className,
  style,
  ...props
}: Select006Props) {
  const id = useId()
  const [size, setSize] = useState(
    sizes.find((item) => !item.soldOut)?.value ?? sizes[0]?.value,
  )
  const [quantity, setQuantity] = useState(1)
  const extra = sizes.find((item) => item.value === size)?.extra ?? 0
  const total = (price + extra) * quantity

  const palette = {
    ...(accent ? { "--vibeui-select-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-006"
        className={className}
        style={palette}
      >
        <p data-part="title">{title}</p>
        <div data-part="row">
          <div data-part="cell">
            <label data-part="caption" htmlFor={`${id}-size`}>
              Размер
            </label>
            <span data-part="field">
              <select
                id={`${id}-size`}
                value={size}
                onChange={(event) => setSize(event.target.value)}
              >
                {sizes.map((item) => (
                  <option
                    key={item.value}
                    value={item.value}
                    disabled={item.soldOut}
                  >
                    {item.label}
                    {item.soldOut ? " — нет в наличии" : ""}
                  </option>
                ))}
              </select>
              <span data-part="arrow" aria-hidden="true" />
            </span>
          </div>
          <div data-part="cell">
            <label data-part="caption" htmlFor={`${id}-qty`}>
              Кол-во
            </label>
            <span data-part="field">
              <select
                id={`${id}-qty`}
                value={quantity}
                onChange={(event) => setQuantity(Number(event.target.value))}
              >
                {QUANTITIES.map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
              <span data-part="arrow" aria-hidden="true" />
            </span>
          </div>
        </div>
        <p data-part="total">
          <span>
            {quantity} × {money(price + extra)} ₽
          </span>
          <span data-part="sum" role="status">
            {money(total)} ₽
          </span>
        </p>
      </div>
    </>
  )
}
