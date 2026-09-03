"use client"

import { useMemo, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Filters006Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange" | "defaultChecked"
> & {
  title?: string
  placeholder?: string
  values?: string[]
  /** Отмеченные значения на старте. */
  defaultChecked?: string[]
  onChange?: (checked: string[]) => void
  /** Подписи: компонент несёт русские, проект подставляет свои. */
  labels?: Record<string, string>
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поиск внутри одного фильтра. Список брендов или городов
// длиной в двести строк не пролистывают — в нём ищут. Поиск не перерисовывает
// выдачу, а только сужает сам список значений, и уже отмеченные пункты
// остаются наверху, даже если не подходят под запрос: иначе галочка исчезает
// с экрана и кажется снятой.
const STYLES = `
:where([data-vibeui-block="filters-006"]){
--vibeui-filters-006-surface:transparent;
--vibeui-filters-006-box:light-dark(oklch(1 0 0),oklch(0.27 0.012 265));
--vibeui-filters-006-fill:light-dark(oklch(0.975 0.004 265),oklch(0.3 0.012 265));
--vibeui-filters-006-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.005 265));
--vibeui-filters-006-muted:color-mix(in oklab,var(--vibeui-filters-006-fg) 68%,transparent);
--vibeui-filters-006-border:light-dark(oklch(0.89 0.008 265),oklch(0.4 0.014 265));
--vibeui-filters-006-shell:light-dark(oklch(0.91 0.006 265),oklch(0.36 0.012 265));
--vibeui-filters-006-accent:light-dark(oklch(0.53 0.18 30),oklch(0.76 0.15 30));
--vibeui-filters-006-on-accent:light-dark(oklch(1 0 0),oklch(0.2 0.03 30));
--vibeui-filters-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="filters-006"]{color-scheme:dark}
/* Подложки по умолчанию нет: фильтр ложится на фон страницы. */
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
border:1.5px solid var(--vibeui-filters-006-border);background:var(--vibeui-filters-006-box);
transition:background-color .16s ease,border-color .16s ease;
}
[data-vibeui-block="filters-006"] input[type="checkbox"]:checked{
background:var(--vibeui-filters-006-accent);border-color:var(--vibeui-filters-006-accent);
}
[data-vibeui-block="filters-006"] input[type="checkbox"]:checked::after{
content:"";position:absolute;left:0.3125rem;top:0.0625rem;
width:0.25rem;height:0.5rem;transform:rotate(42deg);
border-right:2px solid var(--vibeui-filters-006-on-accent);
border-bottom:2px solid var(--vibeui-filters-006-on-accent);
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

const DEFAULT_CHECKED = ["Казань"]

/** Русский словарь по умолчанию: установленный файл не меняет язык проекта. */
const DEFAULT_LABELS: Record<string, string> = {
  search: "{title}: поиск по значениям",
  empty: "Ничего не нашлось. Проверьте написание.",
  count: "Показано {shown} из {total} · выбрано {checked}",
}

function label(
  labels: Record<string, string>,
  key: string,
  values?: Record<string, string>,
): string {
  const template = labels[key] ?? DEFAULT_LABELS[key] ?? ""

  if (!values) {
    return template
  }

  return template.replace(
    /\{(\w+)\}/g,
    (match, name: string) => values[name] ?? match,
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
 * Фильтр с поиском по значениям: отмеченное закреплено сверху списка.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Filters006({
  title = "Город",
  placeholder = "Найти город",
  values = DEFAULT_VALUES,
  defaultChecked = DEFAULT_CHECKED,
  onChange,
  labels = DEFAULT_LABELS,
  background = "",
  accent,
  className,
  style,
  ...props
}: Filters006Props) {
  const [query, setQuery] = useState("")
  const [checked, setChecked] = useState<string[]>(defaultChecked)

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
    ...(background
      ? {
          "--vibeui-filters-006-surface": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="filters"
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
            aria-label={label(labels, "search", { title })}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        {shown.pinned.length === 0 && shown.rest.length === 0 ? (
          <p data-part="empty">{label(labels, "empty")}</p>
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
          {label(labels, "count", {
            shown: String(shown.matched),
            total: String(values.length),
            checked: String(checked.length),
          })}
        </p>
      </div>
    </>
  )
}
