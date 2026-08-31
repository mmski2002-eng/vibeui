"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultSelected?: string[]
  emptyLabel?: string
  maxSelected?: number
  onChange?: (values: string[]) => void
  accent?: string
}

// Идея компонента: множественный выбор из закрытого списка. В отличие от
// тег-пикера выбранное НЕ исчезает из списка — оно остаётся с галочкой и
// aria-selected="true", потому что человек должен видеть, что уже отмечено,
// и снимать выбор там же, где ставил.
const STYLES = `
:where([data-vibeui-block="combobox-003"]){
--vibeui-combobox-003-bg:oklch(1 0 0);
--vibeui-combobox-003-fg:oklch(0.22 0.02 300);
--vibeui-combobox-003-muted:oklch(0.53 0.02 300);
--vibeui-combobox-003-border:oklch(0.9 0.01 300);
--vibeui-combobox-003-field:oklch(0.985 0.004 300);
--vibeui-combobox-003-active:oklch(0.95 0.03 300);
--vibeui-combobox-003-accent:oklch(0.53 0.19 300);
--vibeui-combobox-003-chip:oklch(0.95 0.04 300);
--vibeui-combobox-003-radius:0.625rem;
--vibeui-combobox-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-003"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-003-bg);
border:1px solid var(--vibeui-combobox-003-border);
border-radius:calc(var(--vibeui-combobox-003-radius) + 0.25rem);
color:var(--vibeui-combobox-003-fg);
font-family:var(--vibeui-combobox-003-font);
}
[data-vibeui-block="combobox-003"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.5rem;
}
[data-vibeui-block="combobox-003"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-003"] [data-part="counter"]{font-size:0.75rem;color:var(--vibeui-combobox-003-muted)}
[data-vibeui-block="combobox-003"] [data-part="field"]{
display:flex;flex-wrap:wrap;align-items:center;gap:0.3rem;
box-sizing:border-box;width:100%;min-height:2.5rem;padding:0.3rem 0.45rem;
border:1px solid var(--vibeui-combobox-003-border);
border-radius:var(--vibeui-combobox-003-radius);
background:var(--vibeui-combobox-003-field);
}
[data-vibeui-block="combobox-003"] [data-part="field"]:has(input:focus-visible){
outline:2px solid var(--vibeui-combobox-003-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-003"] [data-part="chip"]{
display:inline-flex;align-items:center;gap:0.25rem;
height:1.6rem;padding:0 0.2rem 0 0.5rem;border-radius:999px;
background:var(--vibeui-combobox-003-chip);
font-size:0.78rem;font-weight:600;
}
[data-vibeui-block="combobox-003"] [data-part="chipclose"]{
appearance:none;border:0;cursor:pointer;background:transparent;color:inherit;
display:inline-flex;align-items:center;justify-content:center;
width:1.1rem;height:1.1rem;border-radius:999px;font-size:0.85rem;line-height:1;
}
[data-vibeui-block="combobox-003"] [data-part="chipclose"]:hover{background:var(--vibeui-combobox-003-bg)}
[data-vibeui-block="combobox-003"] [data-part="chipclose"]:focus-visible{outline:2px solid var(--vibeui-combobox-003-accent);outline-offset:1px}
[data-vibeui-block="combobox-003"] input{
flex:1 1 6rem;min-width:5rem;height:1.8rem;padding:0 0.25rem;
border:0;background:transparent;color:inherit;font:inherit;font-size:0.875rem;outline:none;
}
[data-vibeui-block="combobox-003"] input::placeholder{color:var(--vibeui-combobox-003-muted)}
[data-vibeui-block="combobox-003"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:10rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-003-border);
border-radius:var(--vibeui-combobox-003-radius);
}
[data-vibeui-block="combobox-003"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-003"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-003-active)}
[data-vibeui-block="combobox-003"] [data-part="box"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1rem;height:1rem;border-radius:0.3rem;font-size:0.7rem;line-height:1;
border:1.5px solid var(--vibeui-combobox-003-border);
}
[data-vibeui-block="combobox-003"] [data-part="option"][aria-selected="true"] [data-part="box"]{
background:var(--vibeui-combobox-003-accent);border-color:var(--vibeui-combobox-003-accent);color:oklch(1 0 0);
}
[data-vibeui-block="combobox-003"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-003-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Аналитика",
  "Бэкенд",
  "Дизайн",
  "Документация",
  "Инфраструктура",
  "Мобильные",
  "Поддержка",
  "Фронтенд",
]

/**
 * Combobox с множественным выбором фишками: выбранное остаётся в списке
 * с отметкой, Backspace в пустом поле снимает последнюю фишку.
 */
export function Combobox003({
  label = "Команды",
  placeholder = "Добавить команду",
  options = DEFAULT_OPTIONS,
  defaultSelected = ["Дизайн", "Фронтенд"],
  emptyLabel = "Ничего не нашлось",
  maxSelected = 5,
  onChange,
  accent,
  className,
  style,
  ...props
}: Combobox003Props) {
  const id = useId()
  const [selected, setSelected] = useState(defaultSelected)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const palette = {
    ...(accent ? { "--vibeui-combobox-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  const apply = (next: string[]) => {
    setSelected(next)
    onChange?.(next)
  }

  const toggle = (option: string) => {
    if (selected.includes(option)) {
      apply(selected.filter((entry) => entry !== option))
      return
    }
    if (selected.length >= maxSelected) return
    apply([...selected, option])
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
      if (matches[active]) toggle(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
    } else if (event.key === "Backspace" && query === "" && selected.length) {
      apply(selected.slice(0, -1))
    }
  }

  return (
    <>
      <style href="vibeui-combobox-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-003"
        className={className}
        style={palette}
      >
        <div data-part="head">
          <label htmlFor={`${id}-input`}>{label}</label>
          <span data-part="counter" aria-live="polite">
            {selected.length} из {maxSelected}
          </span>
        </div>
        <div data-part="field">
          {selected.map((entry) => (
            <span key={entry} data-part="chip">
              {entry}
              <button
                type="button"
                data-part="chipclose"
                aria-label={`Убрать ${entry}`}
                onClick={() => toggle(entry)}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={selected.length >= maxSelected ? "" : placeholder}
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
          aria-multiselectable="true"
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
              aria-selected={selected.includes(option)}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                toggle(option)
              }}
            >
              <span data-part="box" aria-hidden="true">
                {selected.includes(option) ? "✓" : ""}
              </span>
              {option}
            </li>
          ))}
          {matches.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
