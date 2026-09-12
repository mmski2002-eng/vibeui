"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Combobox001Props = Omit<
  ComponentProps<"div">,
  "children" | "onSelect"
> & {
  label?: string
  placeholder?: string
  searchPlaceholder?: string
  options?: string[]
  emptyLabel?: string
  /** Подпись фильтра для скринридера. {label} — подпись поля. */
  filterLabel?: string
  defaultValue?: string
  defaultOpen?: boolean
  onSelect?: (value: string) => void
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: это выбор из известного списка, а не свободный ввод.
// Значение живёт на кнопке-триггере, а поле внутри панели только фильтрует
// и никогда не становится значением: закрытие по Escape возвращает фокус на
// кнопку и стирает фильтр, поэтому «полунабранный» текст не утекает в форму.
const STYLES = `
:where([data-vibeui-block="combobox-001"]){
--vibeui-combobox-001-bg:transparent;
--vibeui-combobox-001-panel:light-dark(oklch(1 0 0),oklch(0.26 0 265));
--vibeui-combobox-001-fg:light-dark(oklch(0.22 0 265),oklch(0.94 0 265));
--vibeui-combobox-001-muted:color-mix(in oklab,var(--vibeui-combobox-001-fg) 68%,transparent);
--vibeui-combobox-001-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-combobox-001-field:light-dark(oklch(0.985 0 265),oklch(0.3 0 265));
--vibeui-combobox-001-active:light-dark(oklch(0.955 0 265),oklch(0.36 0 265));
--vibeui-combobox-001-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-combobox-001-radius:0.625rem;
--vibeui-combobox-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="combobox-001"]{color-scheme:dark}
[data-vibeui-block="combobox-001"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-combobox-001-bg);
border:1px solid var(--vibeui-combobox-001-border);
border-radius:calc(var(--vibeui-combobox-001-radius) + 0.25rem);
color:var(--vibeui-combobox-001-fg);
font-family:var(--vibeui-combobox-001-font);
}
[data-vibeui-block="combobox-001"] [data-part="label"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="combobox-001"] [data-part="trigger"]{
box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
width:100%;height:2.5rem;padding:0 0.75rem;cursor:pointer;text-align:left;
border:1px solid var(--vibeui-combobox-001-border);
border-radius:var(--vibeui-combobox-001-radius);
background:var(--vibeui-combobox-001-field);
color:inherit;font:inherit;font-size:0.875rem;
transition:border-color .16s ease;
}
[data-vibeui-block="combobox-001"] [data-part="trigger"]:hover{border-color:var(--vibeui-combobox-001-accent)}
[data-vibeui-block="combobox-001"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-combobox-001-accent);outline-offset:1px}
[data-vibeui-block="combobox-001"] [data-part="trigger"][data-empty="true"]{color:var(--vibeui-combobox-001-muted)}
[data-vibeui-block="combobox-001"] [data-part="chevron"]{
width:0.45rem;height:0.45rem;flex:none;margin-bottom:0.15rem;
border-right:1.5px solid var(--vibeui-combobox-001-muted);
border-bottom:1.5px solid var(--vibeui-combobox-001-muted);
transform:rotate(45deg);transition:transform .16s ease;
}
[data-vibeui-block="combobox-001"] [data-part="trigger"][aria-expanded="true"] [data-part="chevron"]{transform:rotate(-135deg);margin-bottom:-0.15rem}
/* Панель в потоке, а не поверх: в карточке каталога и в узкой колонке
   всплывающий слой нечем позиционировать без замера. */
[data-vibeui-block="combobox-001"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.25rem;padding:0.375rem;
border:1px solid var(--vibeui-combobox-001-border);
border-radius:var(--vibeui-combobox-001-radius);
background:var(--vibeui-combobox-001-panel);
}
[data-vibeui-block="combobox-001"] input{
box-sizing:border-box;width:100%;height:2.125rem;padding:0 0.625rem;
border:1px solid var(--vibeui-combobox-001-border);
border-radius:0.5rem;background:var(--vibeui-combobox-001-field);
color:inherit;font:inherit;font-size:0.875rem;
}
[data-vibeui-block="combobox-001"] input:focus-visible{outline:2px solid var(--vibeui-combobox-001-accent);outline-offset:1px;border-color:transparent}
[data-vibeui-block="combobox-001"] [data-part="list"]{
margin:0;padding:0;list-style:none;max-height:9.5rem;overflow-y:auto;
}
[data-vibeui-block="combobox-001"] [data-part="option"]{
display:flex;align-items:center;gap:0.5rem;min-height:2rem;padding:0 0.5rem;
border-radius:0.375rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="combobox-001"] [data-part="option"][data-active="true"]{background:var(--vibeui-combobox-001-active)}
[data-vibeui-block="combobox-001"] [data-part="check"]{
width:0.85rem;flex:none;color:var(--vibeui-combobox-001-accent);font-weight:700;
}
[data-vibeui-block="combobox-001"] [data-part="empty"]{padding:0.5rem;font-size:0.8125rem;color:var(--vibeui-combobox-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="combobox-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Активен",
  "В работе",
  "На проверке",
  "Отложен",
  "Завершён",
  "Отменён",
  "Черновик",
  "Архив",
]

/**
 * Ветка темы для заданного фона: светлая плашка иначе досталась бы тексту
 * тёмной ветки, потому что light-dark() смотрит на color-scheme, а не на цвет.
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
 * Combobox с фильтром и полной клавиатурой: значение берётся только из
 * списка, фильтр значением не становится.
 */
export function Combobox001({
  label = "Статус задачи",
  placeholder = "Выберите статус",
  searchPlaceholder = "Поиск по списку",
  options = DEFAULT_OPTIONS,
  emptyLabel = "Ничего не нашлось",
  filterLabel = "{label}: фильтр",
  defaultValue = "",
  defaultOpen = false,
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Combobox001Props) {
  const id = useId()
  const [value, setValue] = useState(defaultValue)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(defaultOpen)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options
    return options.filter((option) => option.toLowerCase().includes(needle))
  }, [options, query])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const palette = {
    ...(accent ? { "--vibeui-combobox-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-combobox-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const close = (returnFocus: boolean) => {
    setOpen(false)
    setQuery("")
    if (returnFocus) triggerRef.current?.focus()
  }

  const commit = (option: string) => {
    setValue(option)
    onSelect?.(option)
    close(true)
  }

  const move = (next: number) => {
    if (!matches.length) return
    const index = (next + matches.length) % matches.length
    setActive(index)
    listRef.current?.children[index]?.scrollIntoView({ block: "nearest" })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      move(active + 1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      move(active - 1)
    } else if (event.key === "Home") {
      event.preventDefault()
      move(0)
    } else if (event.key === "End") {
      event.preventDefault()
      move(matches.length - 1)
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (matches[active]) commit(matches[active])
    } else if (event.key === "Escape") {
      event.preventDefault()
      close(true)
    }
  }

  return (
    <>
      <style href="vibeui-combobox-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="combobox"
        data-vibeui-block="combobox-001"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <button
          ref={triggerRef}
          type="button"
          data-part="trigger"
          data-empty={value === ""}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label ${id}-trigger`}
          id={`${id}-trigger`}
          onClick={() => {
            setActive(Math.max(0, options.indexOf(value)))
            setOpen((previous) => !previous)
          }}
        >
          {value || placeholder}
          <span data-part="chevron" aria-hidden="true" />
        </button>
        {open ? (
          <div data-part="panel">
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              autoComplete="off"
              placeholder={searchPlaceholder}
              aria-label={filterLabel.replace("{label}", label)}
              aria-expanded="true"
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              aria-activedescendant={
                matches[active] ? `${id}-option-${active}` : undefined
              }
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={onKeyDown}
            />
            <ul
              ref={listRef}
              id={`${id}-list`}
              role="listbox"
              aria-label={label}
              data-part="list"
            >
              {matches.map((option, index) => (
                <li
                  key={option}
                  id={`${id}-option-${index}`}
                  role="option"
                  data-part="option"
                  data-active={index === active}
                  aria-selected={option === value}
                  onMouseEnter={() => setActive(index)}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    commit(option)
                  }}
                >
                  <span data-part="check" aria-hidden="true">
                    {option === value ? "✓" : ""}
                  </span>
                  {option}
                </li>
              ))}
              {matches.length === 0 ? (
                <li data-part="empty" role="presentation">
                  {emptyLabel}
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>
    </>
  )
}
