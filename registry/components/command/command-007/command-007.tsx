"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command007Entry = {
  label: string
  mode: ">" | "@" | "#"
}

export type Command007Hint = {
  sigil: string
  text: string
}

export type Command007Props = Omit<ComponentProps<"div">, "children"> & {
  entries?: Command007Entry[]
  placeholder?: string
  /** Легенда синтаксиса: компонент несёт русскую, проект подставляет свою. */
  hints?: Command007Hint[]
  /** Строка над легендой, когда префикс набран, но совпадений нет. */
  emptyText?: string
  /** Строка над легендой, когда префикс ещё не набран. */
  leadText?: string
  /** Имя панели для скринридера. */
  label?: string
  /** Имя списка результатов для скринридера. */
  listLabel?: string
  /** Подложка панели. Пусто — цвет по умолчанию из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: палитра с синтаксисом префиксов и честным пустым
// состоянием. Пустой список — это место, где пользователь застрял, поэтому
// вместо строчки «ничего не найдено» здесь показывается легенда: > команды,
// @ символы, # строки. Режим определяется первым символом запроса и виден
// чипом слева от поля, так что связь «набрал > — сменился список» очевидна.
//
// Тема берётся из color-scheme окружения через light-dark(): у чипа режима и
// плашек легенды свои пары светлот, а не зеркальные к светлой ветке.
const STYLES = `
:where([data-vibeui-block="command-007"]){
--vibeui-command-007-bg:light-dark(oklch(1 0 0),oklch(0.21 0.012 265));
--vibeui-command-007-fg:light-dark(oklch(0.23 0.014 265),oklch(0.94 0.006 265));
--vibeui-command-007-muted:color-mix(in oklab,var(--vibeui-command-007-fg) 68%,transparent);
--vibeui-command-007-border:light-dark(oklch(0.9 0.006 265),oklch(0.35 0.012 265));
--vibeui-command-007-accent:light-dark(oklch(0.62 0.16 55),oklch(0.78 0.13 55));
--vibeui-command-007-chip:light-dark(oklch(0.48 0.14 55),oklch(0.85 0.11 55));
--vibeui-command-007-code:light-dark(oklch(0.55 0.02 265 / 10%),oklch(0.85 0.02 265 / 14%));
--vibeui-command-007-shadow:light-dark(oklch(0.2 0.03 265 / 60%),oklch(0.04 0.015 265 / 70%));
--vibeui-command-007-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
--vibeui-command-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-007"]{color-scheme:dark}
[data-vibeui-block="command-007"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-007-bg);color:var(--vibeui-command-007-fg);
border:1px solid var(--vibeui-command-007-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-007-shadow);
font-family:var(--vibeui-command-007-font);
}
[data-vibeui-block="command-007"] [data-part="field"]{
display:flex;align-items:center;gap:0.5rem;
padding:0 0.75rem;border-bottom:1px solid var(--vibeui-command-007-border);
}
[data-vibeui-block="command-007"] [data-part="chip"]{
flex:none;padding:0.125rem 0.4375rem;border-radius:0.4375rem;
background:color-mix(in oklab,var(--vibeui-command-007-accent) 18%,transparent);
color:var(--vibeui-command-007-chip);
font-family:var(--vibeui-command-007-mono);font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="command-007"] input{
flex:1;min-width:0;height:2.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-007"] [data-part="field"]:focus-within{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-007-accent)}
[data-vibeui-block="command-007"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="command-007"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.4375rem 0.5625rem;border-radius:0.5rem;cursor:pointer;font-size:0.875rem;
}
[data-vibeui-block="command-007"] [data-part="row"]:hover,
[data-vibeui-block="command-007"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-007-accent) 14%,transparent);
}
[data-vibeui-block="command-007"] [data-part="sigil"]{
flex:none;width:1rem;text-align:center;
font-family:var(--vibeui-command-007-mono);color:var(--vibeui-command-007-muted);
}
/* Пустой ответ — это подсказка синтаксиса, а не строчка «ничего не найдено». */
[data-vibeui-block="command-007"] [data-part="hints"]{
list-style:none;margin:0;padding:0.875rem;
display:flex;flex-direction:column;gap:0.5rem;
}
[data-vibeui-block="command-007"] [data-part="hints"] li{
display:flex;align-items:baseline;gap:0.625rem;
font-size:0.8125rem;color:var(--vibeui-command-007-muted);
}
[data-vibeui-block="command-007"] [data-part="hints"] code{
flex:none;min-width:1.5rem;padding:0.0625rem 0.375rem;border-radius:0.375rem;
background:var(--vibeui-command-007-code);color:var(--vibeui-command-007-fg);
font-family:var(--vibeui-command-007-mono);font-size:0.75rem;font-weight:700;
}
[data-vibeui-block="command-007"] [data-part="lead"]{
margin:0;padding:0.875rem 0.875rem 0;font-size:0.8125rem;color:var(--vibeui-command-007-fg);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ENTRIES: Command007Entry[] = [
  { label: "Пересобрать реестр", mode: ">" },
  { label: "Проверить metadata", mode: ">" },
  { label: "Очистить кеш превью", mode: ">" },
  { label: "validateSource", mode: "@" },
  { label: "buildIndexes", mode: "@" },
  { label: "pascalCase", mode: "@" },
  { label: "Строка 128", mode: "#" },
  { label: "Строка 214", mode: "#" },
]

const DEFAULT_HINTS: Command007Hint[] = [
  { sigil: ">", text: "команды приложения" },
  { sigil: "@", text: "символы в открытом файле" },
  { sigil: "#", text: "переход к строке" },
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
 * Палитра с префиксным синтаксисом и подсказкой вместо пустого списка.
 * Один файл, ноль зависимостей.
 */
export function Command007({
  entries = DEFAULT_ENTRIES,
  placeholder = "Введите > @ или #",
  hints = DEFAULT_HINTS,
  emptyText = "Ничего не нашлось. Проверьте префикс:",
  leadText = "Начните с префикса:",
  label = "Командная палитра с синтаксисом",
  listLabel = "Результаты",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command007Props) {
  const [query, setQuery] = useState(">")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const sigil = [">", "@", "#"].includes(query.charAt(0))
    ? (query.charAt(0) as Command007Entry["mode"])
    : null
  const needle = (sigil ? query.slice(1) : query).trim().toLowerCase()
  const rows = sigil
    ? entries.filter(
        (entry) =>
          entry.mode === sigil && entry.label.toLowerCase().includes(needle),
      )
    : []
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
    ...(accent ? { "--vibeui-command-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="command"
        data-vibeui-block="command-007"
        className={className}
        style={paletteStyle}
        role="dialog"
        aria-label={label}
      >
        <div data-part="field">
          {sigil ? (
            <span data-part="chip" aria-hidden="true">
              {sigil}
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
        {rows.length === 0 ? (
          <>
            <p data-part="lead">{sigil ? emptyText : leadText}</p>
            <ul data-part="hints">
              {hints.map((hint) => (
                <li key={hint.sigil}>
                  <code>{hint.sigil}</code>
                  {hint.text}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <ul
            id={listId}
            data-part="list"
            role="listbox"
            aria-label={listLabel}
          >
            {rows.map((entry, index) => (
              <li
                key={`${entry.mode}-${entry.label}`}
                id={`${rowId}-${index}`}
                data-part="row"
                role="option"
                aria-selected={current === entry}
                onClick={() => setActive(index)}
              >
                <span data-part="sigil" aria-hidden="true">
                  {entry.mode}
                </span>
                {entry.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
