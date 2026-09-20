"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Autocomplete003Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultValue"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string[]
  max?: number
  /** Показать список сразу, без фокуса: витрина и скриншоты. */
  defaultOpen?: boolean
  /** Подпись кнопки снятия фишки. {chip} — сама фишка. */
  removeLabel?: string
  /** Строка под полем. {count} — набрано, {max} — предел. */
  hintText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор фишками. Ключевое поведение — Backspace
// в пустом поле снимает последнюю фишку: без него набранный список нечем
// править с клавиатуры, придётся целиться мышью в крестик. Выбранное из
// списка исчезает: предлагать уже добавленное — обманывать.
const STYLES = `
:where([data-vibeui-block="autocomplete-003"]){
--vibeui-autocomplete-003-bg:transparent;
--vibeui-autocomplete-003-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-autocomplete-003-muted:color-mix(in oklab,var(--vibeui-autocomplete-003-fg) 68%,transparent);
--vibeui-autocomplete-003-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-003-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-autocomplete-003-panel:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-autocomplete-003-chip:light-dark(oklch(0.95 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-003-active:light-dark(oklch(0.95 0 265),oklch(0.33 0 265));
--vibeui-autocomplete-003-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
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
background:var(--vibeui-autocomplete-003-field);
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
[data-vibeui-block="autocomplete-003"] [data-part="anchor"]{position:relative}
[data-vibeui-block="autocomplete-003"] [data-part="list"]{
position:absolute;left:0;right:0;top:calc(100% + 0.25rem);z-index:30;box-shadow:0 12px 28px -14px oklch(0 0 0 / 40%);
margin:0;padding:0.25rem;list-style:none;max-height:9rem;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-003-border) transparent;
border:1px solid var(--vibeui-autocomplete-003-border);
border-radius:var(--vibeui-autocomplete-003-radius);
background:var(--vibeui-autocomplete-003-panel);
}
[data-vibeui-block="autocomplete-003"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-003"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-003-active)}
[data-vibeui-block="autocomplete-003"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-autocomplete-003-muted)}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-003"]{color-scheme:dark}
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
 * Ветка темы для заданного фона. Без неё светлая плашка досталась бы тексту
 * тёмной ветки: light-dark() смотрит на color-scheme, а не на цвет фона.
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
 * Множественный выбор фишками: Backspace снимает последнюю.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete003({
  label = "Технологии",
  placeholder = "Добавьте технологию",
  options = DEFAULT_OPTIONS,
  defaultValue = ["React", "TypeScript"],
  max = 6,
  removeLabel = "Убрать {chip}",
  hintText = "{count} из {max} · Backspace снимает последнюю",
  onChange,
  defaultOpen = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete003Props) {
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)
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
    ...(background
      ? {
          "--vibeui-autocomplete-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-003"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="anchor">
          <div data-part="box">
            {chips.map((chip) => (
              <span key={chip} data-part="chip">
                {chip}
                <button
                  type="button"
                  data-part="remove"
                  aria-label={removeLabel.replace("{chip}", chip)}
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
              aria-expanded={open && matches.length > 0}
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
            />
          </div>
          {open && matches.length ? (
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
        </div>
        <span data-part="hint">
          {hintText
            .replace("{count}", String(chips.length))
            .replace("{max}", String(max))}
        </span>
      </div>
    </>
  )
}
