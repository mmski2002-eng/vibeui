"use client"

import { useId, useMemo, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command012Props = Omit<ComponentProps<"div">, "children"> & {
  items?: string[]
  defaultSelected?: string[]
  defaultQuery?: string
  placeholder?: string
  label?: string
  listLabel?: string
  applyLabel?: string
  /** Ответ, когда фильтр ничего не оставил. */
  emptyText?: string
  /** Строка подвала со счётчиком; {count} — число отмеченных. */
  countText?: string
  onApply?: (values: string[]) => void
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

// Идея компонента: командная палитра, где Enter не выполняет строку сразу,
// а копит отметки. Обычная палитра одноразовая — выбор строки закрывает её,
// поэтому массовое действие над десятком элементов превращается в десять
// открытий заново. Здесь Space отмечает строку, список остаётся открытым,
// а Enter применяет сразу весь набор; счётчик в подвале держит итог на виду,
// чтобы не пересчитывать галочки глазами. Список несёт aria-multiselectable,
// а не одиночный role=option — правило доступности для множественного выбора
// в listbox.
const STYLES = `
:where([data-vibeui-block="command-012"]){
--vibeui-command-012-bg:light-dark(oklch(1 0 0),oklch(0.21 0 265));
--vibeui-command-012-fg:light-dark(oklch(0.23 0 265),oklch(0.94 0 265));
--vibeui-command-012-muted:color-mix(in oklab,var(--vibeui-command-012-fg) 68%,transparent);
--vibeui-command-012-border:light-dark(oklch(0.9 0 265),oklch(0.35 0 265));
--vibeui-command-012-accent:light-dark(oklch(0.55 0.17 265),oklch(0.76 0.14 265));
--vibeui-command-012-active:light-dark(oklch(0.55 0 265 / 10%),oklch(0.86 0 265 / 14%));
--vibeui-command-012-on-accent:oklch(from var(--vibeui-command-012-accent) clamp(0,(0.62 - l) * 100,1) 0 0);
--vibeui-command-012-shadow:light-dark(oklch(0.2 0 265 / 60%),oklch(0.04 0 265 / 70%));
--vibeui-command-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-012"]{color-scheme:dark}
[data-vibeui-block="command-012"]{
display:block;box-sizing:border-box;width:100%;max-width:24rem;overflow:hidden;
background:var(--vibeui-command-012-bg);color:var(--vibeui-command-012-fg);
border:1px solid var(--vibeui-command-012-border);border-radius:0.875rem;
box-shadow:0 18px 40px -28px var(--vibeui-command-012-shadow);
font-family:var(--vibeui-command-012-font);
}
[data-vibeui-block="command-012"] *{box-sizing:border-box}
[data-vibeui-block="command-012"] [data-part="field"]{border-bottom:1px solid var(--vibeui-command-012-border)}
[data-vibeui-block="command-012"] input{
width:100%;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;background:none;color:inherit;
font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-012"] input:focus{box-shadow:inset 0 -2px 0 0 var(--vibeui-command-012-accent)}
[data-vibeui-block="command-012"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:13rem;overflow-y:auto;
}
[data-vibeui-block="command-012"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
min-height:2.125rem;padding:0.4375rem 0.5625rem;
border-radius:0.5rem;font-size:0.875rem;cursor:pointer;
}
[data-vibeui-block="command-012"] [data-part="row"]:hover,
[data-vibeui-block="command-012"] [data-part="row"][data-active="true"]{background:var(--vibeui-command-012-active)}
/* Галочка рисуется, а не берётся из нативного checkbox: строка целиком —
   зона нажатия, а не только маленький квадрат внутри неё. */
[data-vibeui-block="command-012"] [data-part="check"]{
flex:none;width:1.125rem;height:1.125rem;box-sizing:border-box;
display:inline-flex;align-items:center;justify-content:center;
border:1.5px solid var(--vibeui-command-012-border);border-radius:0.3125rem;
font-size:0.6875rem;line-height:1;color:var(--vibeui-command-012-on-accent);
}
[data-vibeui-block="command-012"] [data-part="row"][aria-selected="true"] [data-part="check"]{
background:var(--vibeui-command-012-accent);border-color:var(--vibeui-command-012-accent);
}
[data-vibeui-block="command-012"] [data-part="empty"]{
margin:0;padding:1.125rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-012-muted);
}
[data-vibeui-block="command-012"] [data-part="foot"]{
display:flex;align-items:center;justify-content:space-between;gap:0.625rem;
padding:0.5rem 0.875rem;border-top:1px solid var(--vibeui-command-012-border);
}
[data-vibeui-block="command-012"] [data-part="count"]{font-size:0.75rem;color:var(--vibeui-command-012-muted)}
/* Подпись кнопки настраивается и переводится, поэтому высота набирается
   содержимым: фиксированная обрезала бы длинный вариант. */
[data-vibeui-block="command-012"] [data-part="apply"]{
appearance:none;border:0;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
min-height:2rem;padding:0.3125rem 0.875rem;border-radius:0.5rem;
background:var(--vibeui-command-012-accent);color:var(--vibeui-command-012-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
}
[data-vibeui-block="command-012"] [data-part="apply"]:disabled{opacity:0.45;cursor:not-allowed}
[data-vibeui-block="command-012"] [data-part="apply"]:focus-visible{
outline:2px solid var(--vibeui-command-012-accent);outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-012"] *{animation:none!important;transition:none!important}}
/* Оболочка: в потоке видна только кнопка, панель всплывает под ней в
   верхнем слое нативного popover — карточка каталога её не обрезает,
   Esc и клик мимо достаются от браузера. */
[data-vibeui-shell="command-012"]{
display:inline-flex;box-sizing:border-box;
font-family:var(--vibeui-command-012-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif);
}
:where(.dark,[data-theme="dark"]) [data-vibeui-shell="command-012"]{color-scheme:dark}
[data-vibeui-shell="command-012"] [data-part="open"]{
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
[data-vibeui-shell="command-012"] [data-part="open"]:hover{
border-color:light-dark(oklch(0.6 0 265),oklch(0.55 0 265));
}
[data-vibeui-shell="command-012"] [data-part="open"]:focus-visible{
outline:2px solid light-dark(oklch(0.24 0.015 265),oklch(0.93 0.006 265));outline-offset:2px;
}
[data-vibeui-shell="command-012"] [data-part="open"] kbd{
font:inherit;font-size:0.75rem;
padding:0.125rem 0.375rem;border-radius:0.3125rem;
border:1px solid light-dark(oklch(0.88 0 265),oklch(0.4 0 265));
color:color-mix(in oklab,currentColor 70%,transparent);
}
[data-vibeui-menu="command-012"]{
margin:auto;padding:0;border:0;background:none;overflow:visible;
width:max-content;max-width:min(92vw,34rem);
}
/* Где anchor поддержан — панель висит под кнопкой; где нет — остаётся
   по центру экрана силами самого popover. */
@supports (anchor-name: --vibeui-command-012-anchor){
[data-vibeui-shell="command-012"] [data-part="open"]{anchor-name:--vibeui-command-012-anchor}
[data-vibeui-menu="command-012"]{
position-anchor:--vibeui-command-012-anchor;
position-area:block-end span-inline-end;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block;
}
}
/* Развёрнутый режим витрины: панель стоит в потоке под кнопкой. Только пока
   popover закрыт — у открытого положение задаёт верхний слой. */
[data-vibeui-shell="command-012"]:has([data-open="true"]:not(:popover-open)){
flex-direction:column;align-items:flex-start;
}
[data-vibeui-menu="command-012"][data-open="true"]:not(:popover-open){
position:static;margin:0.375rem 0 0;
}
[data-vibeui-shell="command-012"] dialog::backdrop{
background:oklch(0 0 0 / 45%);
}

`

const DEFAULT_ITEMS = [
  "auth",
  "avatar",
  "badge",
  "banner",
  "breadcrumbs",
  "button",
  "calendar",
  "card",
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
 * Командная палитра с множественным выбором: Space копит отметки, список
 * остаётся открытым, Enter применяет весь набор разом. Один файл, ноль
 * зависимостей, собственная палитра.
 */
export function Command012({
  items = DEFAULT_ITEMS,
  defaultSelected = [],
  defaultQuery = "",
  placeholder = "Отметьте категории…",
  label = "Множественный выбор",
  listLabel = "Категории",
  applyLabel = "Применить",
  emptyText = "Ничего не нашлось. Уточните запрос.",
  countText = "Отмечено: {count}",
  onApply,
  triggerLabel = "Открыть палитру",
  defaultOpen = false,
  menuId = "vibeui-command-012-panel",
  background = "",
  accent,
  className,
  style,
  ...props
}: Command012Props) {
  const [query, setQuery] = useState(defaultQuery)
  const [selected, setSelected] = useState<string[]>(defaultSelected)
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const needle = query.trim().toLowerCase()
  const rows = useMemo(
    () =>
      needle.length === 0
        ? items
        : items.filter((item) => item.toLowerCase().includes(needle)),
    [items, needle],
  )
  const current = rows[Math.min(active, rows.length - 1)]

  const toggle = (value: string) => {
    setSelected((list) =>
      list.includes(value)
        ? list.filter((entry) => entry !== value)
        : [...list, value],
    )
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (rows.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + rows.length) % rows.length)
      return
    }

    // Пробел отмечает подсвеченную строку, не закрывая список: множественный
    // выбор должен копиться, а не завершаться первым нажатием.
    if (event.key === " ") {
      event.preventDefault()
      if (current) toggle(current)
      return
    }

    if (event.key === "Enter") {
      event.preventDefault()
      if (selected.length > 0) onApply?.(selected)
      return
    }

    if (event.key === "Escape") {
      event.preventDefault()
      setQuery("")
      setActive(0)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-command-012-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-012-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-012" precedence="medium">
        {STYLES}
      </style>
      <div data-vibeui-shell="command-012">
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
          data-vibeui-menu="command-012"
          aria-label={triggerLabel}
        >
          <div
            {...props}
            data-slot="command"
            data-vibeui-block="command-012"
            className={className}
            style={palette}
            role="dialog"
            aria-label={label}
          >
            <div data-part="field">
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
              <p data-part="empty">{emptyText}</p>
            ) : (
              <ul
                id={listId}
                data-part="list"
                role="listbox"
                aria-multiselectable="true"
                aria-label={listLabel}
              >
                {rows.map((row, index) => (
                  <li
                    key={row}
                    id={`${rowId}-${index}`}
                    data-part="row"
                    role="option"
                    aria-selected={selected.includes(row)}
                    data-active={current === row}
                    onClick={() => {
                      setActive(index)
                      toggle(row)
                    }}
                  >
                    <span data-part="check" aria-hidden="true">
                      {selected.includes(row) ? "✓" : ""}
                    </span>
                    {row}
                  </li>
                ))}
              </ul>
            )}
            <div data-part="foot">
              <span data-part="count" role="status">
                {countText.replace("{count}", String(selected.length))}
              </span>
              <button
                type="button"
                data-part="apply"
                disabled={selected.length === 0}
                onClick={() => onApply?.(selected)}
              >
                {applyLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
