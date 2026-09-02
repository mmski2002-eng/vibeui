"use client"

import { useId, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Command004Command = {
  label: string
  children?: string[]
}

export type Command004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  commands?: Command004Command[]
  placeholder?: string
  /** Подсказка поля на втором уровне. */
  childPlaceholder?: string
  /** Имя палитры для скринридера. */
  label?: string
  /** Имя списка строк для скринридера. */
  listLabel?: string
  /** Подпись кнопки возврата на первый уровень. */
  backLabel?: string
  /** Ответ, когда в списке ничего не осталось. */
  emptyText?: string
  /** Подсказка клавиш на первом уровне. */
  hintText?: string
  /** Подсказка клавиш на втором уровне. */
  childHintText?: string
  /** Строка после запуска команды; {command} — её название. */
  doneText?: string
  /** Подложка панели. Пусто — цвет по умолчанию из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: двухуровневая палитра. Команда с параметром («Сменить
// тему» → какую именно) не помещается в одну строку списка, поэтому Enter по
// такой строке не запускает её, а входит на второй уровень: слева от поля
// появляется чип-хлебная крошка, запрос сбрасывается, список сменяется
// подкомандами. Backspace на пустом запросе выходит обратно — это привычный
// жест, и он снимает необходимость целиться в крестик.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее подложки, а акцент поднят по светлоте, чтобы читаться.
const STYLES = `
:where([data-vibeui-block="command-004"]){
--vibeui-command-004-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-command-004-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-command-004-muted:light-dark(oklch(0.57 0.014 265),oklch(0.68 0.012 265));
--vibeui-command-004-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-command-004-accent:light-dark(oklch(0.55 0.2 300),oklch(0.76 0.14 300));
--vibeui-command-004-shadow:light-dark(oklch(0.2 0.03 265 / 60%),oklch(0.04 0.015 265 / 70%));
--vibeui-command-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="command-004"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-004-bg);color:var(--vibeui-command-004-fg);
border:1px solid var(--vibeui-command-004-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-004-shadow);
font-family:var(--vibeui-command-004-font);
}
[data-vibeui-block="command-004"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.75rem;border-bottom:1px solid var(--vibeui-command-004-border);
}
/* Чип уровня заменяет крошки над полем: он рядом с курсором, где и мысль. */
[data-vibeui-block="command-004"] [data-part="crumb"]{
display:inline-flex;align-items:center;gap:0.375rem;flex:none;
padding:0.1875rem 0.5rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-command-004-accent) 15%,transparent);
color:var(--vibeui-command-004-accent);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="command-004"] [data-part="crumb"] button{
appearance:none;border:0;background:none;padding:0;cursor:pointer;
color:inherit;font:inherit;line-height:1;
}
[data-vibeui-block="command-004"] [data-part="crumb"] button:focus-visible{outline:2px solid currentColor;outline-offset:2px;border-radius:0.25rem}
[data-vibeui-block="command-004"] input{
flex:1;min-width:0;height:2.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-004"] [data-part="field"]:focus-within{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-004-accent)}
[data-vibeui-block="command-004"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="command-004"] [data-part="row"]{
display:flex;align-items:center;gap:0.75rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="command-004"] [data-part="row"]:hover,
[data-vibeui-block="command-004"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-004-accent) 12%,transparent);
}
[data-vibeui-block="command-004"] [data-part="row"] [data-part="more"]{
margin-left:auto;color:var(--vibeui-command-004-muted);font-size:0.75rem;
}
[data-vibeui-block="command-004"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-004-muted);
}
[data-vibeui-block="command-004"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;
border-top:1px solid var(--vibeui-command-004-border);
font-size:0.6875rem;color:var(--vibeui-command-004-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS: Command004Command[] = [
  {
    label: "Сменить тему",
    children: ["Светлая", "Тёмная", "Как в системе"],
  },
  {
    label: "Создать",
    children: ["Компонент", "Блок", "Категорию"],
  },
  {
    label: "Экспорт реестра",
    children: ["JSON для shadcn", "Архив исходников"],
  },
  { label: "Пересобрать индексы" },
  { label: "Открыть документацию" },
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
 * Двухуровневая палитра: Enter входит в подкоманды, Backspace на пустом
 * запросе возвращает назад. Один файл, ноль зависимостей.
 */
export function Command004({
  commands = DEFAULT_COMMANDS,
  placeholder = "Команда…",
  childPlaceholder = "Подкоманда…",
  label = "Командная палитра",
  listLabel = "Команды",
  backLabel = "Назад к списку команд",
  emptyText = "Здесь ничего нет. Сотрите запрос или вернитесь назад.",
  hintText = "Enter — открыть подкоманды · Esc — сброс",
  childHintText = "Backspace — назад · Enter — выполнить",
  doneText = "Выполнено: {command}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command004Props) {
  const [query, setQuery] = useState("")
  const [parent, setParent] = useState<Command004Command | null>(null)
  const [active, setActive] = useState(0)
  const [done, setDone] = useState<string | null>(null)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const source = parent
    ? (parent.children ?? []).map((label) => ({ label }))
    : commands
  const rows = source.filter((command) =>
    command.label.toLowerCase().includes(needle),
  )
  const current = rows[Math.min(active, rows.length - 1)]

  const back = () => {
    setParent(null)
    setQuery("")
    setActive(0)
  }

  const choose = (command: Command004Command) => {
    if (command.children && command.children.length > 0) {
      setParent(command)
      setQuery("")
      setActive(0)
      setDone(null)
      return
    }

    setDone(parent ? `${parent.label}: ${command.label}` : command.label)
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
      choose(current)
      return
    }

    // Backspace на пустом запросе — привычный выход на уровень выше.
    if (event.key === "Backspace" && query.length === 0 && parent) {
      event.preventDefault()
      back()
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      if (query.length > 0) {
        setQuery("")
        setActive(0)
      } else if (parent) {
        back()
      }
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-004-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-004-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="command-004"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label={label}
      >
        <div data-part="field">
          {parent ? (
            <span data-part="crumb">
              {parent.label}
              <button type="button" aria-label={backLabel} onClick={back}>
                ✕
              </button>
            </span>
          ) : null}
          <input
            type="text"
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              current ? `${rowId}-${rows.indexOf(current)}` : undefined
            }
            aria-label={
              parent ? `${parent.label}: ${childPlaceholder}` : placeholder
            }
            placeholder={parent ? childPlaceholder : placeholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
          />
        </div>
        {rows.length === 0 ? (
          <p data-part="empty">{emptyText}</p>
        ) : (
          <ul
            id={listId}
            data-part="list"
            role="listbox"
            aria-label={listLabel}
          >
            {rows.map((command, index) => (
              <li
                key={command.label}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current?.label === command.label}
                onClick={() => choose(command)}
              >
                {command.label}
                {"children" in command && command.children ? (
                  <span data-part="more" aria-hidden="true">
                    ›
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <p data-part="foot" role="status">
          {done
            ? doneText.replace("{command}", done)
            : parent
              ? childHintText
              : hintText}
        </p>
      </div>
    </>
  )
}
