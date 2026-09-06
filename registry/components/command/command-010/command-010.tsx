"use client"

import { useEffect, useId, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command010Props = Omit<ComponentProps<"div">, "children"> & {
  items?: string[]
  delay?: number
  placeholder?: string
  /** Имя панели для скринридера. */
  label?: string
  /** Имя списка результатов для скринридера. */
  listLabel?: string
  /** Ответ, когда ничего не нашлось. */
  emptyText?: string
  /** Строка подвала во время ожидания ответа. */
  loadingText?: string
  /** Строка подвала с итогом; {count} — число строк. */
  countText?: string
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

// Идея компонента: палитра, которая ищет на сервере. Между вводом и ответом
// проходит время, и подменять его пустым списком нельзя — «ничего не найдено»
// и «ещё не приехало» выглядят одинаково, но означают разное. Пока запрос в
// работе, показываются скелетоны той же высоты, что и строки, поэтому список
// не прыгает; полоса под полем и role=status озвучивают загрузку.
//
// Тема берётся из color-scheme окружения через light-dark(): скелетон в тёмной
// ветке светлее подложки, а в светлой темнее — иначе его просто не видно.
const STYLES = `
:where([data-vibeui-block="command-010"]){
--vibeui-command-010-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-010-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-010-muted:color-mix(in oklab,var(--vibeui-command-010-fg) 68%,transparent);
--vibeui-command-010-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-010-accent:light-dark(oklch(0.58 0.16 39.8),oklch(0.78 0.12 39.8));
--vibeui-command-010-ghost:light-dark(oklch(0.55 0 265 / 10%),oklch(0.88 0 265 / 12%));
--vibeui-command-010-ghost-lit:light-dark(oklch(0.55 0 265 / 20%),oklch(0.88 0 265 / 24%));
--vibeui-command-010-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
--vibeui-command-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-010"]{color-scheme:dark}
[data-vibeui-block="command-010"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-010-bg);color:var(--vibeui-command-010-fg);
border:1px solid var(--vibeui-command-010-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-010-shadow);
font-family:var(--vibeui-command-010-font);
}
[data-vibeui-block="command-010"] [data-part="field"]{position:relative;border-bottom:1px solid var(--vibeui-command-010-border)}
[data-vibeui-block="command-010"] input{
box-sizing:border-box;width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-010"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-010-accent)}
/* Полоса-бегунок под полем: она держит место и не двигает список. */
[data-vibeui-block="command-010"] [data-part="bar"]{
position:absolute;inset:auto 0 -1px;height:2px;overflow:hidden;
background:color-mix(in oklab,var(--vibeui-command-010-accent) 18%,transparent);
}
[data-vibeui-block="command-010"] [data-part="bar"]::after{
content:"";position:absolute;inset:0 auto 0 0;width:40%;
background:var(--vibeui-command-010-accent);
animation:vibeui-command-010-slide 1s linear infinite;
}
@keyframes vibeui-command-010-slide{
from{transform:translateX(-100%)}
to{transform:translateX(350%)}
}
[data-vibeui-block="command-010"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:14rem;overflow-y:auto;
}
[data-vibeui-block="command-010"] [data-part="row"],
[data-vibeui-block="command-010"] [data-part="ghost"]{
display:flex;align-items:center;gap:0.625rem;
min-height:2rem;padding:0.4375rem 0.5625rem;border-radius:0.5rem;font-size:0.875rem;
}
[data-vibeui-block="command-010"] [data-part="row"]{cursor:pointer}
[data-vibeui-block="command-010"] [data-part="row"]:hover,
[data-vibeui-block="command-010"] [data-part="row"][aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-command-010-accent) 14%,transparent);
}
/* Скелетон повторяет высоту строки: после ответа список не прыгает. */
[data-vibeui-block="command-010"] [data-part="ghost"] span{
display:block;height:0.6875rem;border-radius:0.375rem;
background:linear-gradient(90deg,var(--vibeui-command-010-ghost),var(--vibeui-command-010-ghost-lit),var(--vibeui-command-010-ghost));
background-size:200% 100%;
animation:vibeui-command-010-pulse 1.4s ease-in-out infinite;
}
@keyframes vibeui-command-010-pulse{
0%{background-position:100% 0}
100%{background-position:-100% 0}
}
[data-vibeui-block="command-010"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-010-muted);
}
[data-vibeui-block="command-010"] [data-part="foot"]{
margin:0;padding:0.4375rem 0.875rem;border-top:1px solid var(--vibeui-command-010-border);
font-size:0.6875rem;color:var(--vibeui-command-010-muted);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-010"] *{animation:none!important;transition:none!important}}
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-010"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-010-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-010"]{color-scheme:dark}
[data-vibeui-shell="command-010"] [data-part="open"]{
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
[data-vibeui-shell="command-010"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-010"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-010"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-010"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-010-anchor){
[data-vibeui-shell="command-010"] [data-part="open"]{anchor-name:--vibeui-command-010-anchor}
[data-vibeui-menu="command-010"]{
position-anchor:--vibeui-command-010-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-010"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-010"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-010"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

`

const DEFAULT_RESULTS = [
  "Открыть каталог компонентов",
  "Открыть реестр блоков",
  "Открыть журнал сборки",
  "Открыть настройки превью",
  "Открыть документацию по конвейеру",
]

const GHOSTS = [78, 62, 88, 54]

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
 * Палитра с индикатором загрузки: скелетоны той же высоты, что и строки,
 * плюс полоса под полем. Один файл, ноль зависимостей.
 */
export function Command010({
  items = DEFAULT_RESULTS,
  delay = 600,
  placeholder = "Поиск на сервере…",
  label = "Поиск команд",
  listLabel = "Результаты",
  emptyText = "Ничего не найдено. Уточните запрос.",
  loadingText = "Ищем на сервере…",
  countText = "Результатов: {count}",
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-010-panel",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command010Props) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  // Загрузка включается в обработчике ввода, а не в эффекте: эффект только
  // ждёт ответ. Смена запроса перезапускает таймер — так же ведёт себя
  // обычный debounce вокруг настоящего запроса.
  useEffect(() => {
    if (!loading) return

    const timer = window.setTimeout(() => setLoading(false), delay)

    return () => window.clearTimeout(timer)
  }, [query, delay, loading])

  const needle = query.trim().toLowerCase()
  const rows =
    needle.length === 0
      ? items
      : items.filter((result) => result.toLowerCase().includes(needle))
  const current = rows[Math.min(active, rows.length - 1)]

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (loading || rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
      setLoading(false)
    }
  }

  const paletteStyle = {
    ...(accent ? { "--vibeui-command-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-010" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-shell="command-010">
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
          data-vibeui-menu="command-010"
          aria-label={triggerLabel}
        >
          <div
            {...props}
            data-slot="command"
            data-vibeui-block="command-010"
            className={className}
            style={paletteStyle}
            role="dialog"
            aria-label={label}
          >
            <div data-part="field">
              <input
                type="text"
                role="combobox"
                aria-expanded={!loading && rows.length > 0}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-busy={loading}
                aria-activedescendant={
                  !loading && current
                    ? `${rowId}-${rows.indexOf(current)}`
                    : undefined
                }
                aria-label={placeholder}
                placeholder={placeholder}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActive(0)
                  setLoading(event.target.value.trim().length > 0)
                }}
                onKeyDown={onKeyDown}
              />
              {loading ? <span data-part="bar" aria-hidden="true" /> : null}
            </div>
            {loading ? (
              <ul data-part="list" aria-hidden="true">
                {GHOSTS.map((width) => (
                  <li key={width} data-part="ghost">
                    <span style={{ width: `${width}%` }} />
                  </li>
                ))}
              </ul>
            ) : rows.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              <ul
                id={listId}
                data-part="list"
                role="listbox"
                aria-label={listLabel}
              >
                {rows.map((result, index) => (
                  <li
                    key={result}
                    id={`${rowId}-${index}`}
                    data-part="row"
                    role="option"
                    aria-selected={current === result}
                    onClick={() => setActive(index)}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            )}
            <p data-part="foot" role="status">
              {loading
                ? loadingText
                : countText.replace("{count}", String(rows.length))}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
