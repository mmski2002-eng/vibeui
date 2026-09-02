"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Autocomplete007Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  suggestions?: string[]
  defaultRecent?: string[]
  clearLabel?: string
  /** Подписи панели: ключи recent, suggestions, notFound, history. */
  panelText?: Record<string, string>
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: пустое поле поиска не должно быть пустым экраном. Пока
// запроса нет, показываем недавние запросы самого человека — чаще всего он
// ищет то же, что вчера. Как только он начал печатать, недавние уступают
// место подсказкам: смешивать два разных списка в один — путать источник.
const STYLES = `
:where([data-vibeui-block="autocomplete-007"]){
--vibeui-autocomplete-007-bg:transparent;
--vibeui-autocomplete-007-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-007-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-autocomplete-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-007-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-autocomplete-007-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-autocomplete-007-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-007-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-007-radius:0.625rem;
--vibeui-autocomplete-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-007"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-007-bg);
border:1px solid var(--vibeui-autocomplete-007-border);
border-radius:calc(var(--vibeui-autocomplete-007-radius) + 0.25rem);
color:var(--vibeui-autocomplete-007-fg);
font-family:var(--vibeui-autocomplete-007-font);
}
[data-vibeui-block="autocomplete-007"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-007"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-autocomplete-007-border);
border-radius:var(--vibeui-autocomplete-007-radius);
background:var(--vibeui-autocomplete-007-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-007"] input::placeholder{color:var(--vibeui-autocomplete-007-muted)}
[data-vibeui-block="autocomplete-007"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-007-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="autocomplete-007"] [data-part="panel"]{
border:1px solid var(--vibeui-autocomplete-007-border);
border-radius:var(--vibeui-autocomplete-007-radius);
background:var(--vibeui-autocomplete-007-panel);overflow:hidden;
}
[data-vibeui-block="autocomplete-007"] [data-part="head"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.625rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-autocomplete-007-muted);
}
[data-vibeui-block="autocomplete-007"] [data-part="clear"]{
appearance:none;border:0;background:transparent;cursor:pointer;padding:0.125rem 0.25rem;
border-radius:0.25rem;color:var(--vibeui-autocomplete-007-accent);
font:inherit;font-size:0.6875rem;font-weight:650;letter-spacing:0.02em;text-transform:none;
}
[data-vibeui-block="autocomplete-007"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-autocomplete-007-accent);outline-offset:1px}
[data-vibeui-block="autocomplete-007"] [data-part="list"]{margin:0;padding:0.25rem;list-style:none;max-height:10rem;overflow-y:auto}
[data-vibeui-block="autocomplete-007"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-007"] [data-part="option"]:hover{background:var(--vibeui-autocomplete-007-active)}
/* Часы у недавнего запроса: круг с двумя стрелками, нарисован рамкой. */
[data-vibeui-block="autocomplete-007"] [data-part="clock"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid var(--vibeui-autocomplete-007-muted);border-radius:9999px;
}
[data-vibeui-block="autocomplete-007"] [data-part="clock"]::after{
content:"";position:absolute;left:50%;top:0.125rem;
width:1.5px;height:0.25rem;background:var(--vibeui-autocomplete-007-muted);
margin-left:-0.75px;transform-origin:bottom;
}
[data-vibeui-block="autocomplete-007"] [data-part="empty"]{padding:0.75rem 0.625rem;font-size:0.8125rem;color:var(--vibeui-autocomplete-007-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SUGGESTIONS = [
  "фотоаппарат",
  "фонарь налобный",
  "фильтр для воды",
  "флешка 256 гб",
  "фен дорожный",
]

const DEFAULT_RECENT = ["наушники", "рюкзак 30 л", "кофемолка"]

const PANEL_TEXT = {
  recent: "Недавние запросы",
  suggestions: "Подсказки",
  notFound: "Ничего не нашлось — попробуйте короче",
  history: "История пуста: здесь появятся ваши запросы",
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
 * Поиск с недавними запросами: пустое поле показывает вчерашние.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete007({
  label = "Поиск",
  placeholder = "Что ищете?",
  suggestions = DEFAULT_SUGGESTIONS,
  defaultRecent = DEFAULT_RECENT,
  clearLabel = "Очистить",
  panelText = PANEL_TEXT,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete007Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [recent, setRecent] = useState(defaultRecent)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return suggestions.filter((item) => item.toLowerCase().includes(needle))
  }, [query, suggestions])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const showRecent = !query.trim() && recent.length > 0
  const rows = showRecent ? recent : matches
  const head = showRecent
    ? (panelText.recent ?? PANEL_TEXT.recent)
    : (panelText.suggestions ?? PANEL_TEXT.suggestions)

  const pick = (value: string) => {
    setQuery(value)
    setRecent([value, ...recent.filter((item) => item !== value)].slice(0, 5))
    onSelect?.(value)
  }

  return (
    <>
      <style href="vibeui-autocomplete-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-007"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="search"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          aria-expanded={rows.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div data-part="panel">
          <p data-part="head">
            {head}
            {showRecent ? (
              <button
                type="button"
                data-part="clear"
                onClick={() => setRecent([])}
              >
                {clearLabel}
              </button>
            ) : null}
          </p>
          {rows.length ? (
            <ul
              id={`${id}-list`}
              role="listbox"
              aria-label={head}
              data-part="list"
            >
              {rows.map((row) => (
                <li
                  key={row}
                  role="option"
                  aria-selected="false"
                  data-part="option"
                  onMouseDown={(event) => {
                    event.preventDefault()
                    pick(row)
                  }}
                >
                  {showRecent ? (
                    <span data-part="clock" aria-hidden="true" />
                  ) : null}
                  {row}
                </li>
              ))}
            </ul>
          ) : (
            <p data-part="empty">
              {query.trim()
                ? (panelText.notFound ?? PANEL_TEXT.notFound)
                : (panelText.history ?? PANEL_TEXT.history)}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
