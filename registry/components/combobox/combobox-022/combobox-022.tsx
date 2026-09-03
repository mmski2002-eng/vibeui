"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox022Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultRecent?: string[]
  recentLimit?: number
  recentTag?: string
  emptyLabel?: string
  defaultValue?: string
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: недавние значения поднимаются наверх без заголовков —
// достаточно тонкой линии-разделителя с role="separator" и маленькой метки
// «недавно» у самой строки. Список остаётся одним визуальным телом, а не
// двумя подписанными секциями, поэтому разделитель — семантика, а не текст.
const STYLES = `
:where([data-vibeui-block="combobox-022"]){
--vibeui-combobox-022-bg:transparent;
--vibeui-combobox-022-fg:light-dark(oklch(0.22 0.014 205),oklch(0.94 0.006 205));
--vibeui-combobox-022-muted:color-mix(in oklab,var(--vibeui-combobox-022-fg) 68%,transparent);
--vibeui-combobox-022-border:light-dark(oklch(0.9 0.008 205),oklch(0.35 0.012 205));
--vibeui-combobox-022-field:light-dark(oklch(0.985 0.004 205),oklch(0.27 0.012 205));
--vibeui-combobox-022-active:light-dark(oklch(0.95 0.03 205),oklch(0.32 0.035 205));
--vibeui-combobox-022-accent:light-dark(oklch(0.52 0.13 205),oklch(0.74 0.12 205));
--vibeui-combobox-022-tag:light-dark(oklch(0.93 0.045 205),oklch(0.34 0.05 205));
--vibeui-combobox-022-radius:0.625rem;
--vibeui-combobox-022-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-022"]{color-scheme:dark}
[data-vibeui-block="combobox-022"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-022-bg);
border:1px solid var(--vibeui-combobox-022-border);
border-radius:calc(var(--vibeui-combobox-022-radius) + 0.25rem);
color:var(--vibeui-combobox-022-fg);
font-family:var(--vibeui-combobox-022-font);
}
[data-vibeui-block="combobox-022"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-022"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-combobox-022-border);
border-radius:var(--vibeui-combobox-022-radius);
background:var(--vibeui-combobox-022-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-022"] input::placeholder{color:var(--vibeui-combobox-022-muted)}
[data-vibeui-block="combobox-022"] input:focus-visible{outline:2px solid var(--vibeui-combobox-022-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-022"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:12rem;overflow-y:auto;
border:1px solid var(--vibeui-combobox-022-border);
border-radius:var(--vibeui-combobox-022-radius);
}
[data-vibeui-block="combobox-022"] [data-part="divider"]{
height:1px;margin:0.3rem 0.25rem;background:var(--vibeui-combobox-022-border);
}
[data-vibeui-block="combobox-022"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-022"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-022-active)}
[data-vibeui-block="combobox-022"] [data-part="tag"]{
margin-left:auto;padding:0.05rem 0.4rem;border-radius:999px;flex:none;
font-size:0.65rem;font-weight:700;letter-spacing:0.02em;
background:var(--vibeui-combobox-022-tag);color:var(--vibeui-combobox-022-accent);
}
[data-vibeui-block="combobox-022"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-022-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-022"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Новосибирск",
  "Екатеринбург",
  "Самара",
  "Уфа",
  "Красноярск",
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
 * Combobox с недавними значениями сверху: без заголовков секций, только
 * тонкий разделитель и метка «недавно» у строки.
 */
export function Combobox022({
  label = "Город доставки",
  placeholder = "Найти город",
  options = DEFAULT_OPTIONS,
  defaultRecent = ["Казань", "Самара"],
  recentLimit = 3,
  recentTag = "недавно",
  emptyLabel = "Ничего не нашлось",
  defaultValue = "",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox022Props) {
  const id = useId()
  const [recent, setRecent] = useState(defaultRecent)
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
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
    ...(accent ? { "--vibeui-combobox-022-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-022-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
      {option}
      {isRecent ? <span data-part="tag">{recentTag}</span> : null}
    </li>
  )

  return (
    <>
      <style href="vibeui-combobox-022" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-022"
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
          {recentRows.map((option, index) => renderOption(option, index, true))}
          {recentRows.length && restRows.length ? (
            <li
              data-part="divider"
              role="separator"
              aria-orientation="horizontal"
            />
          ) : null}
          {restRows.map((option, index) =>
            renderOption(option, recentRows.length + index, false),
          )}
          {flat.length === 0 ? (
            <li data-part="empty" role="presentation">
              {emptyLabel}
            </li>
          ) : null}
        </ul>
      </div>
    </>
  )
}
