"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultRecent?: string[]
  recentLabel?: string
  allLabel?: string
  recentLimit?: number
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: человек выбирает одно и то же. Последние выбранные
// поднимаются в отдельный блок сверху, а из общего списка при этом убираются,
// чтобы одна и та же строка не встречалась дважды и не ломала счёт стрелками.
const STYLES = `
:where([data-vibeui-block="combobox-006"]){
--vibeui-combobox-006-bg:oklch(1 0 0);
--vibeui-combobox-006-fg:oklch(0.24 0.02 70);
--vibeui-combobox-006-muted:oklch(0.55 0.02 70);
--vibeui-combobox-006-border:oklch(0.9 0.012 70);
--vibeui-combobox-006-field:oklch(0.985 0.006 70);
--vibeui-combobox-006-active:oklch(0.95 0.045 70);
--vibeui-combobox-006-accent:oklch(0.58 0.14 60);
--vibeui-combobox-006-radius:0.625rem;
--vibeui-combobox-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-006"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-006-bg);
border:1px solid var(--vibeui-combobox-006-border);
border-radius:calc(var(--vibeui-combobox-006-radius) + 0.25rem);
color:var(--vibeui-combobox-006-fg);
font-family:var(--vibeui-combobox-006-font);
}
[data-vibeui-block="combobox-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-006"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-006-border);
border-radius:var(--vibeui-combobox-006-radius);
background:var(--vibeui-combobox-006-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-006"] input::placeholder{color:var(--vibeui-combobox-006-muted)}
[data-vibeui-block="combobox-006"] input:focus-visible{outline:2px solid var(--vibeui-combobox-006-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-006"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-006-border);
border-radius:var(--vibeui-combobox-006-radius);
}
[data-vibeui-block="combobox-006"] [data-part="section"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
padding:0.3rem 0.5rem 0.2rem;
font-size:0.6875rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-combobox-006-muted);
}
[data-vibeui-block="combobox-006"] [data-part="clear"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0.1rem 0.2rem;
border-radius:0.3rem;font:inherit;font-size:0.6875rem;font-weight:700;letter-spacing:0.04em;
color:var(--vibeui-combobox-006-accent);text-transform:none;
}
[data-vibeui-block="combobox-006"] [data-part="clear"]:hover{background:var(--vibeui-combobox-006-active)}
[data-vibeui-block="combobox-006"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-combobox-006-accent);outline-offset:1px}
[data-vibeui-block="combobox-006"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-006"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-006-active)}
[data-vibeui-block="combobox-006"] [data-part="clock"]{
display:inline-flex;align-items:center;justify-content:center;flex:none;
width:1.05rem;height:1.05rem;border-radius:999px;
border:1.5px solid var(--vibeui-combobox-006-accent);position:relative;
}
[data-vibeui-block="combobox-006"] [data-part="clock"]::before{
content:"";position:absolute;left:50%;top:50%;width:0.28rem;height:1.5px;
background:var(--vibeui-combobox-006-accent);transform-origin:left center;transform:translate(0,-50%);
}
[data-vibeui-block="combobox-006"] [data-part="clock"]::after{
content:"";position:absolute;left:50%;top:50%;width:1.5px;height:0.22rem;
background:var(--vibeui-combobox-006-accent);transform-origin:top center;transform:translate(-50%,-100%);
}
[data-vibeui-block="combobox-006"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-006-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Санкт-Петербург",
  "Москва",
  "Новосибирск",
  "Казань",
  "Екатеринбург",
  "Нижний Новгород",
  "Самара",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
]

/**
 * Combobox с недавними значениями: последние выборы поднимаются наверх
 * отдельным блоком, который можно очистить.
 */
export function Combobox006({
  label = "Город доставки",
  placeholder = "Найти город",
  options = DEFAULT_OPTIONS,
  defaultRecent = ["Казань", "Москва"],
  recentLabel = "Недавние",
  allLabel = "Все города",
  recentLimit = 3,
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox006Props) {
  const id = useId()
  const [recent, setRecent] = useState(defaultRecent)
  const [query, setQuery] = useState("")
  const [value, setValue] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const { recentRows, restRows, flat } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const match = (option: string) =>
      !needle || option.toLowerCase().includes(needle)
    const top = recent.filter(match)
    const rest = options.filter(
      (option) => match(option) && !recent.includes(option),
    )

    return { recentRows: top, restRows: rest, flat: [...top, ...rest] }
  }, [options, query, recent])

  const palette = {
    ...(accent ? { "--vibeui-combobox-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    setRecent((previous) =>
      [option, ...previous.filter((entry) => entry !== option)].slice(
        0,
        recentLimit,
      ),
    )
    onSelect?.(option)
  }

  const move = (delta: number) => {
    if (!flat.length) return
    const next = (active + delta + flat.length) % flat.length
    setActive(next)
    listRef.current
      ?.querySelectorAll('[role="option"]')
      [next]?.scrollIntoView({ block: "nearest" })
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
      if (flat[active]) commit(flat[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const renderOption = (option: string, index: number, isRecent: boolean) => (
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
      {isRecent ? <span data-part="clock" aria-hidden="true" /> : null}
      {option}
    </li>
  )

  return (
    <>
      <style href="vibeui-combobox-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-006"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={value || placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            flat[active] ? `${id}-option-${active}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {recentRows.length ? (
            <li data-part="section" role="presentation">
              {recentLabel}
              <button
                type="button"
                data-part="clear"
                onClick={() => {
                  setRecent([])
                  setActive(0)
                }}
              >
                очистить
              </button>
            </li>
          ) : null}
          {recentRows.map((option, index) => renderOption(option, index, true))}
          {restRows.length ? (
            <li data-part="section" role="presentation">
              {allLabel}
            </li>
          ) : null}
          {restRows.map((option, index) =>
            renderOption(option, recentRows.length + index, false),
          )}
          {flat.length === 0 ? (
            <li data-part="empty" role="presentation">
              Ничего не нашлось
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
