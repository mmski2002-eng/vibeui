"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput004Country = {
  flag: string
  code: string
  name: string
}

export type Phoneinput004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  countries?: Phoneinput004Country[]
  accent?: string
}

// Идея компонента: списка стран нет вовсе — человек набирает номер так,
// как он записан у него в книжке, а страна определяется по началу с «+».
// Совпадение ищется по самому длинному коду: +1 и +1242 отличаются только
// длиной, и короткий код не должен побеждать. Пока код не распознан,
// поле не спорит с вводом и ничего не подставляет само.
const STYLES = `
:where([data-vibeui-block="phoneinput-004"]){
--vibeui-phoneinput-004-surface:oklch(1 0 0);
--vibeui-phoneinput-004-surface-border:oklch(0.91 0.006 265);
--vibeui-phoneinput-004-fg:oklch(0.24 0.016 265);
--vibeui-phoneinput-004-muted:oklch(0.54 0.014 265);
--vibeui-phoneinput-004-field-border:oklch(0.85 0.01 265);
--vibeui-phoneinput-004-chip-bg:oklch(0.96 0.004 265);
--vibeui-phoneinput-004-accent:oklch(0.58 0.16 300);
--vibeui-phoneinput-004-radius:0.625rem;
--vibeui-phoneinput-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="phoneinput-004"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-004-surface);
border:1px solid var(--vibeui-phoneinput-004-surface-border);
font-family:var(--vibeui-phoneinput-004-font);color:var(--vibeui-phoneinput-004-fg);
display:flex;flex-direction:column;gap:0.4375rem;
}
[data-vibeui-block="phoneinput-004"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-004"] [data-part="group"]{
display:flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.5rem 0 0.75rem;
border:1px solid var(--vibeui-phoneinput-004-field-border);
border-radius:var(--vibeui-phoneinput-004-radius);
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-004"] [data-part="group"]:has(input:focus-visible){
border-color:var(--vibeui-phoneinput-004-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-004-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-004"] input{
box-sizing:border-box;width:100%;min-width:0;padding:0;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-004-fg);background:transparent;
border:0;outline:none;
}
[data-vibeui-block="phoneinput-004"] input::placeholder{color:var(--vibeui-phoneinput-004-muted)}
/* Метка страны появляется справа, а не слева: слева она сдвигала бы
   каретку при каждом распознавании и сбивала набор. */
[data-vibeui-block="phoneinput-004"] [data-part="chip"]{
flex:none;display:inline-flex;align-items:center;gap:0.3125rem;
max-width:9rem;padding:0.1875rem 0.5rem;border-radius:999px;
background:var(--vibeui-phoneinput-004-chip-bg);
font-size:0.75rem;line-height:1.3;color:var(--vibeui-phoneinput-004-muted);
white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="phoneinput-004"] [data-part="chip"][data-known="true"]{
background:color-mix(in oklab,var(--vibeui-phoneinput-004-accent) 14%,transparent);
color:var(--vibeui-phoneinput-004-fg);
}
[data-vibeui-block="phoneinput-004"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTRIES: Phoneinput004Country[] = [
  { flag: "🇷🇺", code: "+7", name: "Россия" },
  { flag: "🇺🇸", code: "+1", name: "США" },
  { flag: "🇧🇸", code: "+1242", name: "Багамы" },
  { flag: "🇬🇧", code: "+44", name: "Британия" },
  { flag: "🇩🇪", code: "+49", name: "Германия" },
  { flag: "🇹🇷", code: "+90", name: "Турция" },
]

/** Ищет страну по самому длинному совпавшему коду, а не по первому. */
function detect(value: string, countries: Phoneinput004Country[]) {
  const normalized = `+${value.replace(/\D/g, "")}`

  return countries
    .filter((country) => normalized.startsWith(country.code))
    .sort((first, second) => second.code.length - first.code.length)[0]
}

/**
 * Телефон без списка стран: страна определяется по коду, который человек
 * набрал сам. Один файл, ноль зависимостей.
 */
export function Phoneinput004({
  label = "Телефон",
  countries = DEFAULT_COUNTRIES,
  accent,
  className,
  style,
  ...props
}: Phoneinput004Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const [value, setValue] = useState("+")
  const country = value.trim().startsWith("+")
    ? detect(value, countries)
    : undefined
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="phoneinput-004"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 999 123-45-67"
            value={value}
            aria-describedby={hintId}
            onChange={(event) => setValue(event.target.value)}
          />
          <span data-part="chip" data-known={Boolean(country)}>
            <span aria-hidden="true">{country ? country.flag : "🌐"}</span>
            {country ? country.name : "код?"}
          </span>
        </div>
        <p data-part="hint" id={hintId} aria-live="polite">
          {country
            ? `Определили страну по коду ${country.code}: ${country.name}.`
            : "Начните с «+» и кода страны — определим её сами."}
        </p>
      </div>
    </>
  )
}
