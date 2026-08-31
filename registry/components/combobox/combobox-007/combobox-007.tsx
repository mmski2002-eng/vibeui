"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Combobox007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  visibleLimit?: number
  hintLabel?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: список на сотни строк нельзя рисовать целиком — в DOM
// уезжает мусор, а человек всё равно не листает дальше десятка. Рисуем окно
// из visibleLimit строк и честно подписываем «показано N из M»: подпись
// объясняет, почему нужного нет на экране, и заменяет прокрутку фильтром.
const STYLES = `
:where([data-vibeui-block="combobox-007"]){
--vibeui-combobox-007-bg:oklch(1 0 0);
--vibeui-combobox-007-fg:oklch(0.22 0.012 250);
--vibeui-combobox-007-muted:oklch(0.53 0.012 250);
--vibeui-combobox-007-border:oklch(0.9 0.006 250);
--vibeui-combobox-007-field:oklch(0.98 0.004 250);
--vibeui-combobox-007-active:oklch(0.95 0.02 250);
--vibeui-combobox-007-accent:oklch(0.52 0.13 250);
--vibeui-combobox-007-radius:0.625rem;
--vibeui-combobox-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-combobox-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
}
[data-vibeui-block="combobox-007"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-007-bg);
border:1px solid var(--vibeui-combobox-007-border);
border-radius:calc(var(--vibeui-combobox-007-radius) + 0.25rem);
color:var(--vibeui-combobox-007-fg);
font-family:var(--vibeui-combobox-007-font);
}
[data-vibeui-block="combobox-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-007"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-007-border);
border-radius:var(--vibeui-combobox-007-radius);
background:var(--vibeui-combobox-007-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-007"] input::placeholder{color:var(--vibeui-combobox-007-muted)}
[data-vibeui-block="combobox-007"] input:focus-visible{outline:2px solid var(--vibeui-combobox-007-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-007"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:11rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-007-border);
border-radius:var(--vibeui-combobox-007-radius);
}
[data-vibeui-block="combobox-007"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:1.9rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-007"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-007-active)}
[data-vibeui-block="combobox-007"] [data-part="code"]{
flex:none;font-family:var(--vibeui-combobox-007-mono);font-size:0.72rem;
color:var(--vibeui-combobox-007-accent);
}
[data-vibeui-block="combobox-007"] [data-part="name"]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
[data-vibeui-block="combobox-007"] [data-part="status"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-combobox-007-muted);
}
[data-vibeui-block="combobox-007"] [data-part="bar"]{
position:relative;height:0.2rem;border-radius:999px;overflow:hidden;
background:var(--vibeui-combobox-007-active);
}
[data-vibeui-block="combobox-007"] [data-part="bar"] span{
display:block;height:100%;border-radius:999px;
background:var(--vibeui-combobox-007-accent);transition:width .2s ease;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-007"] *{animation:none!important;transition:none!important}}
`

const PARTS = [
  "Подшипник",
  "Ремень",
  "Фильтр",
  "Насос",
  "Клапан",
  "Втулка",
  "Шкив",
  "Муфта",
  "Прокладка",
  "Датчик",
  "Реле",
  "Шланг",
]

const DEFAULT_OPTIONS = Array.from({ length: 240 }, (_, index) => {
  const part = PARTS[index % PARTS.length]
  return `AX-${String(1000 + index)} ${part} ${(index % 24) + 1}`
})

/**
 * Combobox для длинного справочника: рисуется окно из первых совпадений,
 * под списком — честная подпись «показано N из M».
 */
export function Combobox007({
  label = "Артикул",
  placeholder = "Код или название",
  options = DEFAULT_OPTIONS,
  visibleLimit = 40,
  hintLabel = "уточните запрос",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox007Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState("")
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const { rows, total } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const found = needle
      ? options.filter((option) => option.toLowerCase().includes(needle))
      : options

    return { rows: found.slice(0, visibleLimit), total: found.length }
  }, [options, query, visibleLimit])

  const palette = {
    ...(accent ? { "--vibeui-combobox-007-accent": accent } : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    onSelect?.(option)
  }

  const move = (delta: number) => {
    if (!rows.length) return
    const next = (active + delta + rows.length) % rows.length
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
    } else if (event.key === "PageDown") {
      event.preventDefault()
      move(10)
    } else if (event.key === "PageUp") {
      event.preventDefault()
      move(-10)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (rows[active]) commit(rows[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const share = total ? Math.round((rows.length / total) * 100) : 0

  return (
    <>
      <style href="vibeui-combobox-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-007"
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
          aria-describedby={`${id}-status`}
          aria-activedescendant={
            rows[active] ? `${id}-option-${active}` : undefined
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
          {rows.map((option, index) => {
            const [code, ...rest] = option.split(" ")

            return (
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
                <span data-part="code">{code}</span>
                <span data-part="name">{rest.join(" ")}</span>
              </li>
            )
          })}
        </ul>
        <div data-part="bar" aria-hidden="true">
          <span style={{ width: `${share}%` }} />
        </div>
        <p data-part="status" id={`${id}-status`} aria-live="polite">
          <span>
            показано {rows.length} из {total}
          </span>
          {rows.length < total ? <span>{hintLabel}</span> : null}
        </p>
      </div>
    </>
  )
}
