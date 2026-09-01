"use client"

import { useId, useMemo, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
  ReactNode,
} from "react"

export type Combobox023Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultQuery?: string
  emptyLabel?: string
  defaultValue?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: подсветка честная — размечается каждое вхождение запроса
// в строке, а не только первое, и порядок строк не перестраивается: это
// фильтр с подсветкой, а не ранжирование. Разметка построена нарезкой
// строки на куски и семантическим <mark>, без dangerouslySetInnerHTML.
const STYLES = `
:where([data-vibeui-block="combobox-023"]){
--vibeui-combobox-023-bg:oklch(1 0 0);
--vibeui-combobox-023-fg:oklch(0.22 0.02 340);
--vibeui-combobox-023-muted:oklch(0.53 0.02 340);
--vibeui-combobox-023-border:oklch(0.9 0.01 340);
--vibeui-combobox-023-field:oklch(0.985 0.004 340);
--vibeui-combobox-023-active:oklch(0.95 0.035 340);
--vibeui-combobox-023-accent:oklch(0.5 0.17 340);
--vibeui-combobox-023-mark:oklch(0.92 0.09 340);
--vibeui-combobox-023-radius:0.625rem;
--vibeui-combobox-023-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-023"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-023-bg);
border:1px solid var(--vibeui-combobox-023-border);
border-radius:calc(var(--vibeui-combobox-023-radius) + 0.25rem);
color:var(--vibeui-combobox-023-fg);
font-family:var(--vibeui-combobox-023-font);
}
[data-vibeui-block="combobox-023"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-023"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-023-border);
border-radius:var(--vibeui-combobox-023-radius);
background:var(--vibeui-combobox-023-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-023"] input::placeholder{color:var(--vibeui-combobox-023-muted)}
[data-vibeui-block="combobox-023"] input:focus-visible{outline:2px solid var(--vibeui-combobox-023-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-023"] [data-part="count"]{margin:0;font-size:0.75rem;color:var(--vibeui-combobox-023-muted)}
[data-vibeui-block="combobox-023"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-023-border);
border-radius:var(--vibeui-combobox-023-radius);
}
[data-vibeui-block="combobox-023"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-023"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-023-active)}
[data-vibeui-block="combobox-023"] mark{
background:var(--vibeui-combobox-023-mark);color:inherit;border-radius:0.15rem;padding:0 0.05em;
}
[data-vibeui-block="combobox-023"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-023-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-023"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Барбарис солёный",
  "Барбекю классический",
  "Сметана с зеленью",
  "Сыр с прованскими травами",
  "Бархатное манго",
  "Барный лайм",
  "Морская соль с барбарисом",
]

function highlight(text: string, needle: string): ReactNode {
  if (!needle) return text
  const lower = text.toLowerCase()
  const term = needle.toLowerCase()
  const first = lower.indexOf(term)
  if (first === -1) return text

  const parts: ReactNode[] = []
  let cursor = 0
  let index = first

  while (index !== -1) {
    if (index > cursor) parts.push(text.slice(cursor, index))
    parts.push(
      <mark key={index}>{text.slice(index, index + term.length)}</mark>,
    )
    cursor = index + term.length
    index = lower.indexOf(term, cursor)
  }
  if (cursor < text.length) parts.push(text.slice(cursor))

  return parts
}

/**
 * Combobox с подсветкой всех вхождений запроса, без изменения порядка
 * строк: это фильтр с подсветкой, а не ранжирование.
 */
export function Combobox023({
  label = "Вкус чипсов",
  placeholder = "Начните вводить",
  options = DEFAULT_OPTIONS,
  defaultQuery = "бар",
  emptyLabel = "Ничего не нашлось",
  defaultValue = "",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox023Props) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)
  const [value, setValue] = useState(defaultValue)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const needle = query.trim()

  const matches = useMemo(() => {
    const lower = needle.toLowerCase()
    if (!lower) return options
    return options.filter((option) => option.toLowerCase().includes(lower))
  }, [options, needle])

  const palette = {
    ...(accent ? { "--vibeui-combobox-023-accent": accent } : null),
    ...style,
  } as CSSProperties

  const commit = (option: string) => {
    setValue(option)
    setQuery("")
    setActive(0)
    onSelect?.(option)
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
      setQuery("")
      setActive(0)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-023" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-023"
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
            matches[active] ? `${id}-option-${active}` : undefined
          }
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <p data-part="count" aria-live="polite">
          {needle ? `Совпадений: ${matches.length}` : "Все варианты"}
        </p>
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
              title={option}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                commit(option)
              }}
            >
              {highlight(option, needle)}
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
