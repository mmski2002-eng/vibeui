"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Select003Option = {
  value: string
  label: string
  icon: string
}

export type Select003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  options?: Select003Option[]
  defaultValue?: string
  accent?: string
}

// Идея компонента: витрина от кастомной кнопки, механика от нативного select.
// Самодельное меню пришлось бы учить клавиатуре, прокрутке и телефону,
// поэтому настоящий <select> лежит прозрачным слоем поверх кнопки: система
// открывает свой список, а мы рисуем плитку с иконкой выбранного варианта.
const STYLES = `
:where([data-vibeui-block="select-003"]){
--vibeui-select-003-surface:oklch(1 0 0);
--vibeui-select-003-surface-border:oklch(0.91 0.006 265);
--vibeui-select-003-fg:oklch(0.23 0.016 265);
--vibeui-select-003-muted:oklch(0.55 0.014 265);
--vibeui-select-003-border:oklch(0.87 0.008 265);
--vibeui-select-003-accent:oklch(0.58 0.16 155);
--vibeui-select-003-tint:oklch(0.58 0.16 155 / 12%);
--vibeui-select-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="select-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-select-003-surface);
border:1px solid var(--vibeui-select-003-surface-border);border-radius:0.875rem;
font-family:var(--vibeui-select-003-font);color:var(--vibeui-select-003-fg);
}
[data-vibeui-block="select-003"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="select-003"] [data-part="field"]{position:relative;display:block}
/* Настоящий select лежит поверх кнопки и невидим: клик, клавиатура и
   системный список остаются браузерными, оформление — наше. */
[data-vibeui-block="select-003"] select{
position:absolute;inset:0;width:100%;height:100%;
opacity:0;cursor:pointer;font:inherit;
}
[data-vibeui-block="select-003"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.625rem;
box-sizing:border-box;width:100%;min-height:3rem;padding:0.5rem 2.25rem 0.5rem 0.5rem;
border:1px solid var(--vibeui-select-003-border);border-radius:0.75rem;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="select-003"] select:focus-visible + [data-part="trigger"],
[data-vibeui-block="select-003"] select:focus + [data-part="trigger"]{
border-color:var(--vibeui-select-003-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-select-003-accent) 22%,transparent);
}
[data-vibeui-block="select-003"] [data-part="icon"]{
display:grid;place-items:center;flex:none;
width:2rem;height:2rem;border-radius:0.5rem;
background:var(--vibeui-select-003-tint);font-size:1rem;line-height:1;
}
[data-vibeui-block="select-003"] [data-part="text"]{
flex:1 1 auto;min-width:0;font-size:0.9375rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="select-003"] [data-part="arrow"]{
position:absolute;right:0.875rem;top:50%;
width:0.4375rem;height:0.4375rem;margin-top:-0.3125rem;pointer-events:none;
border-right:1.5px solid var(--vibeui-select-003-muted);
border-bottom:1.5px solid var(--vibeui-select-003-muted);
transform:rotate(45deg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="select-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Select003Option[] = [
  { value: "card", label: "Банковская карта", icon: "💳" },
  { value: "invoice", label: "Счёт для юрлица", icon: "🧾" },
  { value: "crypto", label: "Криптокошелёк", icon: "🪙" },
  { value: "cash", label: "Наличные курьеру", icon: "💵" },
]

/**
 * Select с иконкой выбранного варианта: своя кнопка, системный список.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Select003({
  label = "Способ оплаты",
  options = DEFAULT_OPTIONS,
  defaultValue = "card",
  accent,
  className,
  style,
  ...props
}: Select003Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const current = options.find((option) => option.value === value) ?? options[0]

  const palette = {
    ...(accent ? { "--vibeui-select-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-select-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="select-003"
        className={className}
        style={palette}
      >
        <label data-part="label" htmlFor={id}>
          {label}
        </label>
        <span data-part="field">
          <select
            id={id}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span data-part="trigger" aria-hidden="true">
            <span data-part="icon">{current?.icon}</span>
            <span data-part="text">{current?.label}</span>
          </span>
          <span data-part="arrow" aria-hidden="true" />
        </span>
      </div>
    </>
  )
}
