"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Checkbox002Option = {
  value: string
  title: string
  description: string
  price?: string
}

export type Checkbox002Props = Omit<
  ComponentPropsWithoutRef<"fieldset">,
  "children" | "onChange"
> & {
  legend?: string
  options?: Checkbox002Option[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: множественный выбор карточками. Внутри настоящие checkbox,
// поэтому пробел, Tab и объявление «отмечено» работают сами. Вся карточка —
// label: попасть надо в неё, а не в квадратик 16 пикселей. Галочка нарисована
// бордюрами и появляется только у отмеченного.
const STYLES = `
:where([data-vibeui-block="checkbox-002"]){
--vibeui-checkbox-002-bg:oklch(1 0 0);
--vibeui-checkbox-002-surface:oklch(0.975 0.002 265);
--vibeui-checkbox-002-fg:oklch(0.22 0.014 265);
--vibeui-checkbox-002-muted:oklch(0.56 0.014 265);
--vibeui-checkbox-002-border:oklch(0.91 0.006 265);
--vibeui-checkbox-002-accent:oklch(0.55 0.17 265);
--vibeui-checkbox-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="checkbox-002"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:20rem;box-sizing:border-box;
margin:0;padding:0.875rem;
border:1px solid var(--vibeui-checkbox-002-border);border-radius:1rem;
background:var(--vibeui-checkbox-002-surface);
font-family:var(--vibeui-checkbox-002-font);color:var(--vibeui-checkbox-002-fg);
}
/* legend у fieldset садится на рамку и обрезается — float возвращает
   его в поток обычной строкой. */
[data-vibeui-block="checkbox-002"] legend{float:left;width:100%;padding:0;margin-bottom:0.375rem;font-size:0.8125rem;font-weight:650}
/* Вся карточка — label: цель нажатия размером с карточку, а не с квадратик. */
[data-vibeui-block="checkbox-002"] label{
position:relative;display:grid;grid-template-columns:auto 1fr auto;
align-items:start;gap:0.125rem 0.625rem;
padding:0.75rem;cursor:pointer;
border:1px solid var(--vibeui-checkbox-002-border);border-radius:0.75rem;
background:var(--vibeui-checkbox-002-bg);
}
[data-vibeui-block="checkbox-002"] input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
[data-vibeui-block="checkbox-002"] [data-part="box"]{
grid-row:span 2;display:flex;align-items:center;justify-content:center;flex:none;
width:1.125rem;height:1.125rem;margin-top:0.125rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-checkbox-002-border);border-radius:0.3125rem;
background:var(--vibeui-checkbox-002-bg);
}
[data-vibeui-block="checkbox-002"] [data-part="tick"]{
width:0.25rem;height:0.4375rem;margin-top:-0.0625rem;opacity:0;
border-right:2px solid oklch(0.99 0.01 265);border-bottom:2px solid oklch(0.99 0.01 265);
transform:rotate(45deg);
}
[data-vibeui-block="checkbox-002"] label:has(input:checked){
border-color:var(--vibeui-checkbox-002-accent);
box-shadow:inset 0 0 0 1px var(--vibeui-checkbox-002-accent);
}
[data-vibeui-block="checkbox-002"] label:has(input:checked) [data-part="box"]{
border-color:transparent;background:var(--vibeui-checkbox-002-accent);
}
[data-vibeui-block="checkbox-002"] label:has(input:checked) [data-part="tick"]{opacity:1}
[data-vibeui-block="checkbox-002"] label:has(input:focus-visible){outline:2px solid var(--vibeui-checkbox-002-accent);outline-offset:2px}
[data-vibeui-block="checkbox-002"] [data-part="title"]{font-size:0.875rem;font-weight:650;line-height:1.3}
[data-vibeui-block="checkbox-002"] [data-part="price"]{grid-column:3;grid-row:span 2;justify-self:end;font-size:0.875rem;font-weight:680;font-variant-numeric:tabular-nums}
[data-vibeui-block="checkbox-002"] [data-part="description"]{grid-column:2;font-size:0.8125rem;line-height:1.4;color:var(--vibeui-checkbox-002-muted)}
[data-vibeui-block="checkbox-002"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-checkbox-002-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="checkbox-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS: Checkbox002Option[] = [
  {
    value: "delivery",
    title: "Доставка курьером",
    description: "Привезём завтра с 10:00 до 14:00.",
    price: "390 ₽",
  },
  {
    value: "assembly",
    title: "Сборка на месте",
    description: "Соберём и заберём упаковку с собой.",
    price: "1 200 ₽",
  },
  {
    value: "insurance",
    title: "Страховка на год",
    description: "Замена при поломке без экспертизы.",
    price: "590 ₽",
  },
]

/**
 * Множественный выбор карточками на настоящих checkbox.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Checkbox002({
  legend = "Дополнительно к заказу",
  options = DEFAULT_OPTIONS,
  defaultValue = ["delivery"],
  onChange,
  accent,
  className,
  style,
  ...props
}: Checkbox002Props) {
  const id = useId()
  const [value, setValue] = useState<string[]>(defaultValue)

  const palette = {
    ...(accent ? { "--vibeui-checkbox-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (option: string) => {
    const next = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option]
    setValue(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-checkbox-002" precedence="medium">
        {STYLES}
      </style>
      <fieldset
        {...props}
        data-vibeui-block="checkbox-002"
        className={className}
        style={palette}
      >
        <legend>{legend}</legend>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              name={`${id}-${option.value}`}
              checked={value.includes(option.value)}
              onChange={() => toggle(option.value)}
            />
            <span data-part="box" aria-hidden="true">
              <span data-part="tick" />
            </span>
            <span data-part="title">{option.title}</span>
            {option.price ? (
              <span data-part="price">{option.price}</span>
            ) : null}
            <span data-part="description">{option.description}</span>
          </label>
        ))}
        <span data-part="count">
          Выбрано: {value.length} из {options.length}
        </span>
      </fieldset>
    </>
  )
}
