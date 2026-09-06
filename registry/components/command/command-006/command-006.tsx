"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command006Command = {
  label: string
  keys: string[]
}

export type Command006Props = Omit<ComponentProps<"div">, "children"> & {
  commands?: Command006Command[]
  placeholder?: string
  /** Имя панели для скринридера. */
  label?: string
  /** Имя списка строк для скринридера. */
  listLabel?: string
  /** Подпись группы клавиш; {keys} — сами клавиши через пробел. */
  keysLabel?: string
  /** Ответ, когда ничего не нашлось. */
  emptyText?: string
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

// Идея компонента: палитра как шпаргалка по горячим клавишам. Сочетание
// хранится массивом клавиш, а не строкой, поэтому каждая клавиша получает свой
// <kbd> и последовательности вроде «G затем C» читаются как два нажатия, а не
// как одно. Поиск идёт и по названию, и по самим клавишам: «Ctrl+K» находит
// команду быстрее, чем попытка вспомнить её имя.
//
// Тема берётся из color-scheme окружения через light-dark(): клавиша в тёмной
// ветке чуть светлее панели, а не темнее, иначе рельеф kbd пропадает.
const STYLES = `
:where([data-vibeui-block="command-006"]){
--vibeui-command-006-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-006-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-006-muted:color-mix(in oklab,var(--vibeui-command-006-fg) 68%,transparent);
--vibeui-command-006-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-006-key:light-dark(oklch(0.98 0 265),oklch(0.27 0 265));
--vibeui-command-006-accent:light-dark(oklch(0.56 0.15 165),oklch(0.76 0.13 165));
--vibeui-command-006-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
--vibeui-command-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-006"]{color-scheme:dark}
[data-vibeui-block="command-006"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-006-bg);color:var(--vibeui-command-006-fg);
border:1px solid var(--vibeui-command-006-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-006-shadow);
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
background:var(--vibeui-command-006-key);
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
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-006"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-006-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-006"]{color-scheme:dark}
[data-vibeui-shell="command-006"] [data-part="open"]{
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
[data-vibeui-shell="command-006"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-006"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-006"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-006"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-006-anchor){
[data-vibeui-shell="command-006"] [data-part="open"]{anchor-name:--vibeui-command-006-anchor}
[data-vibeui-menu="command-006"]{
position-anchor:--vibeui-command-006-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-006"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-006"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-006"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

`

const DEFAULT_COMMANDS: Command006Command[] = [
  { label: "Открыть палитру", keys: ["Ctrl", "K"] },
  { label: "Сохранить файл", keys: ["Ctrl", "S"] },
  { label: "Перейти к каталогу", keys: ["G", "C"] },
  { label: "Перейти к блокам", keys: ["G", "B"] },
  { label: "Переключить панель", keys: ["Ctrl", "B"] },
  { label: "Отменить действие", keys: ["Ctrl", "Z"] },
  { label: "Пересобрать реестр", keys: ["Ctrl", "Shift", "R"] },
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
 * Палитра с горячими клавишами у каждой строки: поиск идёт и по названию,
 * и по клавишам. Один файл, ноль зависимостей.
 */
export function Command006({
  commands = DEFAULT_COMMANDS,
  placeholder = "Команда или сочетание…",
  label = "Горячие клавиши",
  listLabel = "Команды",
  keysLabel = "Сочетание: {keys}",
  emptyText = "Такого сочетания нет — попробуйте другое.",
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-006-panel",
  background = "",
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
    ...(background
      ? {
          "--vibeui-command-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-006" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-shell="command-006">
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
          data-vibeui-menu="command-006"
          aria-label={triggerLabel}
        >
          <div
            {...props}
            data-slot="command"
            data-vibeui-block="command-006"
            className={className}
            style={paletteStyle}
            role="dialog"
            aria-label={label}
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
                    aria-selected={current === command}
                    onClick={() => setActive(index)}
                  >
                    {command.label}
                    <span
                      data-part="keys"
                      aria-label={keysLabel.replace(
                        "{keys}",
                        command.keys.join(" "),
                      )}
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
        </div>
      </div>
    </>
  )
}
