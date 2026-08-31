"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Combobox015Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultQuery?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: алфавитный порядок в результатах поиска — это отказ
// от ранжирования. Здесь совпадения сортируются по тому, где нашлась
// подстрока: начало строки важнее начала слова, начало слова важнее
// середины. Найденный кусок подсвечен <mark>, поэтому человек видит,
// за что строка попала в список, и не проверяет её глазами целиком.
const STYLES = `
:where([data-vibeui-block="combobox-015"]){
--vibeui-combobox-015-bg:oklch(1 0 0);
--vibeui-combobox-015-fg:oklch(0.22 0.014 195);
--vibeui-combobox-015-muted:oklch(0.55 0.014 195);
--vibeui-combobox-015-border:oklch(0.9 0.008 195);
--vibeui-combobox-015-field:oklch(0.985 0.004 195);
--vibeui-combobox-015-soft:oklch(0.96 0.008 195);
--vibeui-combobox-015-accent:oklch(0.48 0.11 195);
--vibeui-combobox-015-accentsoft:oklch(0.93 0.05 195);
--vibeui-combobox-015-mark:oklch(0.9 0.11 95);
--vibeui-combobox-015-radius:0.625rem;
--vibeui-combobox-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-015"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-015-bg);
border:1px solid var(--vibeui-combobox-015-border);
border-radius:calc(var(--vibeui-combobox-015-radius) + 0.25rem);
color:var(--vibeui-combobox-015-fg);
font-family:var(--vibeui-combobox-015-font);
}
[data-vibeui-block="combobox-015"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-015"] input{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.6rem;
border:1px solid var(--vibeui-combobox-015-border);
border-radius:var(--vibeui-combobox-015-radius);
background:var(--vibeui-combobox-015-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-015"] input::placeholder{color:var(--vibeui-combobox-015-muted)}
[data-vibeui-block="combobox-015"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-015-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-015"] [data-part="order"]{
margin:0;font-size:0.7rem;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-combobox-015-muted);
}
[data-vibeui-block="combobox-015"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;display:flex;flex-direction:column;gap:0.1rem;
max-height:13rem;overflow:auto;
border:1px solid var(--vibeui-combobox-015-border);
border-radius:var(--vibeui-combobox-015-radius);
}
[data-vibeui-block="combobox-015"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;width:100%;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
font-size:0.8125rem;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-015"] [data-part="option"]:hover{background:var(--vibeui-combobox-015-soft)}
[data-vibeui-block="combobox-015"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-015-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-015"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-015-accentsoft);font-weight:600;
}
[data-vibeui-block="combobox-015"] [data-part="text"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="combobox-015"] mark{
background:var(--vibeui-combobox-015-mark);color:inherit;border-radius:0.15rem;padding:0 0.05em;
}
[data-vibeui-block="combobox-015"] [data-part="rank"]{
flex:none;font-size:0.65rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
color:var(--vibeui-combobox-015-muted);
}
[data-vibeui-block="combobox-015"] [data-part="empty"]{
margin:0;padding:0.6rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-015-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-015"] *{animation:none!important;transition:none!important}}
`

const CITIES = [
  "Нижний Новгород",
  "Новосибирск",
  "Новороссийск",
  "Великий Новгород",
  "Ростов-на-Дону",
  "Новокузнецк",
  "Красноярск",
  "Иваново",
  "Новый Уренгой",
  "Волгоград",
]

const RANKS = ["с начала", "с начала слова", "внутри"]

/** Чем раньше в строке нашлась подстрока, тем выше вес совпадения. */
function scoreOf(text: string, needle: string) {
  const lower = text.toLowerCase()
  const at = lower.indexOf(needle)

  if (at < 0) return { rank: -1, at }
  if (at === 0) return { rank: 0, at }

  return { rank: /[\s-]/.test(lower.charAt(at - 1)) ? 1 : 2, at }
}

/**
 * Поиск с сортировкой по релевантности и подсветкой найденного куска.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox015({
  label = "Город доставки",
  placeholder = "Начните вводить название",
  options = CITIES,
  defaultQuery = "нов",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox015Props) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)
  const [value, setValue] = useState("")

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    if (!needle) {
      return options.map((text) => ({ text, rank: -1, at: -1 }))
    }

    return options
      .map((text) => ({ text, ...scoreOf(text, needle) }))
      .filter((entry) => entry.rank >= 0)
      .sort(
        (left, right) =>
          left.rank - right.rank ||
          left.at - right.at ||
          left.text.localeCompare(right.text),
      )
  }, [query, options])

  const palette = {
    ...(accent ? { "--vibeui-combobox-015-accent": accent } : null),
    ...style,
  } as CSSProperties

  const needle = query.trim()

  return (
    <>
      <style href="vibeui-combobox-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-015"
        className={className}
        style={palette}
      >
        <label htmlFor={`${id}-input`}>{label}</label>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p data-part="order" aria-live="polite">
          {needle
            ? `${matches.length} совпадений, по релевантности`
            : "Все варианты, по алфавиту"}
        </p>
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.length === 0 ? (
            <li role="none">
              <p data-part="empty">Ничего не нашлось</p>
            </li>
          ) : (
            matches.map((entry) => (
              <li key={entry.text} role="none">
                <button
                  type="button"
                  role="option"
                  data-part="option"
                  aria-selected={entry.text === value}
                  onClick={() => {
                    setValue(entry.text)
                    onSelect?.(entry.text)
                  }}
                >
                  <span data-part="text">
                    {entry.at >= 0 ? (
                      <>
                        {entry.text.slice(0, entry.at)}
                        <mark>
                          {entry.text.slice(entry.at, entry.at + needle.length)}
                        </mark>
                        {entry.text.slice(entry.at + needle.length)}
                      </>
                    ) : (
                      entry.text
                    )}
                  </span>
                  {entry.rank >= 0 ? (
                    <span data-part="rank">{RANKS[entry.rank]}</span>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  )
}
