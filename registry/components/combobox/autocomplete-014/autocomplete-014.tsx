"use client"

import { useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Autocomplete014Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  defaultValue?: string[]
  emptyLabel?: string
  clearLabel?: string
  /** Подпись счётчика. {count} — сколько выбрано, {total} — сколько всего. */
  countText?: string
  onChange?: (value: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: множественный выбор списком, а не фишками. Фишки хороши,
// пока выбрано двое-трое: дальше они переносят строку, поле прыгает по высоте,
// и найти уже выбранное глазами трудно. Здесь выбранное остаётся на своих
// местах в списке с галочкой — порядок не меняется, поиск не сбрасывается,
// и видно сразу, что выбрано, а что нет. Список раскрывается курсором в поле и
// не закрывается после выбора: закрытие после каждой галочки — главная беда
// мультивыбора.
const STYLES = `
:where([data-vibeui-block="autocomplete-014"]){
--vibeui-autocomplete-014-bg:transparent;
--vibeui-autocomplete-014-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-autocomplete-014-muted:color-mix(in oklab,var(--vibeui-autocomplete-014-fg) 68%,transparent);
--vibeui-autocomplete-014-border:light-dark(oklch(0.9 0 265),oklch(0.34 0 265));
--vibeui-autocomplete-014-field:light-dark(oklch(0.985 0 265),oklch(0.26 0 265));
--vibeui-autocomplete-014-panel:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-autocomplete-014-active:light-dark(oklch(0.95 0 265),oklch(0.33 0 265));
--vibeui-autocomplete-014-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-autocomplete-014-radius:0.625rem;
--vibeui-autocomplete-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-014"]{
container-type:inline-size;
min-width:min(100%,16rem);
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-014-bg);
border:1px solid var(--vibeui-autocomplete-014-border);
border-radius:calc(var(--vibeui-autocomplete-014-radius) + 0.25rem);
color:var(--vibeui-autocomplete-014-fg);
font-family:var(--vibeui-autocomplete-014-font);
}
[data-vibeui-block="autocomplete-014"] *{box-sizing:border-box}
[data-vibeui-block="autocomplete-014"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-014"] input[type="text"]{
width:100%;height:2.25rem;padding:0 0.625rem;
border:1px solid var(--vibeui-autocomplete-014-border);
border-radius:var(--vibeui-autocomplete-014-radius);
background:var(--vibeui-autocomplete-014-field);color:inherit;
font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-014"] input[type="text"]:focus-visible{
outline:2px solid var(--vibeui-autocomplete-014-accent);outline-offset:1px;
}
[data-vibeui-block="autocomplete-014"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;
max-height:9.5rem;overflow-y:auto;
scrollbar-width:thin;scrollbar-color:var(--vibeui-autocomplete-014-border) transparent;
border:1px solid var(--vibeui-autocomplete-014-border);
border-radius:var(--vibeui-autocomplete-014-radius);
background:var(--vibeui-autocomplete-014-panel);
}
/* Строка целиком — цель нажатия: попадать в саму галочку мышью неудобно, а
   пальцем почти невозможно. */
[data-vibeui-block="autocomplete-014"] [data-part="option"]{
border-radius:0.375rem;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-014"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
min-height:2rem;padding:0 0.5rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-014"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-014-active)}
[data-vibeui-block="autocomplete-014"] [data-part="row"]:focus-within{outline:2px solid var(--vibeui-autocomplete-014-accent);outline-offset:-2px;border-radius:0.375rem}
[data-vibeui-block="autocomplete-014"] [data-part="row"] input{
flex:none;width:0.9375rem;height:0.9375rem;margin:0;
accent-color:var(--vibeui-autocomplete-014-accent);
}
[data-vibeui-block="autocomplete-014"] [data-part="label"]{
min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="autocomplete-014"] [data-part="label"] mark{
background:transparent;color:var(--vibeui-autocomplete-014-accent);font-weight:650;
}
[data-vibeui-block="autocomplete-014"] [data-part="empty"]{
padding:0.75rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-autocomplete-014-muted);
}
[data-vibeui-block="autocomplete-014"] [data-part="footer"]{
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
font-size:0.75rem;color:var(--vibeui-autocomplete-014-muted);
}
[data-vibeui-block="autocomplete-014"] [data-part="clear"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
color:var(--vibeui-autocomplete-014-accent);font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="autocomplete-014"] [data-part="clear"]:disabled{
color:var(--vibeui-autocomplete-014-muted);cursor:not-allowed;
}
[data-vibeui-block="autocomplete-014"] [data-part="clear"]:focus-visible{
outline:2px solid var(--vibeui-autocomplete-014-accent);outline-offset:2px;border-radius:0.25rem;
}
/* В узкой колонке счётчик и сброс встают друг под друга, а не режутся. */
@container (max-width: 17rem){
[data-vibeui-block="autocomplete-014"] [data-part="footer"]{flex-direction:column;align-items:flex-start;gap:0.25rem}
}
:where(.dark,[data-theme="dark"]) [data-vibeui-block="autocomplete-014"]{color-scheme:dark}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Продуктовый дизайн",
  "Фронтенд",
  "Бэкенд",
  "Аналитика",
  "Мобильная разработка",
  "Поддержка",
  "Маркетинг",
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
 * Множественный выбор списком с галочками: выбранное остаётся на месте.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete014({
  label = "Направления",
  placeholder = "Поиск по направлениям",
  options = DEFAULT_OPTIONS,
  defaultValue = ["Фронтенд", "Аналитика"],
  emptyLabel = "Ничего не нашлось",
  clearLabel = "Сбросить",
  countText = "Выбрано {count} из {total}",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete014Props) {
  const id = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>(defaultValue)
  const [active, setActive] = useState(0)
  // Список открывается курсором в поле и закрывается, когда фокус ушёл из
  // компонента целиком: галочки внутри списка фокус не теряют.
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((entry) => entry !== option)
      : [...selected, option]

    setSelected(next)
    onChange?.(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false)
      return
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      setOpen(true)
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      const next =
        matches.length === 0
          ? 0
          : (active + step + matches.length) % matches.length
      setActive(next)
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" })
      return
    }

    // Пробел набирается в поле, поэтому переключает выбор Enter: иначе
    // «продуктовый дизайн» невозможно найти поиском.
    if (event.key === "Enter" && matches[active]) {
      event.preventDefault()
      toggle(matches[active])
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const count = countText
    .replace("{count}", String(selected.length))
    .replace("{total}", String(options.length))

  return (
    <>
      <style href="vibeui-autocomplete-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="autocomplete"
        data-vibeui-block="autocomplete-014"
        className={className}
        style={palette}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setOpen(false)
          }
        }}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
            setOpen(true)
          }}
          onKeyDown={onKeyDown}
        />

        <ul
          ref={listRef}
          id={`${id}-list`}
          data-part="list"
          aria-label={label}
          hidden={!open}
        >
          {matches.map((option, index) => (
            <li
              key={option}
              data-part="option"
              data-active={index === active}
              onMouseEnter={() => setActive(index)}
            >
              {/* Настоящий checkbox, а не div с ролью: он приходит с
                  клавиатурой, состоянием и объявлением для скринридера. */}
              <label data-part="row">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => toggle(option)}
                />
                <span data-part="label">{highlight(option, query.trim())}</span>
              </label>
            </li>
          ))}
          {matches.length === 0 ? (
            <li data-part="empty">{emptyLabel}</li>
          ) : null}
        </ul>

        <div data-part="footer">
          <span role="status">{count}</span>
          <button
            type="button"
            data-part="clear"
            disabled={selected.length === 0}
            onClick={() => {
              setSelected([])
              onChange?.([])
            }}
          >
            {clearLabel}
          </button>
        </div>
      </div>
    </>
  )
}
