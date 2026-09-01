"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Inputgroup021Country = {
  code: string
  title: string
  flag: string
}

export type Inputgroup021Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  label?: string
  countries?: Inputgroup021Country[]
  hint?: string
  accent?: string
}

const COUNTRIES: Inputgroup021Country[] = [
  { code: "+7", title: "Россия", flag: "🇷🇺" },
  { code: "+375", title: "Беларусь", flag: "🇧🇾" },
  { code: "+77", title: "Казахстан", flag: "🇰🇿" },
  { code: "+995", title: "Грузия", flag: "🇬🇪" },
  { code: "+374", title: "Армения", flag: "🇦🇲" },
]

// Идея компонента: код страны выбирается не нативным select (см. «Country
// Prefix»), а раскрывающейся панелью на <details>/<summary> — в кнопке-триггере
// виден флаг и код, а в панели рядом с кодом ещё и полное название страны,
// которого в узком select не поместилось бы. <details> даёт открытие и
// закрытие с клавиатуры бесплатно, Escape и выбор пункта закрывают панель и
// возвращают фокус на триггер вручную.
const STYLES = `
:where([data-vibeui-block="inputgroup-021"]){
--vibeui-inputgroup-021-surface:oklch(1 0 0);
--vibeui-inputgroup-021-shell:oklch(0.91 0.006 265);
--vibeui-inputgroup-021-fg:oklch(0.22 0.014 265);
--vibeui-inputgroup-021-muted:oklch(0.55 0.014 265);
--vibeui-inputgroup-021-field:oklch(0.99 0.002 265);
--vibeui-inputgroup-021-fixed:oklch(0.96 0.004 265);
--vibeui-inputgroup-021-border:oklch(0.86 0.008 265);
--vibeui-inputgroup-021-accent:oklch(0.62 0.15 70);
--vibeui-inputgroup-021-radius:0.75rem;
--vibeui-inputgroup-021-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="inputgroup-021"]{
display:flex;flex-direction:column;gap:0.4375rem;margin:0;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-inputgroup-021-surface);
border:1px solid var(--vibeui-inputgroup-021-shell);border-radius:0.875rem;
font-family:var(--vibeui-inputgroup-021-font);color:var(--vibeui-inputgroup-021-fg);
}
[data-vibeui-block="inputgroup-021"] *{box-sizing:border-box}
[data-vibeui-block="inputgroup-021"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="inputgroup-021"] [data-part="group"]{display:flex;align-items:stretch;position:relative}
[data-vibeui-block="inputgroup-021"] [data-part="picker"]{
position:relative;flex:none;margin-right:-1px;
}
[data-vibeui-block="inputgroup-021"] summary{
list-style:none;cursor:pointer;user-select:none;
display:flex;align-items:center;gap:0.375rem;height:2.75rem;
padding:0 1.5rem 0 0.75rem;position:relative;
border:1px solid var(--vibeui-inputgroup-021-border);
border-radius:var(--vibeui-inputgroup-021-radius) 0 0 var(--vibeui-inputgroup-021-radius);
background:var(--vibeui-inputgroup-021-fixed);
font-size:0.8125rem;font-weight:650;color:var(--vibeui-inputgroup-021-muted);
}
[data-vibeui-block="inputgroup-021"] summary::-webkit-details-marker{display:none}
[data-vibeui-block="inputgroup-021"] summary:focus{outline:none}
[data-vibeui-block="inputgroup-021"] summary:focus-visible{
z-index:1;outline:2px solid var(--vibeui-inputgroup-021-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-021-accent);
}
[data-vibeui-block="inputgroup-021"] [data-part="chevron"]{
position:absolute;right:0.625rem;top:50%;
width:0.5rem;height:0.5rem;
border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;
transform:translateY(-65%) rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="inputgroup-021"] details[open] [data-part="chevron"]{
transform:translateY(-35%) rotate(-135deg);
}
[data-vibeui-block="inputgroup-021"] [data-part="flag"]{font-size:0.9375rem;line-height:1}
[data-vibeui-block="inputgroup-021"] [data-part="listbox"]{
list-style:none;margin:0.25rem 0 0;padding:0.25rem;
position:absolute;left:0;top:100%;z-index:2;min-width:13rem;max-height:14rem;overflow:auto;
border:1px solid var(--vibeui-inputgroup-021-border);border-radius:var(--vibeui-inputgroup-021-radius);
background:var(--vibeui-inputgroup-021-surface);
box-shadow:0 0.5rem 1.5rem oklch(0.2 0.02 265 / 0.16);
}
[data-vibeui-block="inputgroup-021"] [data-part="listbox"] button{
appearance:none;width:100%;cursor:pointer;text-align:left;
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.625rem;border-radius:0.5rem;color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="inputgroup-021"] [data-part="listbox"] button:hover{
background:var(--vibeui-inputgroup-021-fixed);
}
[data-vibeui-block="inputgroup-021"] [data-part="listbox"] button:focus-visible{
outline:2px solid var(--vibeui-inputgroup-021-accent);outline-offset:-2px;
}
[data-vibeui-block="inputgroup-021"] [data-part="listbox"] button[aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-inputgroup-021-accent) 14%,var(--vibeui-inputgroup-021-surface));
font-weight:650;
}
[data-vibeui-block="inputgroup-021"] [data-part="title"]{flex:1;min-width:0}
[data-vibeui-block="inputgroup-021"] [data-part="code"]{
color:var(--vibeui-inputgroup-021-muted);font-variant-numeric:tabular-nums;
}
[data-vibeui-block="inputgroup-021"] input{
flex:1;min-width:0;height:2.75rem;padding:0 0.875rem;
border:1px solid var(--vibeui-inputgroup-021-border);
border-radius:0 var(--vibeui-inputgroup-021-radius) var(--vibeui-inputgroup-021-radius) 0;
background:var(--vibeui-inputgroup-021-field);font:inherit;font-size:0.875rem;color:inherit;
font-variant-numeric:tabular-nums;letter-spacing:0.02em;
}
[data-vibeui-block="inputgroup-021"] input:focus{
z-index:1;outline:2px solid var(--vibeui-inputgroup-021-accent);outline-offset:-1px;
border-color:var(--vibeui-inputgroup-021-accent);
}
[data-vibeui-block="inputgroup-021"] [data-part="hint"]{
margin:0;font-size:0.75rem;line-height:1.4;color:var(--vibeui-inputgroup-021-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="inputgroup-021"] *{animation:none!important;transition:none!important}}
`

/**
 * Сцепка «раскрывающийся выбор кода страны + номер»: панель на <details>,
 * триггер показывает флаг и код, список — код и полное название страны.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Inputgroup021({
  name = "phone",
  label = "Телефон для связи",
  countries = COUNTRIES,
  hint = "Код страны открывается панелью, а не системным списком — в ней виден не только код, но и название страны.",
  accent,
  className,
  style,
  ...props
}: Inputgroup021Props) {
  const id = useId()
  const detailsRef = useRef<HTMLDetailsElement | null>(null)
  const summaryRef = useRef<HTMLButtonElement | null>(null)
  const [selected, setSelected] = useState(countries[0] ?? COUNTRIES[0])
  const [open, setOpen] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-inputgroup-021-accent": accent } : null),
    ...style,
  } as CSSProperties

  const close = () => {
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
    setOpen(false)
  }

  return (
    <>
      <style href="vibeui-inputgroup-021" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="inputgroup-021"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-number`}>{label}</label>
        <div data-part="group">
          <details
            ref={detailsRef}
            data-part="picker"
            onToggle={(event) =>
              setOpen((event.currentTarget as HTMLDetailsElement).open)
            }
            onKeyDown={(event) => {
              if (event.key === "Escape" && open) {
                event.preventDefault()
                close()
                summaryRef.current?.focus()
              }
            }}
          >
            <summary
              ref={summaryRef}
              aria-haspopup="listbox"
              aria-label={`Код страны: ${selected.title}, ${selected.code}`}
            >
              <span data-part="flag" aria-hidden="true">
                {selected.flag}
              </span>
              {selected.code}
              <span data-part="chevron" aria-hidden="true" />
            </summary>
            <ul data-part="listbox" role="listbox" aria-label="Страны">
              {countries.map((country) => (
                <li key={country.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={country.code === selected.code}
                    onClick={() => {
                      setSelected(country)
                      close()
                      summaryRef.current?.focus()
                    }}
                  >
                    <span aria-hidden="true">{country.flag}</span>
                    <span data-part="title">{country.title}</span>
                    <span data-part="code">{country.code}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
          <input
            id={`${id}-number`}
            name={name}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="999 000-00-00"
            aria-describedby={`${id}-hint`}
          />
          <input type="hidden" name={`${name}-code`} value={selected.code} />
        </div>
        <p data-part="hint" id={`${id}-hint`}>
          {hint}
        </p>
      </div>
    </>
  )
}
