"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Autocomplete015Entry = {
  title: string
  group: string
  summary: string
  meta?: string
}

export type Autocomplete015Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  placeholder?: string
  entries?: Autocomplete015Entry[]
  defaultQuery?: string
  emptyLabel?: string
  hintText?: string
  onSelect?: (title: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: поиск с превью справа. Список названий отвечает «нашлось
// семь штук», но не отвечает «то ли это»: выбирать приходится вслепую и
// открывать не туда. Превью показывает выбранное, пока курсор идёт по списку,
// — и решение принимается до перехода. Панель ведёт курсор, а не наведение:
// на клавиатуре мышь не двигается, и превью обязано следовать за стрелками.
// Раскладка считается от ширины самой панели: в узкой колонке превью встаёт
// под список, а не жмёт оба столбца до нечитаемости.
const STYLES = `
:where([data-vibeui-block="autocomplete-015"]){
--vibeui-autocomplete-015-bg:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-autocomplete-015-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-autocomplete-015-muted:color-mix(in oklab,var(--vibeui-autocomplete-015-fg) 68%,transparent);
--vibeui-autocomplete-015-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-015-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-autocomplete-015-active:light-dark(oklch(0.95 0 265),oklch(0.33 0 265));
--vibeui-autocomplete-015-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-autocomplete-015-shadow:light-dark(oklch(0.2 0 265 / 22%),oklch(0 0 0 / 55%));
--vibeui-autocomplete-015-radius:0.75rem;
--vibeui-autocomplete-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-015"]{
container-type:inline-size;
min-width:min(100%,17rem);
display:flex;flex-direction:column;overflow:hidden;
width:100%;max-width:34rem;box-sizing:border-box;
background:var(--vibeui-autocomplete-015-bg);
border:1px solid var(--vibeui-autocomplete-015-border);
border-radius:var(--vibeui-autocomplete-015-radius);
box-shadow:0 18px 40px -24px var(--vibeui-autocomplete-015-shadow);
color:var(--vibeui-autocomplete-015-fg);
font-family:var(--vibeui-autocomplete-015-font);
}
[data-vibeui-block="autocomplete-015"] *{box-sizing:border-box}
[data-vibeui-block="autocomplete-015"] [data-part="search"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.625rem 0.75rem;border-bottom:1px solid var(--vibeui-autocomplete-015-border);
}
/* Лупа нарисована рамкой: иконочный пакет ради одного круга — лишняя
   зависимость, а SVG внутри поля всё равно не кликается. */
[data-vibeui-block="autocomplete-015"] [data-part="glass"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid var(--vibeui-autocomplete-015-muted);border-radius:9999px;
}
[data-vibeui-block="autocomplete-015"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.3125rem;bottom:-0.1875rem;
width:0.375rem;height:1.5px;border-radius:1px;rotate:45deg;
background:var(--vibeui-autocomplete-015-muted);
}
[data-vibeui-block="autocomplete-015"] input{
flex:1;min-width:0;height:1.75rem;padding:0;
border:0;background:none;color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="autocomplete-015"] input:focus-visible{outline:none}
[data-vibeui-block="autocomplete-015"] [data-part="body"]{
display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);
min-height:11rem;
}
[data-vibeui-block="autocomplete-015"] [data-part="list"]{
margin:0;padding:0.375rem;list-style:none;
max-height:14rem;overflow-y:auto;
scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-015-border) transparent;
border-right:1px solid var(--vibeui-autocomplete-015-border);
}
[data-vibeui-block="autocomplete-015"] [data-part="group"]{
padding:0.5rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.04em;text-transform:uppercase;
color:var(--vibeui-autocomplete-015-muted);
}
[data-vibeui-block="autocomplete-015"] [data-part="option"]{
display:flex;align-items:center;min-height:2rem;padding:0 0.5rem;
border-radius:0.5rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-015"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-015-active)}
[data-vibeui-block="autocomplete-015"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="autocomplete-015"] [data-part="label"] mark{
background:transparent;color:var(--vibeui-autocomplete-015-accent);font-weight:650;
}
[data-vibeui-block="autocomplete-015"] [data-part="preview"]{
display:flex;flex-direction:column;gap:0.375rem;
padding:0.875rem;
}
[data-vibeui-block="autocomplete-015"] [data-part="preview-title"]{
margin:0;font-size:0.9375rem;font-weight:650;line-height:1.3;
}
[data-vibeui-block="autocomplete-015"] [data-part="preview-meta"]{
font-size:0.75rem;color:var(--vibeui-autocomplete-015-muted);
}
[data-vibeui-block="autocomplete-015"] [data-part="preview-summary"]{
margin:0;font-size:0.8125rem;line-height:1.45;color:var(--vibeui-autocomplete-015-muted);
}
[data-vibeui-block="autocomplete-015"] [data-part="empty"]{
padding:1rem 0.75rem;font-size:0.875rem;color:var(--vibeui-autocomplete-015-muted);
}
[data-vibeui-block="autocomplete-015"] [data-part="hint"]{
padding:0.5rem 0.75rem;border-top:1px solid var(--vibeui-autocomplete-015-border);
font-size:0.75rem;color:var(--vibeui-autocomplete-015-muted);
}
/* Узкая колонка: превью под списком, иначе оба столбца режут слова. */
@container (max-width: 26rem){
[data-vibeui-block="autocomplete-015"] [data-part="body"]{grid-template-columns:minmax(0,1fr)}
[data-vibeui-block="autocomplete-015"] [data-part="list"]{
border-right:0;border-bottom:1px solid var(--vibeui-autocomplete-015-border);max-height:9rem;
}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-015"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Autocomplete015Entry[] = [
  {
    title: "Отчёт по выручке",
    group: "Документы",
    summary:
      "Сводка за квартал: выручка по каналам, средний чек и доля повторных покупок.",
    meta: "Обновлён вчера · Мария Гурова",
  },
  {
    title: "Отгрузки за неделю",
    group: "Документы",
    summary:
      "Что уехало со склада: маршруты, задержки и товары, которых не хватило.",
    meta: "Обновлён 3 апреля · Марк Ильин",
  },
  {
    title: "Отдел поддержки",
    group: "Команды",
    summary:
      "Двенадцать человек, дежурство по будням с девяти до девяти, ответ в среднем за час.",
    meta: "12 участников",
  },
  {
    title: "Отпуска и замены",
    group: "Команды",
    summary:
      "Кто в отпуске в ближайший месяц и кто закрывает его задачи на это время.",
    meta: "Обновлён сегодня",
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
 * Поиск с превью: список слева, карточка выбранного справа.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete015({
  placeholder = "Поиск по документам и командам",
  entries = DEFAULT_ENTRIES,
  defaultQuery = "",
  emptyLabel = "Ничего не нашлось",
  hintText = "↑ ↓ ведут по списку, Enter открывает",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete015Props) {
  const id = useId()
  const [query, setQuery] = useState(defaultQuery)
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()

    if (!needle) {
      return entries
    }

    return entries.filter((entry) =>
      `${entry.title} ${entry.summary}`.toLowerCase().includes(needle),
    )
  }, [entries, query])

  const current = matches[Math.min(active, matches.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) =>
        matches.length === 0
          ? 0
          : (index + step + matches.length) % matches.length,
      )
      return
    }

    if (event.key === "Enter" && current) {
      event.preventDefault()
      onSelect?.(current.title)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  // Заголовок раздела печатается один раз на группу: список идёт в порядке
  // совпадений, и повторять «Документы» перед каждой строкой незачем.
  const headings = matches.map((entry, index) =>
    index === 0 || matches[index - 1].group !== entry.group
      ? entry.group
      : null,
  )

  return (
    <>
      <style href="vibeui-autocomplete-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-015"
        className={className}
        style={palette}
      >
        <div data-part="search">
          <span data-part="glass" aria-hidden="true" />
          <input
            id={id}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={
              current ? `${id}-option-${matches.indexOf(current)}` : undefined
            }
            aria-label={placeholder}
            placeholder={placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
        </div>

        <div data-part="body">
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label={placeholder}
            data-part="list"
          >
            {matches.map((entry, index) => {
              const heading = headings[index]

              return (
                <li key={entry.title} role="presentation">
                  {heading ? (
                    <div data-part="group" role="presentation">
                      {heading}
                    </div>
                  ) : null}
                  <div
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={entry === current}
                    data-part="option"
                    data-active={entry === current}
                    onMouseEnter={() => setActive(index)}
                    onMouseDown={(event) => {
                      event.preventDefault()
                      onSelect?.(entry.title)
                    }}
                  >
                    <span data-part="label">
                      {highlight(entry.title, query.trim())}
                    </span>
                  </div>
                </li>
              )
            })}
            {matches.length === 0 ? (
              <li data-part="empty" role="presentation">
                {emptyLabel}
              </li>
            ) : null}
          </ul>

          {/* Превью читается вслух при смене курсора: на клавиатуре человек
              не видит правую панель, если она молчит. */}
          <div data-part="preview" aria-live="polite">
            {current ? (
              <>
                <h3 data-part="preview-title">{current.title}</h3>
                {current.meta ? (
                  <span data-part="preview-meta">{current.meta}</span>
                ) : null}
                <p data-part="preview-summary">{current.summary}</p>
              </>
            ) : (
              <p data-part="preview-summary">{emptyLabel}</p>
            )}
          </div>
        </div>

        <div data-part="hint">{hintText}</div>
      </div>
    </>
  )
}
