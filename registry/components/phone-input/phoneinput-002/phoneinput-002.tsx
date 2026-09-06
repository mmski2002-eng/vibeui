"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Phoneinput002Country = {
  flag: string
  code: string
  name: string
  mask: string
}

export type Phoneinput002Props = Omit<ComponentProps<"div">, "children"> & {
  label?: string
  countries?: Phoneinput002Country[]
  /** Подпись списка кодов для озвучки: компонент несёт русскую. */
  codeLabel?: string
  /** Шаблон строки под полем: {country}, {digits} и {code}. */
  hint?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: маска зависит от страны, поэтому она не зашита в поле,
// а живёт в описании страны и меняется вместе с кодом. Форматирование
// работает от голых цифр: всё, что не цифра, выбрасывается на входе,
// поэтому вставленный из буфера «+7 (999) 123-45-67» превращается в тот
// же номер, что и набранный вручную. Лишние цифры не отбрасываются —
// они просто не попадают в шаблон.
//
// Тема берётся из color-scheme окружения через light-dark(): подложки у
// компонента по умолчанию нет, он темнеет вместе со страницей.
const STYLES = `
:where([data-vibeui-block="phoneinput-002"]){
--vibeui-phoneinput-002-surface:transparent;
--vibeui-phoneinput-002-surface-border:light-dark(oklch(0.91 0 265),oklch(0.33 0 265));
--vibeui-phoneinput-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-phoneinput-002-muted:color-mix(in oklab,var(--vibeui-phoneinput-002-fg) 68%,transparent);
--vibeui-phoneinput-002-field-border:light-dark(oklch(0.85 0 265),oklch(0.4 0 265));
--vibeui-phoneinput-002-accent:light-dark(oklch(0.5 0.16 165),oklch(0.74 0.14 165));
--vibeui-phoneinput-002-radius:0.625rem;
--vibeui-phoneinput-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="phoneinput-002"]{color-scheme:dark}
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
 * Ветка темы для заданной подложки. Без неё светлая плашка досталась бы
 * тексту тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет
 * фона. Считается один раз при рендере, клиентского кода не добавляет.
 */
function schemeForBackground(background: string): "light" | "dark" | undefined {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(background)

  if (!match) {
    return undefined
  }

  const hex =
    match[1].length === 3
      ? match[1].replace(/./g, (character) => character + character)
      : match[1]
  const [red, green, blue] = [0, 2, 4].map(
    (offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255,
  )

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue > 0.55 ? "light" : "dark"
}

/**
 * Телефон с маской, которая меняется вместе со страной: ввод и вставка
 * из буфера приводятся к одному виду. Один файл, ноль зависимостей.
 */
export function Phoneinput002({
  label = "Телефон",
  countries = DEFAULT_COUNTRIES,
  codeLabel = "Код страны",
  hint = "{country}: {digits} цифр после {code}.",
  background = "",
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
    ...(background
      ? {
          "--vibeui-phoneinput-002-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties
  const hintText = hint
    .replace("{country}", country?.name ?? "")
    .replace("{digits}", String(limit))
    .replace("{code}", country?.code ?? "")

  return (
    <>
      <style href="vibeui-phoneinput-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="phone-input"
        data-vibeui-block="phoneinput-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="group">
          <span data-part="code">
            <select
              name="country"
              aria-label={codeLabel}
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
          {hintText}
        </p>
      </div>
    </>
  )
}
