"use client"

import { useMemo, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Filters006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  title?: string
  placeholder?: string
  values?: string[]
  onChange?: (checked: string[]) => void
  accent?: string
}

// Идея компонента: поиск внутри одного фильтра. Список брендов или городов
// длиной в двести строк не пролистывают — в нём ищут. Поиск не перерисовывает
// выдачу, а только сужает сам список значений, и уже отмеченные пункты
// остаются наверху, даже если не подходят под запрос: иначе галочка исчезает
// с экрана и кажется снятой.
const STYLES = `
:where([data-vibeui-block="filters-006"]){
--vibeui-filters-006-surface:oklch(1 0 0);
--vibeui-filters-006-fill:oklch(0.975 0.004 265);
--vibeui-filters-006-fg:oklch(0.23 0.014 265);
--vibeui-filters-006-muted:oklch(0.55 0.014 265);
--vibeui-filters-006-border:oklch(0.89 0.008 265);
--vibeui-filters-006-shell:oklch(0.91 0.006 265);
--vibeui-filters-006-accent:oklch(0.53 0.18 30);
--vibeui-filters-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Своя светлая подложка: фильтр показывают поверх любого фона. */
[data-vibeui-block="filters-006"]{
display:flex;flex-direction:column;gap:0.5rem;
width:100%;max-width:17rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-filters-006-surface);
border:1px solid var(--vibeui-filters-006-shell);border-radius:0.875rem;
font-family:var(--vibeui-filters-006-font);color:var(--vibeui-filters-006-fg);
}
[data-vibeui-block="filters-006"] *{box-sizing:border-box}
[data-vibeui-block="filters-006"] h3{margin:0;font-size:0.8125rem;font-weight:650}
[data-vibeui-block="filters-006"] [data-part="search"]{
display:flex;align-items:center;gap:0.375rem;
height:2.125rem;padding:0 0.5rem;
background:var(--vibeui-filters-006-fill);
border:1px solid var(--vibeui-filters-006-border);border-radius:0.5rem;
transition:border-color .16s ease;
}
[data-vibeui-block="filters-006"] [data-part="search"]:focus-within{border-color:var(--vibeui-filters-006-accent)}
/* Лупа из круга и палочки: иконочная библиотека не нужна. */
[data-vibeui-block="filters-006"] [data-part="lens"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid var(--vibeui-filters-006-muted);border-radius:9999px;
}
[data-vibeui-block="filters-006"] [data-part="lens"]::after{
content:"";position:absolute;right:-0.25rem;bottom:-0.1875rem;
width:0.3125rem;height:1.5px;border-radius:9999px;
background:var(--vibeui-filters-006-muted);transform:rotate(45deg);
}
[data-vibeui-block="filters-006"] input[type="search"]{
flex:1;min-width:0;border:0;background:none;color:inherit;padding:0;
font:inherit;font-size:0.8125rem;appearance:none;
}
[data-vibeui-block="filters-006"] input[type="search"]:focus{outline:none}
[data-vibeui-block="filters-006"] input[type="search"]::-webkit-search-cancel-button{appearance:none}
[data-vibeui-block="filters-006"] input[type="search"]::placeholder{color:var(--vibeui-filters-006-muted)}
[data-vibeui-block="filters-006"] ul{
display:flex;flex-direction:column;gap:0.0625rem;
margin:0;padding:0;list-style:none;
max-height:11rem;overflow-y:auto;
}
[data-vibeui-block="filters-006"] label{
display:flex;align-items:center;gap:0.5rem;cursor:pointer;
padding:0.25rem 0.125rem;font-size:0.8125rem;
}
[data-vibeui-block="filters-006"] input[type="checkbox"]{
appearance:none;flex:none;margin:0;cursor:pointer;position:relative;
width:1rem;height:1rem;border-radius:0.3125rem;
border:1.5px solid var(--vibeui-filters-006-border);background:oklch(1 0 0);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="filters-006"] input[type="checkbox"]:checked{
background:var(--vibeui-filters-006-accent);border-color:var(--vibeui-filters-006-accent);
}
[data-vibeui-block="filters-006"] input[type="checkbox"]:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.0625rem;
width:0.25rem;height:0.5rem;transform:rotate(42deg);
border-right:2px solid oklch(1 0 0);border-bottom:2px solid oklch(1 0 0);
}
[data-vibeui-block="filters-006"] input[type="checkbox"]:focus-visible{outline:2px solid var(--vibeui-filters-006-accent);outline-offset:2px}
/* Отмеченное всегда на виду: пропавшая галочка читается как снятая. */
[data-vibeui-block="filters-006"] li[data-pinned="true"]{
border-bottom:1px solid var(--vibeui-filters-006-border);
padding-bottom:0.125rem;margin-bottom:0.125rem;
}
[data-vibeui-block="filters-006"] [data-part="count"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-filters-006-muted);
font-variant-numeric:tabular-nums;
}
[data-vibeui-block="filters-006"] [data-part="empty"]{
margin:0;padding:0.5rem 0;font-size:0.8125rem;color:var(--vibeui-filters-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="filters-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_VALUES = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Уфа",
  "Ростов-на-Дону",
  "Краснодар",
  "Пермь",
]

/**
 * Фильтр с поиском по значениям: отмеченное закреплено сверху списка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters006({
  title = "Город",
  placeholder = "Найти город",
  values = DEFAULT_VALUES,
  onChange,
  accent,
  className,
  style,
  ...props
}: Filters006Props) {
  const [query, setQuery] = useState("")
  const [checked, setChecked] = useState<string[]>(["Казань"])

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const matched = needle
      ? values.filter((value) => value.toLowerCase().includes(needle))
      : values

    // Отмеченные всегда наверху и всегда видимы, даже мимо запроса.
    const pinned = values.filter((value) => checked.includes(value))
    const rest = matched.filter((value) => !checked.includes(value))

    return { pinned, rest, matched: matched.length }
  }, [query, values, checked])

  const palette = {
    ...(accent ? { "--vibeui-filters-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  const toggle = (value: string) => {
    const next = checked.includes(value)
      ? checked.filter((item) => item !== value)
      : [...checked, value]

    setChecked(next)
    onChange?.(next)
  }

  return (
    <>
      <style href="vibeui-filters-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="filters-006"
        className={className}
        style={palette}
      >
        <h3>{title}</h3>

        <div data-part="search">
          <span data-part="lens" aria-hidden="true" />
          <input
            type="search"
            value={query}
            placeholder={placeholder}
            aria-label={`${title}: поиск по значениям`}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {shown.pinned.length === 0 && shown.rest.length === 0 ? (
          <p data-part="empty">Ничего не нашлось. Проверьте написание.</p>
        ) : (
          <ul>
            {shown.pinned.map((value) => (
              <li key={value} data-pinned="true">
                <label>
                  <input
                    type="checkbox"
                    checked
                    onChange={() => toggle(value)}
                  />
                  {value}
                </label>
              </li>
            ))}
            {shown.rest.map((value) => (
              <li key={value}>
                <label>
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggle(value)}
                  />
                  {value}
                </label>
              </li>
            ))}
          </ul>
        )}

        <p data-part="count" role="status">
          Показано {shown.matched} из {values.length} · выбрано {checked.length}
        </p>
      </div>
    </>
  )
}
