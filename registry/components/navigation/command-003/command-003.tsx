"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Command003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  commands?: string[]
  recent?: string[]
  placeholder?: string
  accent?: string
}

// Идея компонента: палитра, которая при пустом запросе показывает не весь
// список, а недавние команды. Пустой ввод — это состояние «я ещё не знаю, что
// ищу», и полный алфавитный список в нём бесполезен: чаще всего повторяют
// последнее. Запуск команды поднимает её наверх недавних и обрезает историю,
// поэтому список не растёт. Заголовок раздела меняется вместе с режимом —
// иначе непонятно, почему строк стало меньше.
const STYLES = `
:where([data-vibeui-block="command-003"]){
--vibeui-command-003-bg:oklch(1 0 0);
--vibeui-command-003-fg:oklch(0.23 0.014 265);
--vibeui-command-003-muted:oklch(0.57 0.014 265);
--vibeui-command-003-border:oklch(0.9 0.006 265);
--vibeui-command-003-accent:oklch(0.58 0.16 200);
--vibeui-command-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-003"]{
display:block;box-sizing:border-box;width:100%;max-width:23rem;overflow:hidden;
background:var(--vibeui-command-003-bg);color:var(--vibeui-command-003-fg);
border:1px solid var(--vibeui-command-003-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px oklch(0.2 0.03 265 / 60%);
font-family:var(--vibeui-command-003-font);
}
[data-vibeui-block="command-003"] input{
box-sizing:border-box;width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;border-bottom:1px solid var(--vibeui-command-003-border);
background:none;color:inherit;font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-003"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-003-accent)}
[data-vibeui-block="command-003"] [data-part="mode"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.875rem 0.25rem;margin:0;
font-size:0.6875rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-command-003-muted);
}
[data-vibeui-block="command-003"] [data-part="clear"]{
margin-left:auto;appearance:none;border:0;background:none;cursor:pointer;
color:var(--vibeui-command-003-accent);font:inherit;font-size:0.6875rem;font-weight:700;
letter-spacing:0.05em;text-transform:uppercase;
}
[data-vibeui-block="command-003"] [data-part="clear"]:focus-visible{outline:2px solid var(--vibeui-command-003-accent);outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="command-003"] [data-part="list"]{
list-style:none;margin:0;padding:0.25rem 0.3125rem 0.4375rem;
max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="command-003"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="command-003"] [data-part="row"]:hover,
[data-vibeui-block="command-003"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-003-accent) 14%,transparent);
}
/* Значок часов у недавних: режим списка виден строкой, а не только шапкой. */
[data-vibeui-block="command-003"] [data-part="row"] [data-part="tick"]{
flex:none;width:1rem;text-align:center;color:var(--vibeui-command-003-muted);font-size:0.75rem;
}
[data-vibeui-block="command-003"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-003-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS = [
  "Создать компонент",
  "Пересобрать реестр",
  "Проверить metadata",
  "Открыть каталог",
  "Открыть настройки проекта",
  "Сменить тему оформления",
  "Скопировать инструкцию для агента",
]

const DEFAULT_RECENT = [
  "Пересобрать реестр",
  "Скопировать инструкцию для агента",
  "Создать компонент",
]

/**
 * Палитра с недавними командами: пустой запрос показывает историю, ввод
 * переключает на поиск. Один файл, ноль зависимостей.
 */
export function Command003({
  commands = DEFAULT_COMMANDS,
  recent = DEFAULT_RECENT,
  placeholder = "Что нужно сделать?",
  accent,
  className,
  style,
  ...props
}: Command003Props) {
  const [query, setQuery] = useState("")
  const [history, setHistory] = useState(recent)
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const browsing = needle.length === 0
  const rows = browsing
    ? history
    : commands.filter((command) => command.toLowerCase().includes(needle))
  const current = rows[Math.min(active, rows.length - 1)]

  const run = (command: string) => {
    setHistory((list) =>
      [command, ...list.filter((entry) => entry !== command)].slice(0, 4),
    )
    setQuery("")
    setActive(0)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    if (event.key === "Enter" && current) {
      event.preventDefault()
      run(current)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-003"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label="Командная палитра"
      >
        <input
          type="text"
          role="combobox"
          aria-expanded={rows.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            current ? `${rowId}-${rows.indexOf(current)}` : undefined
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
        <p data-part="mode">
          {browsing ? "Недавние" : `Найдено: ${rows.length}`}
          {browsing && history.length > 0 ? (
            <button
              type="button"
              data-part="clear"
              onClick={() => setHistory([])}
            >
              очистить
            </button>
          ) : null}
        </p>
        {rows.length === 0 ? (
          <p data-part="empty">
            {browsing
              ? "История пуста — начните вводить название команды."
              : "Совпадений нет. Попробуйте другое слово."}
          </p>
        ) : (
          <ul id={listId} data-part="list" role="listbox" aria-label="Команды">
            {rows.map((command, index) => (
              <li
                key={command}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current === command}
                onClick={() => run(command)}
              >
                <span data-part="tick" aria-hidden="true">
                  {browsing ? "↺" : "›"}
                </span>
                {command}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
