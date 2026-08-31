"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Command006Command = {
  label: string
  keys: string[]
}

export type Command006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  commands?: Command006Command[]
  placeholder?: string
  accent?: string
}

// Идея компонента: палитра как шпаргалка по горячим клавишам. Сочетание
// хранится массивом клавиш, а не строкой, поэтому каждая клавиша получает свой
// <kbd> и последовательности вроде «G затем C» читаются как два нажатия, а не
// как одно. Поиск идёт и по названию, и по самим клавишам: «⌘K» находит
// команду быстрее, чем попытка вспомнить её имя.
const STYLES = `
:where([data-vibeui-block="command-006"]){
--vibeui-command-006-bg:oklch(1 0 0);
--vibeui-command-006-fg:oklch(0.23 0.014 265);
--vibeui-command-006-muted:oklch(0.57 0.014 265);
--vibeui-command-006-border:oklch(0.9 0.006 265);
--vibeui-command-006-accent:oklch(0.56 0.15 165);
--vibeui-command-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-006"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-006-bg);color:var(--vibeui-command-006-fg);
border:1px solid var(--vibeui-command-006-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px oklch(0.2 0.03 265 / 60%);
font-family:var(--vibeui-command-006-font);
}
[data-vibeui-block="command-006"] input{
box-sizing:border-box;width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;border-bottom:1px solid var(--vibeui-command-006-border);
background:none;color:inherit;font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-006"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-006-accent)}
[data-vibeui-block="command-006"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:15rem;overflow-y:auto;
}
[data-vibeui-block="command-006"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="command-006"] [data-part="row"]:hover,
[data-vibeui-block="command-006"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-006-accent) 14%,transparent);
}
/* Сочетание — массив клавиш: «G затем C» читается как два нажатия. */
[data-vibeui-block="command-006"] [data-part="keys"]{
display:inline-flex;align-items:center;gap:0.25rem;margin-left:auto;flex:none;
}
[data-vibeui-block="command-006"] kbd{
min-width:1.25rem;padding:0 0.3125rem;text-align:center;
border:1px solid var(--vibeui-command-006-border);border-bottom-width:2px;border-radius:0.3125rem;
background:oklch(0.98 0.002 265);
font:inherit;font-size:0.6875rem;font-weight:650;line-height:1.25rem;
color:var(--vibeui-command-006-muted);
}
[data-vibeui-block="command-006"] [data-part="row"][aria-selected="true"] kbd{
border-color:color-mix(in oklab,var(--vibeui-command-006-accent) 40%,var(--vibeui-command-006-border));
color:var(--vibeui-command-006-fg);
}
[data-vibeui-block="command-006"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-006-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS: Command006Command[] = [
  { label: "Открыть палитру", keys: ["⌘", "K"] },
  { label: "Сохранить файл", keys: ["⌘", "S"] },
  { label: "Перейти к каталогу", keys: ["G", "C"] },
  { label: "Перейти к блокам", keys: ["G", "B"] },
  { label: "Переключить панель", keys: ["⌘", "B"] },
  { label: "Отменить действие", keys: ["⌘", "Z"] },
  { label: "Пересобрать реестр", keys: ["⌘", "⇧", "R"] },
]

/**
 * Палитра с горячими клавишами у каждой строки: поиск идёт и по названию,
 * и по клавишам. Один файл, ноль зависимостей.
 */
export function Command006({
  commands = DEFAULT_COMMANDS,
  placeholder = "Команда или сочетание…",
  accent,
  className,
  style,
  ...props
}: Command006Props) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const rows = commands.filter(
    (command) =>
      command.label.toLowerCase().includes(needle) ||
      command.keys.join("").toLowerCase().includes(needle),
  )
  const current = rows[Math.min(active, rows.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-006-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-006"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label="Горячие клавиши"
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
        {rows.length === 0 ? (
          <p data-part="empty">Такого сочетания нет — попробуйте другое.</p>
        ) : (
          <ul id={listId} data-part="list" role="listbox" aria-label="Команды">
            {rows.map((command, index) => (
              <li
                key={command.label}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current === command}
                onClick={() => setActive(index)}
              >
                {command.label}
                <span
                  data-part="keys"
                  aria-label={`Сочетание: ${command.keys.join(" ")}`}
                >
                  {command.keys.map((key, position) => (
                    <kbd key={`${key}-${position}`}>{key}</kbd>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
