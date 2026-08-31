"use client"

import { useId, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Phoneinput002Country = {
  flag: string
  code: string
  name: string
  mask: string
}

export type Phoneinput002Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  label?: string
  countries?: Phoneinput002Country[]
  accent?: string
}

// Идея компонента: маска зависит от страны, поэтому она не зашита в поле,
// а живёт в описании страны и меняется вместе с кодом. Форматирование
// работает от голых цифр: всё, что не цифра, выбрасывается на входе,
// поэтому вставленный из буфера «+7 (999) 123-45-67» превращается в тот
// же номер, что и набранный вручную. Лишние цифры не отбрасываются —
// они просто не попадают в шаблон.
const STYLES = `
:where([data-vibeui-block="phoneinput-002"]){
--vibeui-phoneinput-002-surface:oklch(1 0 0);
--vibeui-phoneinput-002-surface-border:oklch(0.91 0.006 265);
--vibeui-phoneinput-002-fg:oklch(0.24 0.016 265);
--vibeui-phoneinput-002-muted:oklch(0.54 0.014 265);
--vibeui-phoneinput-002-field-border:oklch(0.85 0.01 265);
--vibeui-phoneinput-002-accent:oklch(0.5 0.16 165);
--vibeui-phoneinput-002-radius:0.625rem;
--vibeui-phoneinput-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="phoneinput-002"]{
box-sizing:border-box;width:100%;max-width:22rem;
padding:1rem;border-radius:0.875rem;
background:var(--vibeui-phoneinput-002-surface);
border:1px solid var(--vibeui-phoneinput-002-surface-border);
font-family:var(--vibeui-phoneinput-002-font);color:var(--vibeui-phoneinput-002-fg);
display:flex;flex-direction:column;gap:0.375rem;
}
[data-vibeui-block="phoneinput-002"] label{
font-size:0.875rem;font-weight:600;line-height:1.3;cursor:pointer;
}
[data-vibeui-block="phoneinput-002"] [data-part="group"]{
display:flex;align-items:stretch;
border:1px solid var(--vibeui-phoneinput-002-field-border);
border-radius:var(--vibeui-phoneinput-002-radius);
background:var(--vibeui-phoneinput-002-surface);overflow:hidden;
transition:border-color .16s ease,box-shadow .16s ease;
}
[data-vibeui-block="phoneinput-002"] [data-part="group"]:has(:focus-visible){
border-color:var(--vibeui-phoneinput-002-accent);
box-shadow:0 0 0 3px color-mix(in oklab,var(--vibeui-phoneinput-002-accent) 22%,transparent);
}
[data-vibeui-block="phoneinput-002"] [data-part="code"]{position:relative;display:flex;flex:none}
[data-vibeui-block="phoneinput-002"] select{
appearance:none;-webkit-appearance:none;
box-sizing:border-box;height:2.5rem;padding:0 1.5rem 0 0.75rem;
font:inherit;font-size:0.9375rem;line-height:1.2;
color:var(--vibeui-phoneinput-002-fg);background:transparent;
border:0;border-right:1px solid var(--vibeui-phoneinput-002-field-border);
cursor:pointer;outline:none;
}
[data-vibeui-block="phoneinput-002"] [data-part="arrow"]{
position:absolute;right:0.5rem;top:50%;pointer-events:none;
width:0.3125rem;height:0.3125rem;
border-right:1.5px solid var(--vibeui-phoneinput-002-muted);
border-bottom:1.5px solid var(--vibeui-phoneinput-002-muted);
translate:0 -0.1875rem;rotate:45deg;
}
/* Табличные цифры: в маске с разделителями пропорциональные цифры
   заставляют номер дёргаться при каждом символе. */
[data-vibeui-block="phoneinput-002"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;min-width:0;
font:inherit;font-size:0.9375rem;font-variant-numeric:tabular-nums;
color:var(--vibeui-phoneinput-002-fg);background:transparent;
border:0;outline:none;
}
[data-vibeui-block="phoneinput-002"] input::placeholder{color:var(--vibeui-phoneinput-002-muted)}
[data-vibeui-block="phoneinput-002"] [data-part="hint"]{
margin:0;font-size:0.8125rem;line-height:1.45;
color:var(--vibeui-phoneinput-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="phoneinput-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTRIES: Phoneinput002Country[] = [
  { flag: "🇷🇺", code: "+7", name: "Россия", mask: "### ###-##-##" },
  { flag: "🇧🇾", code: "+375", name: "Беларусь", mask: "## ###-##-##" },
  { flag: "🇩🇪", code: "+49", name: "Германия", mask: "#### #######" },
  { flag: "🇫🇷", code: "+33", name: "Франция", mask: "# ## ## ## ##" },
]

/** Раскладывает голые цифры по шаблону, где # — место под цифру. */
function applyMask(digits: string, mask: string) {
  let result = ""
  let index = 0

  for (const symbol of mask) {
    if (index >= digits.length) {
      break
    }

    if (symbol === "#") {
      result += digits[index]
      index += 1
    } else {
      result += symbol
    }
  }

  return result
}

/**
 * Телефон с маской, которая меняется вместе со страной: ввод и вставка
 * из буфера приводятся к одному виду. Один файл, ноль зависимостей.
 */
export function Phoneinput002({
  label = "Телефон",
  countries = DEFAULT_COUNTRIES,
  accent,
  className,
  style,
  ...props
}: Phoneinput002Props) {
  const id = useId()
  const hintId = `${id}-hint`
  const [countryName, setCountryName] = useState(countries[0]?.name ?? "")
  const [digits, setDigits] = useState("")
  const country =
    countries.find((entry) => entry.name === countryName) ?? countries[0]
  const limit = (country?.mask.match(/#/g) ?? []).length
  const palette = {
    ...(accent ? { "--vibeui-phoneinput-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-phoneinput-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="phoneinput-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="code">
            <select
              name="country"
              aria-label="Код страны"
              value={countryName}
              onChange={(event) => {
                setCountryName(event.target.value)
                setDigits("")
              }}
            >
              {countries.map((entry) => (
                <option key={entry.name} value={entry.name}>
                  {entry.flag} {entry.code}
                </option>
              ))}
            </select>
            <span data-part="arrow" aria-hidden="true" />
          </span>
          <input
            id={id}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={country?.mask.replaceAll("#", "0")}
            value={applyMask(digits, country?.mask ?? "")}
            aria-describedby={hintId}
            onChange={(event) =>
              setDigits(
                event.target.value.replace(/\D/g, "").slice(0, limit || 15),
              )
            }
          />
        </div>
        <p data-part="hint" id={hintId}>
          {country?.name}: {limit} цифр после {country?.code}.
        </p>
      </div>
    </>
  )
}
