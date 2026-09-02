"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Autocomplete006Item = {
  title: string
  meta: string
  price: string
  stock?: number
}

export type Autocomplete006Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  items?: Autocomplete006Item[]
  defaultQuery?: string
  /** Остаток на складе. {count} — число штук. */
  stockText?: string
  /** Подпись нулевого остатка. */
  outOfStockLabel?: string
  /** Строка вместо списка, когда ничего не нашлось. */
  emptyLabel?: string
  onSelect?: (title: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: подсказка не строкой, а карточкой товара. Складской поиск
// по одному названию бесполезен: «кабель» найдётся сорок раз, выбирают по
// артикулу, цене и остатку. Поэтому строка держит три поля, а нулевой остаток
// подсвечен — его нельзя продать, но можно заказать.
const STYLES = `
:where([data-vibeui-block="autocomplete-006"]){
--vibeui-autocomplete-006-bg:transparent;
--vibeui-autocomplete-006-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-006-muted:color-mix(in oklab,var(--vibeui-autocomplete-006-fg) 68%,transparent);
--vibeui-autocomplete-006-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-006-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-autocomplete-006-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-autocomplete-006-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-006-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-006-warn:light-dark(oklch(0.58 0.17 30),oklch(0.75 0.15 30));
--vibeui-autocomplete-006-radius:0.625rem;
--vibeui-autocomplete-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-006"]{
container-type:inline-size;
min-width:min(100%,16rem);
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:24rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-006-bg);
border:1px solid var(--vibeui-autocomplete-006-border);
border-radius:calc(var(--vibeui-autocomplete-006-radius) + 0.25rem);
color:var(--vibeui-autocomplete-006-fg);
font-family:var(--vibeui-autocomplete-006-font);
}
[data-vibeui-block="autocomplete-006"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-006"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-autocomplete-006-border);
border-radius:var(--vibeui-autocomplete-006-radius);
background:var(--vibeui-autocomplete-006-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-006"] input::placeholder{color:var(--vibeui-autocomplete-006-muted)}
[data-vibeui-block="autocomplete-006"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-006-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="autocomplete-006"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:14rem;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-006-border) transparent;
border:1px solid var(--vibeui-autocomplete-006-border);
border-radius:var(--vibeui-autocomplete-006-radius);
background:var(--vibeui-autocomplete-006-panel);
}
/* Строка в две колонки: слева название и артикул, справа цена и остаток. */
[data-vibeui-block="autocomplete-006"] [data-part="option"]{
display:grid;grid-template-columns:1fr auto;align-items:center;gap:0.25rem 0.75rem;
padding:0.4375rem 0.5rem;border-radius:0.4375rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-006"] [data-part="option"]:hover{background:var(--vibeui-autocomplete-006-active)}
[data-vibeui-block="autocomplete-006"] [data-part="title"]{font-size:0.875rem;line-height:1.3}
[data-vibeui-block="autocomplete-006"] [data-part="price"]{font-size:0.875rem;font-weight:650;font-variant-numeric:tabular-nums}
[data-vibeui-block="autocomplete-006"] [data-part="meta"]{grid-column:1;font-size:0.75rem;color:var(--vibeui-autocomplete-006-muted)}
[data-vibeui-block="autocomplete-006"] [data-part="stock"]{grid-column:2;justify-self:end;font-size:0.75rem;color:var(--vibeui-autocomplete-006-muted);font-variant-numeric:tabular-nums}
[data-vibeui-block="autocomplete-006"] [data-part="stock"][data-empty="true"]{color:var(--vibeui-autocomplete-006-warn)}
[data-vibeui-block="autocomplete-006"] [data-part="empty"]{padding:0.75rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-autocomplete-006-muted)}
@container (max-width: 22rem){
[data-vibeui-block="autocomplete-006"] [data-part="option"]{grid-template-columns:1fr}
[data-vibeui-block="autocomplete-006"] [data-part="price"],
[data-vibeui-block="autocomplete-006"] [data-part="stock"]{grid-column:1;justify-self:start}
}
[data-vibeui-block="autocomplete-006"] [data-part="option"] mark{background:transparent;color:var(--vibeui-autocomplete-006-accent);font-weight:650}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-006"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Autocomplete006Item[] = [
  {
    title: "Кабель USB-C / USB-C, 1 м",
    meta: "Артикул 41-208",
    price: "790 ₽",
    stock: 34,
  },
  {
    title: "Кабель USB-C / Lightning, 2 м",
    meta: "Артикул 41-311",
    price: "1 290 ₽",
    stock: 6,
  },
  {
    title: "Кабель HDMI 2.1, 3 м",
    meta: "Артикул 52-104",
    price: "2 450 ₽",
    stock: 0,
  },
  {
    title: "Кабель Ethernet Cat 6, 5 м",
    meta: "Артикул 63-770",
    price: "990 ₽",
    stock: 118,
  },
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
 * Подсказка карточкой: название, артикул, цена и остаток в одной строке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete006({
  label = "Товар",
  placeholder = "Название или артикул",
  items = DEFAULT_ITEMS,
  defaultQuery = "кабель",
  stockText = "{count} шт",
  outOfStockLabel = "нет в наличии",
  emptyLabel = "По запросу ничего не нашлось",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete006Props) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) =>
      `${item.title} ${item.meta}`.toLowerCase().includes(needle),
    )
  }, [items, query])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-autocomplete-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-006"
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
          aria-expanded={matches.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          onChange={(event) => setQuery(event.target.value)}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.map((item) => (
            <li
              key={item.meta}
              role="option"
              aria-selected="false"
              data-part="option"
              onMouseDown={(event) => {
                event.preventDefault()
                setQuery(item.title)
                onSelect?.(item.title)
              }}
            >
              <span data-part="title">{highlight(item.title, query.trim())}</span>
              <span data-part="price">{item.price}</span>
              <span data-part="meta">{item.meta}</span>
              <span data-part="stock" data-empty={item.stock === 0}>
                {item.stock === 0
                  ? outOfStockLabel
                  : stockText.replace("{count}", String(item.stock))}
              </span>
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
