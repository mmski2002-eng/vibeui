"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Autocomplete009Country = {
  name: string
  code: string
  dial: string
  flag: string
}

export type Autocomplete009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  countries?: Autocomplete009Country[]
  defaultCode?: string
  defaultOpen?: boolean
  onSelect?: (code: string) => void
  accent?: string
}

// Идея компонента: выбор страны рядом с номером. Поиск идёт и по названию, и
// по коду: половина людей ищет «+7», а не «Россия». Флаг — эмодзи, а не
// картинка: спрайт флагов весит больше самого поля, а шрифт системы рисует
// их сам. Код страны показан всегда — по одному флагу их не различить.
const STYLES = `
:where([data-vibeui-block="autocomplete-009"]){
--vibeui-autocomplete-009-bg:oklch(1 0 0);
--vibeui-autocomplete-009-fg:oklch(0.22 0.014 265);
--vibeui-autocomplete-009-muted:oklch(0.52 0.014 265);
--vibeui-autocomplete-009-border:oklch(0.9 0.006 265);
--vibeui-autocomplete-009-field:oklch(0.985 0.002 265);
--vibeui-autocomplete-009-active:oklch(0.95 0.02 265);
--vibeui-autocomplete-009-accent:oklch(0.55 0.17 265);
--vibeui-autocomplete-009-radius:0.625rem;
--vibeui-autocomplete-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-009"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-009-bg);
border:1px solid var(--vibeui-autocomplete-009-border);
border-radius:calc(var(--vibeui-autocomplete-009-radius) + 0.25rem);
color:var(--vibeui-autocomplete-009-fg);
font-family:var(--vibeui-autocomplete-009-font);
}
[data-vibeui-block="autocomplete-009"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-009"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="autocomplete-009"] [data-part="country"]{
appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:0.375rem;
height:2.5rem;padding:0 0.625rem;flex:none;
border:1px solid var(--vibeui-autocomplete-009-border);
border-radius:var(--vibeui-autocomplete-009-radius);
background:var(--vibeui-autocomplete-009-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-009"] [data-part="country"]:focus-visible{outline:2px solid var(--vibeui-autocomplete-009-accent);outline-offset:1px}
[data-vibeui-block="autocomplete-009"] [data-part="flag"]{font-size:1rem;line-height:1}
[data-vibeui-block="autocomplete-009"] [data-part="caret"]{
width:0.375rem;height:0.375rem;margin-left:0.125rem;
border-right:1.5px solid var(--vibeui-autocomplete-009-muted);
border-bottom:1.5px solid var(--vibeui-autocomplete-009-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-block="autocomplete-009"] input{
box-sizing:border-box;flex:1;min-width:0;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-autocomplete-009-border);
border-radius:var(--vibeui-autocomplete-009-radius);
background:var(--vibeui-autocomplete-009-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-009"] input::placeholder{color:var(--vibeui-autocomplete-009-muted)}
[data-vibeui-block="autocomplete-009"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-009-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="autocomplete-009"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.25rem;padding:0.375rem;
border:1px solid var(--vibeui-autocomplete-009-border);
border-radius:var(--vibeui-autocomplete-009-radius);
background:var(--vibeui-autocomplete-009-bg);
}
[data-vibeui-block="autocomplete-009"] [data-part="list"]{margin:0;padding:0;list-style:none;max-height:9rem;overflow-y:auto}
[data-vibeui-block="autocomplete-009"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
min-height:2rem;padding:0 0.375rem;border:0;border-radius:0.375rem;
background:transparent;color:inherit;font:inherit;font-size:0.875rem;
text-align:left;cursor:pointer;
}
[data-vibeui-block="autocomplete-009"] [data-part="option"]:hover{background:var(--vibeui-autocomplete-009-active)}
[data-vibeui-block="autocomplete-009"] [data-part="option"]:focus-visible{outline:2px solid var(--vibeui-autocomplete-009-accent);outline-offset:-2px}
[data-vibeui-block="autocomplete-009"] [data-part="option"][aria-selected="true"]{font-weight:650}
[data-vibeui-block="autocomplete-009"] [data-part="dial"]{margin-left:auto;color:var(--vibeui-autocomplete-009-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="autocomplete-009"] [data-part="empty"]{padding:0.5rem 0.375rem;font-size:0.8125rem;color:var(--vibeui-autocomplete-009-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COUNTRIES: Autocomplete009Country[] = [
  { name: "Россия", code: "RU", dial: "+7", flag: "🇷🇺" },
  { name: "Казахстан", code: "KZ", dial: "+7", flag: "🇰🇿" },
  { name: "Беларусь", code: "BY", dial: "+375", flag: "🇧🇾" },
  { name: "Армения", code: "AM", dial: "+374", flag: "🇦🇲" },
  { name: "Грузия", code: "GE", dial: "+995", flag: "🇬🇪" },
  { name: "Сербия", code: "RS", dial: "+381", flag: "🇷🇸" },
  { name: "Турция", code: "TR", dial: "+90", flag: "🇹🇷" },
  { name: "ОАЭ", code: "AE", dial: "+971", flag: "🇦🇪" },
]

/**
 * Номер телефона с выбором страны: поиск и по названию, и по коду.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete009({
  label = "Телефон",
  placeholder = "900 000-00-00",
  countries = DEFAULT_COUNTRIES,
  defaultCode = "RU",
  defaultOpen = false,
  onSelect,
  accent,
  className,
  style,
  ...props
}: Autocomplete009Props) {
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [code, setCode] = useState(defaultCode)
  const [query, setQuery] = useState("")

  const current =
    countries.find((country) => country.code === code) ?? countries[0]

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase().replace(/^\+/, "")
    if (!needle) return countries
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(needle) ||
        country.dial.replace("+", "").startsWith(needle),
    )
  }, [countries, query])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-autocomplete-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-009"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-phone`}>{label}</label>
        <div data-part="row">
          <button
            type="button"
            data-part="country"
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            aria-label={`Страна: ${current.name}, ${current.dial}`}
            onClick={() => setOpen(!open)}
          >
            <span data-part="flag" aria-hidden="true">
              {current.flag}
            </span>
            {current.dial}
            <span data-part="caret" aria-hidden="true" />
          </button>
          <input
            id={`${id}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder={placeholder}
          />
        </div>
        {open ? (
          <div data-part="panel" id={`${id}-panel`}>
            <input
              type="search"
              autoComplete="off"
              placeholder="Страна или код"
              aria-label="Поиск страны"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {matches.length ? (
              <ul data-part="list" role="listbox" aria-label="Страна">
                {matches.map((country) => (
                  <li
                    key={country.code}
                    role="option"
                    tabIndex={-1}
                    data-part="option"
                    aria-selected={country.code === code}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      setCode(country.code)
                      setOpen(false)
                      setQuery("")
                      onSelect?.(country.code)
                    }}
                  >
                    <span data-part="flag" aria-hidden="true">
                      {country.flag}
                    </span>
                    {country.name}
                    <span data-part="dial">{country.dial}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p data-part="empty">Такой страны в списке нет</p>
            )}
          </div>
        ) : null}
      </div>
    </>
  )
}
