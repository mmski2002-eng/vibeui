"use client"

import { useId, useMemo, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Autocomplete003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string[]
  max?: number
  onChange?: (value: string[]) => void
  accent?: string
}

// Идея компонента: множественный выбор фишками. Ключевое поведение — Backspace
// в пустом поле снимает последнюю фишку: без него набранный список нечем
// править с клавиатуры, придётся целиться мышью в крестик. Выбранное из
// списка исчезает: предлагать уже добавленное — обманывать.
const STYLES = `
:where([data-vibeui-block="autocomplete-003"]){
--vibeui-autocomplete-003-bg:oklch(1 0 0);
--vibeui-autocomplete-003-fg:oklch(0.22 0.014 265);
--vibeui-autocomplete-003-muted:oklch(0.52 0.014 265);
--vibeui-autocomplete-003-border:oklch(0.9 0.006 265);
--vibeui-autocomplete-003-chip:oklch(0.95 0.02 265);
--vibeui-autocomplete-003-active:oklch(0.95 0.02 265);
--vibeui-autocomplete-003-accent:oklch(0.55 0.17 265);
--vibeui-autocomplete-003-radius:0.625rem;
--vibeui-autocomplete-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-003-bg);
border:1px solid var(--vibeui-autocomplete-003-border);
border-radius:calc(var(--vibeui-autocomplete-003-radius) + 0.25rem);
color:var(--vibeui-autocomplete-003-fg);
font-family:var(--vibeui-autocomplete-003-font);
}
[data-vibeui-block="autocomplete-003"] label{font-size:0.8125rem;font-weight:600}
/* Поле растёт по числу фишек: обрезать их скроллом — прятать введённое. */
[data-vibeui-block="autocomplete-003"] [data-part="box"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.3125rem;
min-height:2.5rem;padding:0.3125rem 0.5rem;
border:1px solid var(--vibeui-autocomplete-003-border);
border-radius:var(--vibeui-autocomplete-003-radius);
background:oklch(0.985 0.002 265);
}
[data-vibeui-block="autocomplete-003"] [data-part="box"]:focus-within{
outline:2px solid var(--vibeui-autocomplete-003-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="autocomplete-003"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;height:1.5rem;
padding:0 0.25rem 0 0.5rem;border-radius:0.4375rem;
background:var(--vibeui-autocomplete-003-chip);
font-size:0.8125rem;
}
[data-vibeui-block="autocomplete-003"] [data-part="remove"]{
appearance:none;border:0;cursor:pointer;background:transparent;
width:1rem;height:1rem;padding:0;border-radius:0.25rem;line-height:1;
color:var(--vibeui-autocomplete-003-muted);font-size:0.875rem;
}
[data-vibeui-block="autocomplete-003"] [data-part="remove"]:hover{color:var(--vibeui-autocomplete-003-fg)}
[data-vibeui-block="autocomplete-003"] [data-part="remove"]:focus-visible{outline:2px solid var(--vibeui-autocomplete-003-accent);outline-offset:1px}
[data-vibeui-block="autocomplete-003"] input{
flex:1 1 6rem;min-width:6rem;height:1.75rem;
border:0;background:transparent;color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-003"] input:focus{outline:none}
[data-vibeui-block="autocomplete-003"] input::placeholder{color:var(--vibeui-autocomplete-003-muted)}
[data-vibeui-block="autocomplete-003"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:9rem;overflow-y:auto;
border:1px solid var(--vibeui-autocomplete-003-border);
border-radius:var(--vibeui-autocomplete-003-radius);
background:var(--vibeui-autocomplete-003-bg);
}
[data-vibeui-block="autocomplete-003"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-003"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-003-active)}
[data-vibeui-block="autocomplete-003"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-autocomplete-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind",
  "Node.js",
  "PostgreSQL",
  "Docker",
  "GraphQL",
]

/**
 * Множественный выбор фишками: Backspace снимает последнюю.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete003({
  label = "Технологии",
  placeholder = "Добавьте технологию",
  options = DEFAULT_OPTIONS,
  defaultValue = ["React", "TypeScript"],
  max = 6,
  onChange,
  accent,
  className,
  style,
  ...props
}: Autocomplete003Props) {
  const id = useId()
  const [chips, setChips] = useState<string[]>(defaultValue)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return options
      .filter((option) => !chips.includes(option))
      .filter((option) => !needle || option.toLowerCase().includes(needle))
  }, [chips, options, query])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const update = (next: string[]) => {
    setChips(next)
    onChange?.(next)
  }

  const add = (value: string) => {
    if (chips.length >= max || chips.includes(value)) return
    update([...chips, value])
    setQuery("")
    setActive(0)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !query && chips.length) {
      update(chips.slice(0, -1))
    } else if (event.key === "ArrowDown" && matches.length) {
      event.preventDefault()
      setActive((active + 1) % matches.length)
    } else if (event.key === "ArrowUp" && matches.length) {
      event.preventDefault()
      setActive((active - 1 + matches.length) % matches.length)
    } else if (event.key === "Enter" && matches[active]) {
      event.preventDefault()
      add(matches[active])
    }
  }

  return (
    <>
      <style href="vibeui-autocomplete-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="box">
          {chips.map((chip) => (
            <span key={chip} data-part="chip">
              {chip}
              <button
                type="button"
                data-part="remove"
                aria-label={`Убрать ${chip}`}
                onClick={() => update(chips.filter((item) => item !== chip))}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id={id}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={chips.length >= max ? "" : placeholder}
            value={query}
            disabled={chips.length >= max}
            aria-expanded={matches.length > 0}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        {matches.length ? (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            data-part="list"
          >
            {matches.map((option, index) => (
              <li
                key={option}
                role="option"
                data-part="option"
                data-active={index === active}
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  add(option)
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        ) : null}
        <span data-part="hint">
          {chips.length} из {max} · Backspace снимает последнюю
        </span>
      </div>
    </>
  )
}
