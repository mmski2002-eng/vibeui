"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup028Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  name?: string
  label?: string
  cities?: string[]
  placeholder?: string
  onChange?: (address: string, city: string) => void
  hint?: string
  accent?: string
}

const DEFAULT_CITIES = ["Москва", "Санкт-Петербург", "Казань", "Новосибирск"]

// Идея компонента: город и адрес — два разных значения формы, а не одна
// строка «город, улица, дом», потому что доставке обычно нужен город
// отдельно. Слева нативный select с городом, справа текстовое поле
// адреса — сцепка из фиксированной и свободной части, как в «Scoped
// Search», но здесь обе части равнозначны и обе уходят в onChange вместе,
// а не только текст.
const STYLES = `
:where([data-vibeui-block="inputgroup-028"]){
--vibeui-inputgroup-028-surface:oklch(1 0 0);
--vibeui-inputgroup-028-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-028-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-028-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-028-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-028-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-028-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-028-accent:oklch(0.56 0.14 275);
--vibeui-inputgroup-028-radius:0.75rem;
--vibeui-inputgroup-028-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-028"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:26rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-028-surface);
border:1px solid var(--vibeui-inputgroup-028-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-028-font);color:var(--vibeui-inputgroup-028-fg);
}
[data-vibeui-block="inputgroup-028"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-028"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-028"] [data-part="group"]{display:flex;align-items:stretch;min-width:0}
[data-vibeui-block="inputgroup-028"] [data-part="group"] > *{
position:relative;height:2.75rem;
border:1px solid var(--vibeui-inputgroup-028-border);
border-radius:0;margin-left:-1px;font:inherit;color:inherit;
}
[data-vibeui-block="inputgroup-028"] [data-part="group"] > *:first-child{
margin-left:0;
border-radius:var(--vibeui-inputgroup-028-radius) 0 0 var(--vibeui-inputgroup-028-radius);
}
[data-vibeui-block="inputgroup-028"] [data-part="group"] > *:last-child{
border-radius:0 var(--vibeui-inputgroup-028-radius) var(--vibeui-inputgroup-028-radius) 0;
}
[data-vibeui-block="inputgroup-028"] [data-part="group"] > *:focus,
[data-vibeui-block="inputgroup-028"] [data-part="group"] > *:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-028-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-028-accent);
}
[data-vibeui-block="inputgroup-028"] select{
appearance:none;flex:none;cursor:pointer;width:11ch;
padding:0 1.375rem 0 0.75rem;
background:var(--vibeui-inputgroup-028-fixed);
font-size:0.8125rem;font-weight:600;color:var(--vibeui-inputgroup-028-muted);
background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 0.85rem) 50%,calc(100% - 0.55rem) 50%;
background-size:0.3rem 0.3rem,0.3rem 0.3rem;
background-repeat:no-repeat;
}
[data-vibeui-block="inputgroup-028"] select:focus{color:var(--vibeui-inputgroup-028-fg)}
[data-vibeui-block="inputgroup-028"] input{
flex:1;min-width:0;padding:0 0.75rem;
background:var(--vibeui-inputgroup-028-field);font-size:0.875rem;
}
[data-vibeui-block="inputgroup-028"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-028-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-028"] *{transition:none!important}}
`

/**
 * Сцепка «город + адрес»: слева нативный select с городом, справа
 * текстовое поле адреса, оба значения уходят в onChange вместе.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup028({
  name = "address",
  label = "Адрес доставки",
  cities = DEFAULT_CITIES,
  placeholder = "Улица, дом, квартира",
  onChange,
  hint = "Город определяет условия и сроки доставки, адрес — только точку выдачи внутри него.",
  accent,
  className,
  style,
  ...props
}: Inputgroup028Props) {
  const id = useId()
  const [city, setCity] = useState(cities[0] ?? "Москва")
  const [address, setAddress] = useState("")

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-028-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-inputgroup-028" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-028"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <select
            data-part="city"
            name={`${name}-city`}
            aria-label="Город"
            value={city}
            onChange={(event) => {
              setCity(event.target.value)
              onChange?.(address, event.target.value)
            }}
          >
            {cities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            id={id}
            name={name}
            type="text"
            placeholder={placeholder}
            autoComplete="off"
            value={address}
            aria-describedby={`${id}-hint`}
            onChange={(event) => {
              setAddress(event.target.value)
              onChange?.(event.target.value, city)
            }}
          />
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
