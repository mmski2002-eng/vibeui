"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string
  clearLabel?: string
  undoLabel?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: у фильтра обязан быть выход. Значение показано фишкой
// внутри поля, крестик снимает его и оставляет фокус в поле — так подряд
// меняют фильтр, не бегая мышью. Снятое значение не пропадает совсем:
// строка снизу предлагает вернуть его одним нажатием.
const STYLES = `
:where([data-vibeui-block="combobox-011"]){
--vibeui-combobox-011-bg:oklch(1 0 0);
--vibeui-combobox-011-fg:oklch(0.22 0.016 215);
--vibeui-combobox-011-muted:oklch(0.54 0.016 215);
--vibeui-combobox-011-border:oklch(0.9 0.008 215);
--vibeui-combobox-011-field:oklch(0.985 0.004 215);
--vibeui-combobox-011-active:oklch(0.95 0.03 215);
--vibeui-combobox-011-accent:oklch(0.52 0.12 215);
--vibeui-combobox-011-radius:0.625rem;
--vibeui-combobox-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-011"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-011-bg);
border:1px solid var(--vibeui-combobox-011-border);
border-radius:calc(var(--vibeui-combobox-011-radius) + 0.25rem);
color:var(--vibeui-combobox-011-fg);
font-family:var(--vibeui-combobox-011-font);
}
[data-vibeui-block="combobox-011"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-011"] [data-part="field"]{
display:flex;align-items:center;gap:0.35rem;
box-sizing:border-box;width:100%;min-height:2.5rem;padding:0.25rem 0.45rem;
border:1px solid var(--vibeui-combobox-011-border);
border-radius:var(--vibeui-combobox-011-radius);
background:var(--vibeui-combobox-011-field);
}
[data-vibeui-block="combobox-011"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-combobox-011-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-011"] [data-part="value"]{
display:inline-flex;align-items:center;gap:0.3rem;flex:none;max-width:60%;
height:1.7rem;padding:0 0.25rem 0 0.55rem;border-radius:999px;
background:var(--vibeui-combobox-011-active);
font-size:0.8rem;font-weight:600;
}
[data-vibeui-block="combobox-011"] [data-part="valuetext"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="combobox-011"] [data-part="clear"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.2rem;height:1.2rem;border-radius:999px;font-size:0.9rem;line-height:1;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-011"] [data-part="clear"]:hover{background:var(--vibeui-combobox-011-bg)}
[data-vibeui-block="combobox-011"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-combobox-011-accent);outline-offset:1px}
[data-vibeui-block="combobox-011"] input{
flex:1 1 5rem;min-width:4rem;height:1.9rem;padding:0 0.25rem;
border:0;background:transparent;color:inherit;font:inherit;font-size:0.875rem;outline:none;
}
[data-vibeui-block="combobox-011"] input::placeholder{color:var(--vibeui-combobox-011-muted)}
[data-vibeui-block="combobox-011"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:9.5rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-011-border);
border-radius:var(--vibeui-combobox-011-radius);
}
[data-vibeui-block="combobox-011"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-011"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-011-active)}
[data-vibeui-block="combobox-011"] [data-part="option"][aria-selected="true"]{font-weight:650;color:var(--vibeui-combobox-011-accent)}
[data-vibeui-block="combobox-011"] [data-part="foot"]{
display:flex;align-items:center;gap:0.4rem;min-height:1.2rem;
font-size:0.75rem;color:var(--vibeui-combobox-011-muted);
}
[data-vibeui-block="combobox-011"] [data-part="undo"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0;
font:inherit;font-size:0.75rem;font-weight:700;
color:var(--vibeui-combobox-011-accent);text-decoration:underline;
}
[data-vibeui-block="combobox-011"] [data-part="undo"]:focus-visible{outline:2px solid var(--vibeui-combobox-011-accent);outline-offset:2px;border-radius:0.2rem}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Все проекты",
  "Витрина",
  "Личный кабинет",
  "Мобильное приложение",
  "Панель оператора",
  "Складской учёт",
]

/**
 * Combobox с очисткой значения: фишка с крестиком снимает выбор, фокус
 * остаётся в поле, а снятое значение можно вернуть.
 */
export function Combobox011({
  label = "Проект",
  placeholder = "Найти проект",
  options = DEFAULT_OPTIONS,
  defaultValue = "Личный кабинет",
  clearLabel = "Очистить выбор",
  undoLabel = "вернуть",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox011Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [dropped, setDropped] = useState("")
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const palette = {
    ...(accent ? { "--vibeui-combobox-011-accent": accent } : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setDropped("")
    setQuery("")
    setActive(0)
    onSelect?.(option)
  }

  const clear = () => {
    if (!value) return
    setDropped(value)
    setValue("")
    setQuery("")
    onSelect?.("")
    inputRef.current?.focus()
  }

  const move = (delta: number) => {
    if (!matches.length) return
    const next = (active + delta + matches.length) % matches.length
    setActive(next)
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      if (query) setQuery("")
      else clear()
    } else if (event.key === "Backspace" && query === "" && value) {
      event.preventDefault()
      clear()
    }
  }

  return (
    <>
      <style href="vibeui-combobox-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-011"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <div data-part="field">
          {value ? (
            <span data-part="value">
              <span data-part="valuetext">{value}</span>
              <button
                type="button"
                data-part="clear"
                aria-label={`${clearLabel}: ${value}`}
                onClick={clear}
              >
                ×
              </button>
            </span>
          ) : null}
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={value ? "" : placeholder}
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={
              matches[active] ? `${id}-option-${active}` : undefined
            }
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.map((option, index) => (
            <li
              key={option}
              id={`${id}-option-${index}`}
              role="option"
              data-part="option"
              data-active={index === active}
              aria-selected={option === value}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(option)
              }}
            >
              {option}
            </li>
          ))}
        </ul>
        <p data-part="foot" aria-live="polite">
          {dropped ? (
            <>
              <span>Снято: {dropped}</span>
              <button
                type="button"
                data-part="undo"
                onClick={() => commit(dropped)}
              >
                {undoLabel}
              </button>
            </>
          ) : (
            <span>{value ? `Выбрано: ${value}` : "Фильтр не задан"}</span>
          )}
        </p>
      </div>
    </>
  )
}
