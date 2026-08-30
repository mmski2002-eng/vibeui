"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Card005Option = {
  value: string
  title: string
  description: string
  price?: string
  note?: string
}

export type Card005Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Card005Option[]
  defaultValue?: string
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: выбор тарифа карточками. Внутри настоящие radio, поэтому
// стрелки и объявление «2 из 3» работают сами; вся карточка — это label, и
// попасть можно в любую её точку, а не в кружок диаметром 16 пикселей.
// Выбранная отличается рамкой и кружком, а не только фоном.
const STYLES = `
:where([data-vibeui-block="card-005"]){
--vibeui-card-005-bg:oklch(1 0 0);
--vibeui-card-005-surface:oklch(0.975 0.002 265);
--vibeui-card-005-fg:oklch(0.22 0.014 265);
--vibeui-card-005-muted:oklch(0.56 0.014 265);
--vibeui-card-005-border:oklch(0.91 0.006 265);
--vibeui-card-005-accent:oklch(0.55 0.17 265);
--vibeui-card-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Собственная подложка у группы: заголовок «как платить» — это текст, и на
   тёмной странице он обязан читаться без правки палитры проекта. */
[data-vibeui-block="card-005"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.875rem;
border:1px solid var(--vibeui-card-005-border);border-radius:1rem;
background:var(--vibeui-card-005-surface);
font-family:var(--vibeui-card-005-font);color:var(--vibeui-card-005-fg);
}
[data-vibeui-block="card-005"] legend{
padding:0;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:650;
}
/* Вся карточка — label: цель нажатия размером с карточку, а не с кружок. */
[data-vibeui-block="card-005"] label{
position:relative;display:grid;grid-template-columns:auto 1fr auto;
align-items:start;gap:0.125rem 0.625rem;
padding:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-card-005-border);border-radius:0.75rem;
background:var(--vibeui-card-005-bg);
}
[data-vibeui-block="card-005"] input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
[data-vibeui-block="card-005"] [data-part="mark"]{
grid-row:span 2;display:flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;margin-top:0.125rem;
border:1.5px solid var(--vibeui-card-005-border);border-radius:9999px;
}
[data-vibeui-block="card-005"] [data-part="mark"]::after{
content:"";width:0.5rem;height:0.5rem;border-radius:9999px;background:transparent;
}
[data-vibeui-block="card-005"] label:has(input:checked){
border-color:var(--vibeui-card-005-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-card-005-accent);
}
[data-vibeui-block="card-005"] label:has(input:checked) [data-part="mark"]{border-color:var(--vibeui-card-005-accent)}
[data-vibeui-block="card-005"] label:has(input:checked) [data-part="mark"]::after{background:var(--vibeui-card-005-accent)}
[data-vibeui-block="card-005"] label:has(input:focus-visible){outline:2px solid var(--vibeui-card-005-accent);outline-offset:2px}
[data-vibeui-block="card-005"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="card-005"] [data-part="price"]{
grid-column:3;grid-row:span 2;justify-self:end;
font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums;
}
[data-vibeui-block="card-005"] [data-part="description"]{
grid-column:2;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-card-005-muted);
}
[data-vibeui-block="card-005"] [data-part="note"]{
grid-column:2;margin-top:0.25rem;font-size:0.75rem;color:var(--vibeui-card-005-accent);font-weight:600;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="card-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Card005Option[] = [
  {
    value: "month",
    title: "Помесячно",
    description: "Списание раз в месяц, отказаться можно в любой момент.",
    price: "990 ₽",
  },
  {
    value: "year",
    title: "На год",
    description: "Один платёж вместо двенадцати, счёт выставляется сразу.",
    price: "9 900 ₽",
    note: "Два месяца в подарок",
  },
  {
    value: "team",
    title: "Команда",
    description: "До десяти человек, общая оплата и единый счёт.",
    price: "24 900 ₽",
  },
]

/**
 * Выбор тарифа карточками на настоящих radio.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Card005({
  legend = "Как платить",
  options = DEFAULT_OPTIONS,
  defaultValue = "year",
  onChange,
  accent,
  className,
  style,
  ...props
}: Card005Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-card-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-card-005" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="card-005"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => {
                setValue(option.value)
                onChange?.(option.value)
              }}
            />
            <span data-part="mark" aria-hidden="true" />
            <span data-part="title">{option.title}</span>
            {option.price ? (
              <span data-part="price">{option.price}</span>
            ) : null}
            <span data-part="description">{option.description}</span>
            {option.note ? <span data-part="note">{option.note}</span> : null}
          </label>
        ))}
      </fieldset>
    </>
  )
}
