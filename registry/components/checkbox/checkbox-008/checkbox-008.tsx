"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox008Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  hint?: string
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
  accent?: string
}

// Идея компонента: крупный чекбокс для телефона. Квадрат 1.5rem и строка
// высотой 2.75rem — это минимальная цель, в которую попадают пальцем без
// прицеливания. Подсказка под подписью связана с полем через
// aria-describedby: без связи она для скринридера просто соседний текст.
const STYLES = `
:where([data-vibeui-block="checkbox-008"]){
--vibeui-checkbox-008-bg:oklch(1 0 0);
--vibeui-checkbox-008-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-008-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-008-border:oklch(0.86 0.008 265);
--vibeui-checkbox-008-hover:oklch(0.97 0.003 265);
--vibeui-checkbox-008-accent:oklch(0.55 0.17 265);
--vibeui-checkbox-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-008"]{
width:100%;max-width:20rem;box-sizing:border-box;
background:var(--vibeui-checkbox-008-bg);
border:1px solid var(--vibeui-checkbox-008-border);border-radius:0.875rem;
font-family:var(--vibeui-checkbox-008-font);color:var(--vibeui-checkbox-008-fg);
}
/* Строка высотой 2.75rem: минимальная цель, в которую попадают пальцем. */
[data-vibeui-block="checkbox-008"] label{
display:grid;grid-template-columns:auto 1fr;align-items:center;gap:0.25rem 0.75rem;
min-height:2.75rem;padding:0.625rem 0.875rem;
border-radius:inherit;cursor:pointer;
}
[data-vibeui-block="checkbox-008"] label:hover{background:var(--vibeui-checkbox-008-hover)}
[data-vibeui-block="checkbox-008"] label:has(input:disabled){cursor:not-allowed;opacity:.55}
[data-vibeui-block="checkbox-008"] label:has(input:disabled):hover{background:transparent}
[data-vibeui-block="checkbox-008"] input{
appearance:none;grid-row:span 2;flex:none;cursor:inherit;position:relative;
width:1.5rem;height:1.5rem;margin:0;box-sizing:border-box;
border:2px solid var(--vibeui-checkbox-008-border);border-radius:0.4375rem;
background:var(--vibeui-checkbox-008-bg);
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="checkbox-008"] input:checked{border-color:transparent;background:var(--vibeui-checkbox-008-accent)}
[data-vibeui-block="checkbox-008"] input:checked::after{
content:"";position:absolute;left:50%;top:50%;
width:0.375rem;height:0.6875rem;margin:-0.46875rem 0 0 -0.1875rem;
border-right:2.5px solid oklch(0.99 0.01 265);border-bottom:2.5px solid oklch(0.99 0.01 265);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-008"] input:focus-visible{outline:2px solid var(--vibeui-checkbox-008-accent);outline-offset:2px}
[data-vibeui-block="checkbox-008"] [data-part="label"]{font-size:0.9375rem;font-weight:600;line-height:1.3}
[data-vibeui-block="checkbox-008"] [data-part="hint"]{grid-column:2;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-checkbox-008-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-008"] *{animation:none!important;transition:none!important}}
`

/**
 * Крупный чекбокс для телефона: цель под палец и связанная подсказка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox008({
  label = "Сохранить карту для будущих покупок",
  hint = "Номер карты хранится у банка, мы получаем только токен",
  defaultChecked = false,
  disabled = false,
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox008Props) {
  const id = useId()
  const [checked, setChecked] = useState(defaultChecked)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-008-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-checkbox-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="checkbox-008"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            aria-describedby={hint ? `${id}-hint` : undefined}
            onChange={(event) => {
              setChecked(event.target.checked)
              onChange?.(event.target.checked)
            }}
          />
          <span data-part="label">{label}</span>
          {hint ? (
            <span data-part="hint" id={`${id}-hint`}>
              {hint}
            </span>
          ) : null}
        </label>
      </div>
    </>
  )
}
