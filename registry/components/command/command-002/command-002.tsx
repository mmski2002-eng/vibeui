"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command002Command = {
  label: string
  group: string
  keys?: string
}

export type Command002Props = Omit<ComponentProps<"div">, "children"> & {
  commands?: Command002Command[]
  placeholder?: string
  label?: string
  /** Ответ на пустой поиск: компонент несёт русский, проект подставляет свой. */
  emptyText?: string
  /** Подсказка внизу панели про клавиши. */
  hintText?: string
  /** Строка после запуска команды; {command} — её название. */
  doneText?: string
  /** Подложка панели. Пусто — цвет по умолчанию из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: палитра, встроенная в страницу, а не спрятанная в модалку.
// Отсюда весь ARIA-договор пишется руками: поле — combobox, список — listbox,
// строки — option, а подсветка передаётся через aria-activedescendant, потому
// что фокус остаётся в поле ввода и не уходит на строки. Стрелки ходят по
// плоскому видимому порядку: после группировки он не совпадает с исходным
// массивом, и индекс от исходного массива подсветил бы не ту строку.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее подложки, а не темнее — иначе панель растворяется.
const STYLES = `
:where([data-vibeui-block="command-002"]){
--vibeui-command-002-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-002-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-002-muted:color-mix(in oklab,var(--vibeui-command-002-fg) 68%,transparent);
--vibeui-command-002-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-002-accent:light-dark(oklch(0.55 0.19 262),oklch(0.74 0.16 262));
--vibeui-command-002-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
--vibeui-command-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-002"]{color-scheme:dark}
[data-vibeui-block="command-002"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;
background:var(--vibeui-command-002-bg);color:var(--vibeui-command-002-fg);
border:1px solid var(--vibeui-command-002-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-002-shadow);
font-family:var(--vibeui-command-002-font);overflow:hidden;
}
[data-vibeui-block="command-002"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.875rem;border-bottom:1px solid var(--vibeui-command-002-border);
}
[data-vibeui-block="command-002"] [data-part="glyph"]{flex:none;color:var(--vibeui-command-002-muted);font-size:0.875rem}
[data-vibeui-block="command-002"] input{
flex:1;min-width:0;height:2.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-002"] [data-part="field"]:focus-within{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-002-accent)}
[data-vibeui-block="command-002"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:15rem;overflow-y:auto;
}
[data-vibeui-block="command-002"] [data-part="list"] [data-part="list"]{padding:0;max-height:none;overflow:visible}
[data-vibeui-block="command-002"] [data-part="group"]{
padding:0.5rem 0.5625rem 0.25rem;margin:0;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-command-002-muted);
}
[data-vibeui-block="command-002"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;
font-size:0.875rem;
}
/* Подсветка одна на клавиатуру и мышь: две разные читаются как две позиции. */
[data-vibeui-block="command-002"] [data-part="row"]:hover,
[data-vibeui-block="command-002"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-002-accent) 12%,transparent);
}
[data-vibeui-block="command-002"] [data-part="row"] kbd{
margin-left:auto;
border:1px solid var(--vibeui-command-002-border);border-bottom-width:2px;border-radius:0.3125rem;
padding:0 0.3125rem;font:inherit;font-size:0.6875rem;color:var(--vibeui-command-002-muted);
}
[data-vibeui-block="command-002"] [data-part="empty"]{
margin:0;padding:1.25rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-002-muted);
}
[data-vibeui-block="command-002"] [data-part="foot"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-002-border);
font-size:0.6875rem;color:var(--vibeui-command-002-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS: Command002Command[] = [
  { label: "Новый компонент", group: "Действия", keys: "Ctrl+N" },
  { label: "Пересобрать реестр", group: "Действия", keys: "Ctrl+R" },
  { label: "Открыть каталог", group: "Переходы", keys: "G C" },
  { label: "Открыть настройки", group: "Переходы", keys: "G S" },
  { label: "Сменить тему", group: "Вид", keys: "Ctrl+Shift+L" },
  { label: "Показать сетку", group: "Вид" },
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
 * Встроенная командная палитра с группами и полным договором combobox +
 * listbox. Один файл, ноль зависимостей, собственная палитра.
 */
export function Command002({
  commands = DEFAULT_COMMANDS,
  placeholder = "Команда или переход…",
  label = "Командная палитра",
  emptyText = "Ничего не нашлось. Попробуйте другое слово.",
  hintText = "↑↓ выбор · Enter запуск · Esc сброс",
  doneText = "Выполнено: {command}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command002Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const found = commands.filter((command) =>
    command.label.toLowerCase().includes(needle),
  )
  const groups = found.reduce<Record<string, Command002Command[]>>(
    (all, command) => {
      all[command.group] = all[command.group]
        ? [...all[command.group], command]
        : [command]
      return all
    },
    {},
  )
  const ordered = Object.values(groups).flat()
  const current = ordered[Math.min(active, ordered.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (ordered.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + ordered.length) % ordered.length)
      return
    }

    if (event.key === "Enter" && current) {
      event.preventDefault()
      setChosen(current.label)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-command-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="command"
        data-vibeui-block="command-002"
        className={className}
        style={palette}
        role="dialog"
        aria-label={label}
      >
        <div data-part="field">
          <span data-part="glyph" aria-hidden="true">
            ⌕
          </span>
          <input
            type="text"
            role="combobox"
            aria-expanded={ordered.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              current ? `${rowId}-${ordered.indexOf(current)}` : undefined
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
        {ordered.length === 0 ? (
          <p data-part="empty">{emptyText}</p>
        ) : (
          <ul id={listId} data-part="list" role="listbox" aria-label={label}>
            {Object.entries(groups).map(([group, rows]) => (
              <li key={group} role="presentation">
                <p data-part="group">{group}</p>
                <ul data-part="list" role="group" aria-label={group}>
                  {rows.map((command) => (
                    <li
                      key={command.label}
                      id={`${rowId}-${ordered.indexOf(command)}`}
                      data-part="row"
                      role="option"
                      aria-selected={current?.label === command.label}
                      onClick={() => setChosen(command.label)}
                    >
                      {command.label}
                      {command.keys ? <kbd>{command.keys}</kbd> : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        <p data-part="foot" role="status">
          {chosen ? doneText.replace("{command}", chosen) : hintText}
        </p>
      </div>
    </>
  )
}
