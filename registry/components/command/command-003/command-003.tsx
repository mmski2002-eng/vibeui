"use client"

import { useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command003Props = Omit<ComponentProps<"div">, "children"> & {
  commands?: string[]
  recent?: string[]
  placeholder?: string
  /** Имя палитры для скринридера. */
  label?: string
  /** Имя списка строк для скринридера. */
  listLabel?: string
  /** Заголовок режима истории. */
  recentText?: string
  /** Заголовок режима поиска; {count} — число найденных строк. */
  foundText?: string
  /** Подпись кнопки очистки истории. */
  clearLabel?: string
  /** Ответ, когда история пуста. */
  emptyHistoryText?: string
  /** Ответ, когда поиск ничего не нашёл. */
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

// Идея компонента: палитра, которая при пустом запросе показывает не весь
// список, а недавние команды. Пустой ввод — это состояние «я ещё не знаю, что
// ищу», и полный алфавитный список в нём бесполезен: чаще всего повторяют
// последнее. Запуск команды поднимает её наверх недавних и обрезает историю,
// поэтому список не растёт. Заголовок раздела меняется вместе с режимом —
// иначе непонятно, почему строк стало меньше.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмной ветке
// граница светлее подложки, а акцент поднят по светлоте, чтобы читаться.
const STYLES = `
:where([data-vibeui-block="command-003"]){
--vibeui-command-003-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-003-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-003-muted:color-mix(in oklab,var(--vibeui-command-003-fg) 68%,transparent);
--vibeui-command-003-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-003-accent:light-dark(oklch(0.58 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-command-003-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
--vibeui-command-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-003"]{color-scheme:dark}
[data-vibeui-block="command-003"]{
display:block;box-sizing:border-box;width:100%;max-width:23rem;overflow:hidden;
background:var(--vibeui-command-003-bg);color:var(--vibeui-command-003-fg);
border:1px solid var(--vibeui-command-003-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-003-shadow);
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
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-003"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-003-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-003"]{color-scheme:dark}
[data-vibeui-shell="command-003"] [data-part="open"]{
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
[data-vibeui-shell="command-003"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-003"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-003"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-003"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-003-anchor){
[data-vibeui-shell="command-003"] [data-part="open"]{anchor-name:--vibeui-command-003-anchor}
[data-vibeui-menu="command-003"]{
position-anchor:--vibeui-command-003-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-003"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-003"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-003"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

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
 * Палитра с недавними командами: пустой запрос показывает историю, ввод
 * переключает на поиск. Один файл, ноль зависимостей.
 */
export function Command003({
  commands = DEFAULT_COMMANDS,
  recent = DEFAULT_RECENT,
  placeholder = "Что нужно сделать?",
  label = "Командная палитра",
  listLabel = "Команды",
  recentText = "Недавние",
  foundText = "Найдено: {count}",
  clearLabel = "очистить",
  emptyHistoryText = "История пуста — начните вводить название команды.",
  emptyText = "Совпадений нет. Попробуйте другое слово.",
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-003-panel",
  background = "",
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
    ...(background
      ? {
          "--vibeui-command-003-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-003" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-shell="command-003">
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
          data-vibeui-menu="command-003"
          aria-label={triggerLabel}
        >
          <div
            {...props}
            data-slot="command"
            data-vibeui-block="command-003"
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
            <p data-part="mode">
              {browsing
                ? recentText
                : foundText.replace("{count}", String(rows.length))}
              {browsing && history.length > 0 ? (
                <button
                  type="button"
                  data-part="clear"
                  onClick={() => setHistory([])}
                >
                  {clearLabel}
                </button>
              ) : null}
            </p>
            {rows.length === 0 ? (
              <p data-part="empty">{browsing ? emptyHistoryText : emptyText}</p>
            ) : (
              <ul
                id={listId}
                data-part="list"
                role="listbox"
                aria-label={listLabel}
              >
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
        </div>
      </div>
    </>
  )
}
