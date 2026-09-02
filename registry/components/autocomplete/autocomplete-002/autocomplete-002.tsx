"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Autocomplete002Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  emptyLabel?: string
  /** Открыть список сразу: витрина и скриншоты, в форме не нужен. */
  defaultOpen?: boolean
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: полноценный combobox с клавиатурой. В отличие от datalist
// список рисуем сами — значит обязаны отдать скринридеру то, что браузер
// давал бесплатно: role="combobox" на поле, role="listbox" на списке и
// aria-activedescendant на активной строке. Фокус при этом остаётся в поле:
// перенос фокуса на строку ломает ввод.
const STYLES = `
:where([data-vibeui-block="autocomplete-002"]){
--vibeui-autocomplete-002-bg:transparent;
--vibeui-autocomplete-002-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-002-muted:color-mix(in oklab,var(--vibeui-autocomplete-002-fg) 68%,transparent);
--vibeui-autocomplete-002-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-002-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-autocomplete-002-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-autocomplete-002-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-002-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-002-radius:0.625rem;
--vibeui-autocomplete-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-002"]{
position:relative;display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-002-bg);
border:1px solid var(--vibeui-autocomplete-002-border);
border-radius:calc(var(--vibeui-autocomplete-002-radius) + 0.25rem);
color:var(--vibeui-autocomplete-002-fg);
font-family:var(--vibeui-autocomplete-002-font);
}
[data-vibeui-block="autocomplete-002"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-002"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-autocomplete-002-border);
border-radius:var(--vibeui-autocomplete-002-radius);
background:var(--vibeui-autocomplete-002-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-002"] input::placeholder{color:var(--vibeui-autocomplete-002-muted)}
[data-vibeui-block="autocomplete-002"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-002-accent);outline-offset:1px;border-color:transparent;
}
/* Список в потоке, а не поверх: в карточке каталога и в узкой колонке
   всплывающий слой нечем позиционировать без замера. */
[data-vibeui-block="autocomplete-002"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;
max-height:11rem;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-002-border) transparent;
border:1px solid var(--vibeui-autocomplete-002-border);
border-radius:var(--vibeui-autocomplete-002-radius);
background:var(--vibeui-autocomplete-002-panel);
}
[data-vibeui-block="autocomplete-002"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-002"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-002-active)}
[data-vibeui-block="autocomplete-002"] [data-part="option"] mark{background:transparent;color:var(--vibeui-autocomplete-002-accent);font-weight:650}
[data-vibeui-block="autocomplete-002"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-autocomplete-002-muted)}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-002"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Астрахань",
  "Владивосток",
  "Волгоград",
  "Воронеж",
  "Екатеринбург",
  "Казань",
  "Калининград",
  "Краснодар",
  "Москва",
  "Новосибирск",
  "Пермь",
  "Самара",
]

function highlight(option: string, query: string) {
  if (!query) return option
  const at = option.toLowerCase().indexOf(query.toLowerCase())
  if (at < 0) return option

  return (
    <>
      {option.slice(0, at)}
      <mark>{option.slice(at, at + query.length)}</mark>
      {option.slice(at + query.length)}
    </>
  )
}

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
 * Combobox с фильтрацией, клавиатурой и правильными ролями ARIA.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete002({
  label = "Город",
  placeholder = "Начните вводить",
  options = DEFAULT_OPTIONS,
  emptyLabel = "Ничего не нашлось",
  defaultOpen = false,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete002Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(defaultOpen)
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const commit = (value: string) => {
    setQuery(value)
    setOpen(false)
    onSelect?.(value)
  }

  const move = (delta: number) => {
    if (!matches.length) return
    const next = (active + delta + matches.length) % matches.length
    setActive(next)
    setOpen(true)
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(-1)
    } else if (event.key === "Enter" && open && matches[active]) {
      event.preventDefault()
      commit(matches[active])
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  return (
    <>
      <style href="vibeui-autocomplete-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-002"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[active] ? `${id}-option-${active}` : undefined
          }
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        {open ? (
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
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  commit(option)
                }}
              >
                {highlight(option, query.trim())}
              </li>
            ))}
            {matches.length === 0 ? (
              <li data-part="empty" role="presentation">
                {emptyLabel}
              </li>
            ) : null}
          </ul>
        ) : null}
      </div>
    </>
  )
}
