"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Autocomplete005Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  /** Откуда брать подсказки. По умолчанию — задержанный локальный список. */
  search?: (query: string) => Promise<string[]>
  defaultQuery?: string
  delay?: number
  /** Строка состояния: ключи loading, empty, idle. */
  statusText?: Record<string, string>
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказки приходят с сервера, и поле честно показывает три
// состояния — ждём, нашли, не нашли. Запрос уходит не на каждую букву:
// пауза в 320 мс отсекает промежуточные слова, иначе на «казань» уходит шесть
// запросов вместо одного. Ответ на устаревший запрос отбрасывается — иначе
// медленный ответ на «ка» перезапишет быстрый ответ на «казань».
const STYLES = `
:where([data-vibeui-block="autocomplete-005"]){
--vibeui-autocomplete-005-bg:transparent;
--vibeui-autocomplete-005-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-autocomplete-005-muted:color-mix(in oklab,var(--vibeui-autocomplete-005-fg) 68%,transparent);
--vibeui-autocomplete-005-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-005-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-autocomplete-005-panel:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-autocomplete-005-active:light-dark(oklch(0.95 0 265),oklch(0.33 0 265));
--vibeui-autocomplete-005-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.74 0.15 39.8));
--vibeui-autocomplete-005-radius:0.625rem;
--vibeui-autocomplete-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-005"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-005-bg);
border:1px solid var(--vibeui-autocomplete-005-border);
border-radius:calc(var(--vibeui-autocomplete-005-radius) + 0.25rem);
color:var(--vibeui-autocomplete-005-fg);
font-family:var(--vibeui-autocomplete-005-font);
}
[data-vibeui-block="autocomplete-005"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-005"] [data-part="field"]{position:relative}
[data-vibeui-block="autocomplete-005"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 2.25rem 0 0.75rem;
border:1px solid var(--vibeui-autocomplete-005-border);
border-radius:var(--vibeui-autocomplete-005-radius);
background:var(--vibeui-autocomplete-005-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-005"] input::placeholder{color:var(--vibeui-autocomplete-005-muted)}
[data-vibeui-block="autocomplete-005"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-005-accent);outline-offset:1px;border-color:transparent;
}
/* Кольцо ожидания: спиннер из бордюра, без картинки и без пакета. */
[data-vibeui-block="autocomplete-005"] [data-part="spinner"]{
position:absolute;right:0.75rem;top:50%;width:0.875rem;height:0.875rem;margin-top:-0.4375rem;
border:2px solid var(--vibeui-autocomplete-005-border);
border-top-color:var(--vibeui-autocomplete-005-accent);
border-radius:9999px;animation:vibeui-autocomplete-005-spin .7s linear infinite;
}
@keyframes vibeui-autocomplete-005-spin{to{transform:rotate(360deg)}}
[data-vibeui-block="autocomplete-005"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:10rem;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-005-border) transparent;
border:1px solid var(--vibeui-autocomplete-005-border);
border-radius:var(--vibeui-autocomplete-005-radius);
background:var(--vibeui-autocomplete-005-panel);
}
[data-vibeui-block="autocomplete-005"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-005"] [data-part="option"]:hover{background:var(--vibeui-autocomplete-005-active)}
[data-vibeui-block="autocomplete-005"] [data-part="status"]{font-size:0.75rem;color:var(--vibeui-autocomplete-005-muted)}
[data-vibeui-block="autocomplete-005"] [data-part="option"] mark{background:transparent;color:var(--vibeui-autocomplete-005-accent);font-weight:650}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-005"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){
[data-vibeui-block="autocomplete-005"] *{animation:none!important;transition:none!important}
[data-vibeui-block="autocomplete-005"] [data-part="spinner"]{border-top-color:var(--vibeui-autocomplete-005-border)}
}
`

const CITIES = [
  "Анапа",
  "Ангарск",
  "Астрахань",
  "Барнаул",
  "Казань",
  "Калуга",
  "Краснодар",
  "Курск",
  "Мурманск",
  "Тула",
]

const localSearch = (query: string) =>
  new Promise<string[]>((resolve) => {
    const needle = query.trim().toLowerCase()
    setTimeout(
      () =>
        resolve(CITIES.filter((city) => city.toLowerCase().startsWith(needle))),
      520,
    )
  })

const STATUS_TEXT = {
  loading: "Ищем…",
  empty: "Ничего не нашлось — проверьте написание",
  idle: "Подсказки приходят с сервера",
}

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
 * Подсказки с сервера: пауза перед запросом и три честных состояния.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete005({
  label = "Город доставки",
  placeholder = "Начните вводить",
  search = localSearch,
  defaultQuery = "",
  delay = 320,
  statusText = STATUS_TEXT,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete005Props) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)
  const [items, setItems] = useState<string[]>([])
  const [loading, setLoading] = useState(Boolean(defaultQuery))

  useEffect(() => {
    if (!query.trim()) return

    let alive = true
    const timer = setTimeout(() => {
      search(query).then((found) => {
        // Ответ на устаревший запрос отбрасываем: гонка перезапишет свежий.
        if (!alive) return
        setItems(found)
        setLoading(false)
      })
    }, delay)

    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [delay, query, search])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-005-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-005-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const empty = !loading && Boolean(query.trim()) && items.length === 0

  return (
    <>
      <style href="vibeui-autocomplete-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-005"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <div data-part="field">
          <input
            id={id}
            type="text"
            role="combobox"
            autoComplete="off"
            placeholder={placeholder}
            value={query}
            aria-expanded={items.length > 0}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-busy={loading}
            onChange={(event) => {
              const next = event.target.value
              setQuery(next)
              setLoading(Boolean(next.trim()))
              if (!next.trim()) setItems([])
            }}
          />
          {loading ? <span data-part="spinner" aria-hidden="true" /> : null}
        </div>
        {items.length ? (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            data-part="list"
          >
            {items.map((item) => (
              <li
                key={item}
                role="option"
                aria-selected="false"
                data-part="option"
                onMouseDown={(event) => {
                  event.preventDefault()
                  setQuery(item)
                  setItems([])
                  onSelect?.(item)
                }}
              >
                {highlight(item, query.trim())}
              </li>
            ))}
          </ul>
        ) : null}
        <span data-part="status" role="status">
          {loading
            ? (statusText.loading ?? STATUS_TEXT.loading)
            : empty
              ? (statusText.empty ?? STATUS_TEXT.empty)
              : (statusText.idle ?? STATUS_TEXT.idle)}
        </span>
      </div>
    </>
  )
}
