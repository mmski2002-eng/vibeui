"use client"

import { useId, useMemo, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Autocomplete004Command = {
  label: string
  group: string
  hint?: string
}

export type Autocomplete004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onSelect"
> & {
  placeholder?: string
  commands?: Autocomplete004Command[]
  emptyLabel?: string
  /** Имя списка для скринридера. */
  listLabel?: string
  onSelect?: (label: string) => void
  /** Пусто — подложки нет, панель ложится на фон страницы. */
  background?: string
  accent?: string
}

// Идея компонента: строка команд. Она отличается от обычного combobox тем,
// что ищет по всему приложению и группирует результат по разделам — человек
// помнит «где-то в настройках», а не точное название. Заголовки групп
// пропускаются стрелками: остановка на неинтерактивной строке сбивает счёт.
const STYLES = `
:where([data-vibeui-block="autocomplete-004"]){
--vibeui-autocomplete-004-bg:transparent;
--vibeui-autocomplete-004-fg:light-dark(oklch(0.22 0.014 265),oklch(0.94 0.006 265));
--vibeui-autocomplete-004-muted:light-dark(oklch(0.52 0.014 265),oklch(0.7 0.012 265));
--vibeui-autocomplete-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.34 0.012 265));
--vibeui-autocomplete-004-active:light-dark(oklch(0.95 0.02 265),oklch(0.33 0.028 265));
--vibeui-autocomplete-004-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-autocomplete-004-shadow:light-dark(oklch(0.2 0.02 265 / 45%),oklch(0.02 0.01 265 / 70%));
--vibeui-autocomplete-004-radius:0.75rem;
--vibeui-autocomplete-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="autocomplete-004"]{
display:flex;flex-direction:column;
width:100%;max-width:26rem;box-sizing:border-box;overflow:hidden;
background:var(--vibeui-autocomplete-004-bg);
border:1px solid var(--vibeui-autocomplete-004-border);
border-radius:var(--vibeui-autocomplete-004-radius);
box-shadow:0 18px 40px -24px var(--vibeui-autocomplete-004-shadow);
color:var(--vibeui-autocomplete-004-fg);
font-family:var(--vibeui-autocomplete-004-font);
}
[data-vibeui-block="autocomplete-004"] [data-part="search"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.875rem;border-bottom:1px solid var(--vibeui-autocomplete-004-border);
}
/* Лупа нарисована рамкой: ради одной иконки не тянуть пакет. */
[data-vibeui-block="autocomplete-004"] [data-part="glass"]{
position:relative;flex:none;width:0.75rem;height:0.75rem;
border:1.5px solid var(--vibeui-autocomplete-004-muted);border-radius:9999px;
}
[data-vibeui-block="autocomplete-004"] [data-part="glass"]::after{
content:"";position:absolute;right:-0.3125rem;bottom:-0.1875rem;
width:0.375rem;height:1.5px;background:var(--vibeui-autocomplete-004-muted);
transform:rotate(45deg);
}
[data-vibeui-block="autocomplete-004"] input{
flex:1;height:2.75rem;border:0;background:transparent;
color:inherit;font:inherit;font-size:0.9375rem;
}
[data-vibeui-block="autocomplete-004"] input:focus{outline:none}
[data-vibeui-block="autocomplete-004"] input::placeholder{color:var(--vibeui-autocomplete-004-muted)}
[data-vibeui-block="autocomplete-004"] kbd{
flex:none;padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid var(--vibeui-autocomplete-004-border);
font-family:inherit;font-size:0.6875rem;color:var(--vibeui-autocomplete-004-muted);
}
[data-vibeui-block="autocomplete-004"] [data-part="list"]{
margin:0;padding:0.375rem;list-style:none;max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="autocomplete-004"] [data-part="group"]{
padding:0.5rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-autocomplete-004-muted);
}
[data-vibeui-block="autocomplete-004"] [data-part="option"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
min-height:2.25rem;padding:0 0.5rem;border-radius:0.5rem;
font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="autocomplete-004"] [data-part="option"][data-active="true"]{background:var(--vibeui-autocomplete-004-active)}
[data-vibeui-block="autocomplete-004"] [data-part="hint"]{font-size:0.75rem;color:var(--vibeui-autocomplete-004-muted)}
[data-vibeui-block="autocomplete-004"] [data-part="empty"]{padding:1.25rem 0.75rem;text-align:center;font-size:0.875rem;color:var(--vibeui-autocomplete-004-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="autocomplete-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS: Autocomplete004Command[] = [
  { label: "Создать проект", group: "Действия", hint: "N" },
  { label: "Пригласить в команду", group: "Действия" },
  { label: "Загрузить файлы", group: "Действия", hint: "U" },
  { label: "Оплата и счета", group: "Настройки" },
  { label: "Уведомления", group: "Настройки" },
  { label: "Ключи доступа", group: "Настройки" },
  { label: "Документация", group: "Помощь", hint: "?" },
  { label: "Написать в поддержку", group: "Помощь" },
]

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
 * Строка команд: поиск по приложению с группами и клавиатурой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Autocomplete004({
  placeholder = "Команда или раздел",
  commands = DEFAULT_COMMANDS,
  emptyLabel = "Ничего не нашлось",
  listLabel = "Команды",
  onSelect,
  background = "",
  accent,
  className,
  style,
  ...props
}: Autocomplete004Props) {
  const id = useId()
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return commands
    return commands.filter((command) =>
      command.label.toLowerCase().includes(needle),
    )
  }, [commands, query])

  const palette = {
    ...(accent ? { "--vibeui-autocomplete-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-autocomplete-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActive((active + 1) % matches.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActive((active - 1 + matches.length) % matches.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      onSelect?.(matches[active].label)
    }
  }

  // Заголовок печатается у первой команды своей группы: разметку считаем
  // до рендера, чтобы ничего не менять по ходу отрисовки.
  const heads = matches.map((command, index) =>
    index === 0 || matches[index - 1].group !== command.group
      ? command.group
      : "",
  )

  return (
    <>
      <style href="vibeui-autocomplete-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="autocomplete-004"
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
            placeholder={placeholder}
            value={query}
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={
              matches[active] ? `${id}-option-${active}` : undefined
            }
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
          <kbd>Esc</kbd>
        </div>
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={listLabel}
          data-part="list"
        >
          {matches.map((command, index) => (
            <li key={command.label} role="presentation">
              {heads[index] ? (
                <p data-part="group" role="presentation">
                  {heads[index]}
                </p>
              ) : null}
              <span
                id={`${id}-option-${index}`}
                role="option"
                data-part="option"
                data-active={index === active}
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  onSelect?.(command.label)
                }}
              >
                {command.label}
                {command.hint ? (
                  <span data-part="hint">⌘ {command.hint}</span>
                ) : null}
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
