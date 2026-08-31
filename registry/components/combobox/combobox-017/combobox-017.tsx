"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Combobox017Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultFavourites?: string[]
  defaultValue?: string
  onSelect?: (value: string) => void
  accent?: string
}

// Идея компонента: в списке из сотни счетов человек каждый день выбирает
// три. Поэтому у каждой строки есть звёздочка, а отмеченные строки живут
// в закреплённой группе сверху и не уезжают при вводе запроса. Звёздочка —
// отдельная кнопка рядом с вариантом, а не внутри него: нажатие на звезду
// не должно выбирать значение.
const STYLES = `
:where([data-vibeui-block="combobox-017"]){
--vibeui-combobox-017-bg:oklch(1 0 0);
--vibeui-combobox-017-fg:oklch(0.22 0.014 60);
--vibeui-combobox-017-muted:oklch(0.55 0.014 60);
--vibeui-combobox-017-border:oklch(0.9 0.008 60);
--vibeui-combobox-017-field:oklch(0.985 0.004 60);
--vibeui-combobox-017-soft:oklch(0.96 0.008 60);
--vibeui-combobox-017-accent:oklch(0.55 0.13 60);
--vibeui-combobox-017-accentsoft:oklch(0.94 0.05 60);
--vibeui-combobox-017-star:oklch(0.72 0.16 75);
--vibeui-combobox-017-radius:0.625rem;
--vibeui-combobox-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="combobox-017"]{
display:flex;flex-direction:column;gap:0.4rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-017-bg);
border:1px solid var(--vibeui-combobox-017-border);
border-radius:calc(var(--vibeui-combobox-017-radius) + 0.25rem);
color:var(--vibeui-combobox-017-fg);
font-family:var(--vibeui-combobox-017-font);
}
[data-vibeui-block="combobox-017"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-017"] input{
box-sizing:border-box;width:100%;height:2.4rem;padding:0 0.6rem;
border:1px solid var(--vibeui-combobox-017-border);
border-radius:var(--vibeui-combobox-017-radius);
background:var(--vibeui-combobox-017-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-017"] input::placeholder{color:var(--vibeui-combobox-017-muted)}
[data-vibeui-block="combobox-017"] input:focus-visible{
outline:2px solid var(--vibeui-combobox-017-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="combobox-017"] [data-part="list"]{
margin:0;padding:0.2rem;list-style:none;
max-height:13.5rem;overflow:auto;
border:1px solid var(--vibeui-combobox-017-border);
border-radius:var(--vibeui-combobox-017-radius);
}
[data-vibeui-block="combobox-017"] [data-part="caption"]{
display:block;padding:0.35rem 0.5rem 0.2rem;
font-size:0.65rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-combobox-017-muted);
}
[data-vibeui-block="combobox-017"] [data-part="pinned"]{
border-bottom:1px solid var(--vibeui-combobox-017-border);
margin-bottom:0.2rem;padding-bottom:0.2rem;
}
[data-vibeui-block="combobox-017"] [data-part="row"]{
display:flex;align-items:center;gap:0.15rem;
}
[data-vibeui-block="combobox-017"] [data-part="option"]{
appearance:none;cursor:pointer;font:inherit;flex:1 1 auto;min-width:0;
box-sizing:border-box;padding:0.4rem 0.5rem;
border:0;border-radius:0.45rem;background:transparent;color:inherit;text-align:left;
font-size:0.8125rem;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
transition:background-color .16s ease;
}
[data-vibeui-block="combobox-017"] [data-part="option"]:hover{background:var(--vibeui-combobox-017-soft)}
[data-vibeui-block="combobox-017"] [data-part="option"]:focus-visible{
outline:2px solid var(--vibeui-combobox-017-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-017"] [data-part="option"][aria-selected="true"]{
background:var(--vibeui-combobox-017-accentsoft);font-weight:600;
}
[data-vibeui-block="combobox-017"] [data-part="star"]{
appearance:none;cursor:pointer;font:inherit;flex:none;
width:1.75rem;height:1.75rem;border:0;border-radius:0.4rem;
background:transparent;color:var(--vibeui-combobox-017-border);
font-size:0.9rem;line-height:1;
transition:color .16s ease,background-color .16s ease;
}
[data-vibeui-block="combobox-017"] [data-part="star"]:hover{background:var(--vibeui-combobox-017-soft)}
[data-vibeui-block="combobox-017"] [data-part="star"]:focus-visible{
outline:2px solid var(--vibeui-combobox-017-accent);outline-offset:-2px;
}
[data-vibeui-block="combobox-017"] [data-part="star"][aria-pressed="true"]{color:var(--vibeui-combobox-017-star)}
[data-vibeui-block="combobox-017"] [data-part="empty"]{
margin:0;padding:0.6rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-017-muted);
}
[data-vibeui-block="combobox-017"] [data-part="foot"]{
margin:0;font-size:0.78rem;color:var(--vibeui-combobox-017-muted);
}
[data-vibeui-block="combobox-017"] [data-part="foot"] b{color:var(--vibeui-combobox-017-fg)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-017"] *{animation:none!important;transition:none!important}}
`

const ACCOUNTS = [
  "Расчётный счёт · Сбербанк",
  "Расчётный счёт · Т-Банк",
  "Валютный счёт · USD",
  "Валютный счёт · EUR",
  "Депозит 12 месяцев",
  "Эквайринг · маркетплейс",
  "Эквайринг · сайт",
  "Касса магазина на Лесной",
]

/**
 * Выбор с закреплёнными избранными: звёздочка поднимает вариант наверх.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Combobox017({
  label = "Счёт списания",
  placeholder = "Найти счёт",
  options = ACCOUNTS,
  defaultFavourites = ["Расчётный счёт · Т-Банк", "Эквайринг · сайт"],
  defaultValue = "Расчётный счёт · Т-Банк",
  onSelect,
  accent,
  className,
  style,
  ...props
}: Combobox017Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)
  const [favourites, setFavourites] = useState(defaultFavourites)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [query, options])

  const pinned = matches.filter((option) => favourites.includes(option))
  const rest = matches.filter((option) => !favourites.includes(option))

  const star = (option: string) => {
    setFavourites(
      favourites.includes(option)
        ? favourites.filter((entry) => entry !== option)
        : [...favourites, option],
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-combobox-017-accent": accent } : null),
    ...style,
  } as CSSProperties

  const render = (option: string) => (
    <li key={option} role="none">
      <span data-part="row" role="none">
        <button
          type="button"
          role="option"
          data-part="option"
          aria-selected={option === value}
          title={option}
          onClick={() => {
            setValue(option)
            onSelect?.(option)
          }}
        >
          {option}
        </button>
        <button
          type="button"
          data-part="star"
          aria-pressed={favourites.includes(option)}
          aria-label={
            favourites.includes(option)
              ? `Убрать «${option}» из избранного`
              : `Добавить «${option}» в избранное`
          }
          onClick={() => star(option)}
        >
          <span aria-hidden="true">★</span>
        </button>
      </span>
    </li>
  )

  return (
    <>
      <style href="vibeui-combobox-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="combobox-017"
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
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {pinned.length > 0 ? (
            <li role="none" data-part="pinned">
              <span data-part="caption">Избранное</span>
              <ul role="none">{pinned.map(render)}</ul>
            </li>
          ) : null}
          {rest.length > 0 ? (
            <li role="none">
              <span data-part="caption">Все счета</span>
              <ul role="none">{rest.map(render)}</ul>
            </li>
          ) : null}
          {matches.length === 0 ? (
            <li role="none">
              <p data-part="empty">Счёт не найден</p>
            </li>
          ) : null}
        </ul>
        <p data-part="foot" aria-live="polite">
          Списываем со счёта: <b>{value || "не выбран"}</b>
        </p>
      </div>
    </>
  )
}
