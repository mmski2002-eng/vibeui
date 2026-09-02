"use client"

import { useId, useMemo, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Autocomplete010Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  defaultOptions?: string[]
  defaultQuery?: string
  /** Строка создания. {value} — набранный текст. */
  createLabel?: string
  /** Строка под списком. {count} — сколько меток заведено. */
  hintText?: string
  onChange?: (options: string[]) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: тупик «ничего не нашлось» превращается в действие. Если
// метки нет в списке, последняя строка предлагает завести её прямо здесь —
// иначе человек уходит в настройки, теряет контекст и возвращается не всегда.
// Строка создания — часть списка, а не кнопка сбоку: до неё доезжают стрелки.
const STYLES = `
:where([data-vibeui-block="autocomplete-010"]){
--vibeui-autocomplete-010-bg:transparent;
--vibeui-autocomplete-010-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-010-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-autocomplete-010-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-010-field:light-dark(oklch(0.985 0.002 265),oklch(0.26 0.011 265));
--vibeui-autocomplete-010-panel:light-dark(oklch(1 0 0),oklch(0.24 0.011 265));
--vibeui-autocomplete-010-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-010-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-010-radius:0.625rem;
--vibeui-autocomplete-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-010"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-autocomplete-010-bg);
border:1px solid var(--vibeui-autocomplete-010-border);
border-radius:calc(var(--vibeui-autocomplete-010-radius) + 0.25rem);
color:var(--vibeui-autocomplete-010-fg);
font-family:var(--vibeui-autocomplete-010-font);
}
[data-vibeui-block="autocomplete-010"] label{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="autocomplete-010"] input{
box-sizing:border-box;width:100%;height:2.5rem;padding:0 0.75rem;
border:1px solid var(--vibeui-autocomplete-010-border);
border-radius:var(--vibeui-autocomplete-010-radius);
background:var(--vibeui-autocomplete-010-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="autocomplete-010"] input::placeholder{color:var(--vibeui-autocomplete-010-muted)}
[data-vibeui-block="autocomplete-010"] input:focus-visible{
outline:2px solid var(--vibeui-autocomplete-010-accent);outline-offset:1px;border-color:transparent;
}
[data-vibeui-block="autocomplete-010"] [data-part="list"]{
margin:0;padding:0.25rem;list-style:none;max-height:10rem;overflow-y:auto;
border:1px solid var(--vibeui-autocomplete-010-border);
border-radius:var(--vibeui-autocomplete-010-radius);
background:var(--vibeui-autocomplete-010-panel);
}
[data-vibeui-block="autocomplete-010"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-010"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-010-active)}
/* Строка создания отличается плюсом и цветом: она меняет данные, а не
   выбирает из них. */
[data-vibeui-block="autocomplete-010"] [data-part="create"]{color:var(--vibeui-autocomplete-010-accent);font-weight:600}
[data-vibeui-block="autocomplete-010"] [data-part="plus"]{
position:relative;flex:none;width:0.875rem;height:0.875rem;
border:1px solid currentColor;border-radius:0.25rem;
}
[data-vibeui-block="autocomplete-010"] [data-part="plus"]::before,
[data-vibeui-block="autocomplete-010"] [data-part="plus"]::after{
content:"";position:absolute;left:50%;top:50%;background:currentColor;
}
[data-vibeui-block="autocomplete-010"] [data-part="plus"]::before{width:0.4375rem;height:1px;margin:-0.5px 0 0 -0.21875rem}
[data-vibeui-block="autocomplete-010"] [data-part="plus"]::after{width:1px;height:0.4375rem;margin:-0.21875rem 0 0 -0.5px}
[data-vibeui-block="autocomplete-010"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-autocomplete-010-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = ["Срочно", "Баг", "Дизайн", "Документация", "Идея"]

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
 * Автодополнение с созданием: пустой результат предлагает завести метку.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete010({
  label = "Метка",
  placeholder = "Найти или создать",
  defaultOptions = DEFAULT_OPTIONS,
  defaultQuery = "рефакт",
  createLabel = "Создать «{value}»",
  hintText = "Меток: {count}. Enter выбирает строку под курсором",
  onChange,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete010Props) {
  const id = useId()
  const [options, setOptions] = useState(defaultOptions)
  const [query, setQuery] = useState(defaultQuery)
  const [active, setActive] = useState(0)

  const trimmed = query.trim()
  const matches = useMemo(() => {
    if (!trimmed) return options
    return options.filter((option) =>
      option.toLowerCase().includes(trimmed.toLowerCase()),
    )
  }, [options, trimmed])

  const exact = options.some(
    (option) => option.toLowerCase() === trimmed.toLowerCase(),
  )
  const canCreate = Boolean(trimmed) && !exact
  const rows = canCreate ? matches.length + 1 : matches.length

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const create = () => {
    const next = [...options, trimmed]
    setOptions(next)
    setQuery(trimmed)
    setActive(0)
    onChange?.(next)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!rows) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((active + 1) % rows)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((active - 1 + rows) % rows)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (canCreate && active === matches.length) create()
      else if (matches[active]) setQuery(matches[active])
    }
  }

  return (
    <>
      <style href="vibeui-autocomplete-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-010"
        className={className}
        style={palette}
      >
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          aria-expanded={rows > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
        />
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          data-part="list"
        >
          {matches.map((option, index) => (
            <li
              key={option}
              role="option"
              data-part="option"
              data-active={index === active}
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => {
                event.preventDefault()
                setQuery(option)
              }}
            >
              {option}
            </li>
          ))}
          {canCreate ? (
            <li
              role="option"
              data-part="option"
              data-create="true"
              data-active={active === matches.length}
              aria-selected={active === matches.length}
              onMouseEnter={() => setActive(matches.length)}
              onMouseDown={(event) => {
                event.preventDefault()
                create()
              }}
            >
              <span data-part="plus" aria-hidden="true" />
              <span data-part="create">
                {createLabel.replace("{value}", trimmed)}
              </span>
            </li>
          ) : null}
        </ul>
        <span data-part="hint">
          {hintText.replace("{count}", String(options.length))}
        </span>
      </div>
    </>
  )
}
