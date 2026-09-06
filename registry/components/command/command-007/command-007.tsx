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
  /** Подпись кнопки, которая открывает палитру. */
  triggerLabel?: string
  /**
   * Показать палитру раскрытой в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  defaultOpen?: boolean
  /** id всплывающего слоя: на странице он обязан быть уникальным. */
  menuId?: string
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
--vibeui-command-007-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-007-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-007-muted:color-mix(in oklab,var(--vibeui-command-007-fg) 68%,transparent);
--vibeui-command-007-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-007-accent:light-dark(oklch(0.62 0.16 39.8),oklch(0.78 0.13 39.8));
--vibeui-command-007-chip:light-dark(oklch(0.48 0.14 39.8),oklch(0.85 0.11 39.8));
--vibeui-command-007-code:light-dark(oklch(0.55 0 265 / 10%),oklch(0.85 0 265 / 14%));
--vibeui-command-007-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
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
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-007"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-007-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-007"]{color-scheme:dark}
[data-vibeui-shell="command-007"] [data-part="open"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.625rem;
min-height:2.375rem;padding:0 0.875rem;box-sizing:border-box;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.36 0 265));
border-radius:0.625rem;
background:light-dark(oklch(1 0 0),oklch(0.24 0.01 265));
color:light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));
font:inherit;font-size:0.875rem;font-weight:650;line-height:1;
transition:border-color .16s ease;
}
[data-vibeui-shell="command-007"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-007"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-007"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-007"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-007-anchor){
[data-vibeui-shell="command-007"] [data-part="open"]{anchor-name:--vibeui-command-007-anchor}
[data-vibeui-menu="command-007"]{
position-anchor:--vibeui-command-007-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-007"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-007"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-007"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

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
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-007-panel",
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
      <div data-vibeui-shell="command-007">
        <button
          type="button"
          data-part="open"
          popoverTarget={defaultOpen ? undefined : menuId}
        >
          {triggerLabel}
          <kbd>Ctrl+K</kbd>
        </button>
        <div
          id={menuId}
          popover={defaultOpen ? undefined : "auto"}
          data-open={defaultOpen || undefined}
          data-vibeui-menu="command-007"
          aria-label={triggerLabel}
        >
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
        </div>
      </div>
    </>
  )
}
