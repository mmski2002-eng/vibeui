"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command001Command = {
  label: string
  group: string
  keys?: string
}

export type Command001Props = Omit<ComponentProps<"div">, "children"> & {
  commands?: Command001Command[]
  placeholder?: string
  triggerLabel?: string
  /** Ответ на пустой поиск: компонент несёт русский, проект подставляет свой. */
  emptyText?: string
  /** Открыть панель сразу и без модального режима: она остаётся внутри блока. */
  defaultOpen?: boolean
  /** Подложка кнопки и модалки. Пусто — цвет по умолчанию из палитры. */
  background?: string
  accent?: string
}

// Идея компонента: командная палитра в нативном <dialog>. Модалка даёт ловушку
// фокуса, закрытие по Escape и фон — три вещи, которые в своей реализации
// приходится чинить дольше всего. Стрелки двигают подсветку по отфильтрованному
// списку, поэтому индекс хранится по строке, а не по позиции в исходном массиве.
//
// Тема берётся из color-scheme окружения через light-dark(): у модалки светлоты
// границ и подсветки свои в каждой ветке, а не зеркальные.
const STYLES = `
:where([data-vibeui-block="command-001"]){
--vibeui-command-001-bg:light-dark(oklch(1 0 0),oklch(0.22 0 265));
--vibeui-command-001-fg:light-dark(oklch(0.24 0 265),oklch(0.93 0 265));
--vibeui-command-001-muted:color-mix(in oklab,var(--vibeui-command-001-fg) 68%,transparent);
--vibeui-command-001-border:light-dark(oklch(0.9 0 265),oklch(0.36 0 265));
--vibeui-command-001-active:light-dark(oklch(0.55 0 265 / 10%),oklch(0.86 0 265 / 14%));
--vibeui-command-001-accent:light-dark(oklch(0.55 0.2 39.8),oklch(0.74 0.16 39.8));
--vibeui-command-001-shadow:light-dark(oklch(0.2 0 265 / 55%),oklch(0.04 0 265 / 72%));
--vibeui-command-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-001"]{color-scheme:dark}
[data-vibeui-block="command-001"] [data-part="open"]{
display:inline-flex;align-items:center;gap:0.625rem;
appearance:none;cursor:pointer;
height:2.25rem;padding:0 0.5rem 0 0.75rem;
background:var(--vibeui-command-001-bg);color:var(--vibeui-command-001-muted);
border:1px solid var(--vibeui-command-001-border);border-radius:0.625rem;
font-family:var(--vibeui-command-001-font);font-size:0.8125rem;
}
[data-vibeui-block="command-001"] [data-part="open"]:hover{color:var(--vibeui-command-001-fg)}
[data-vibeui-block="command-001"] [data-part="open"]:focus-visible{outline:2px solid var(--vibeui-command-001-accent);outline-offset:2px}
[data-vibeui-block="command-001"] kbd{
border:1px solid var(--vibeui-command-001-border);border-bottom-width:2px;border-radius:0.3125rem;
padding:0 0.3125rem;font:inherit;font-size:0.6875rem;
}
[data-vibeui-block="command-001"] dialog{
width:min(28rem,calc(100vw - 2rem));padding:0;margin:12vh auto auto;
background:var(--vibeui-command-001-bg);color:var(--vibeui-command-001-fg);
border:1px solid var(--vibeui-command-001-border);border-radius:0.875rem;
box-shadow:0 24px 60px -24px var(--vibeui-command-001-shadow);
font-family:var(--vibeui-command-001-font);
}
/* Затемнение живёт в top layer и до переменных корня не всегда дотягивается,
   поэтому цвет записан прямо: полупрозрачный скрим уместен в обеих темах. */
[data-vibeui-block="command-001"] dialog::backdrop{background:oklch(0.2 0 265 / 45%)}
[data-vibeui-block="command-001"] [data-part="search"]{
width:100%;box-sizing:border-box;height:2.875rem;padding:0 0.875rem;
appearance:none;border:0;border-bottom:1px solid var(--vibeui-command-001-border);
background:none;color:inherit;font:inherit;font-size:0.9375rem;outline:none;
}
[data-vibeui-block="command-001"] [data-part="list"]{
list-style:none;margin:0;padding:0.3125rem;max-height:16rem;overflow-y:auto;
}
[data-vibeui-block="command-001"] [data-part="list"] [data-part="list"]{padding:0;max-height:none;overflow:visible}
[data-vibeui-block="command-001"] [data-part="group"]{
padding:0.5rem 0.5625rem 0.25rem;font-size:0.6875rem;letter-spacing:0.04em;
text-transform:uppercase;color:var(--vibeui-command-001-muted);
}
[data-vibeui-block="command-001"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;box-sizing:border-box;min-height:2.125rem;padding:0 0.5625rem;
border:0;border-radius:0.4375rem;background:none;cursor:pointer;
font:inherit;font-size:0.875rem;color:inherit;text-align:left;
}
/* Подсветка стрелками и наведением — один и тот же фон: две подсветки путают. */
[data-vibeui-block="command-001"] [data-part="row"]:hover,
[data-vibeui-block="command-001"] [data-part="row"][data-active="true"]{background:var(--vibeui-command-001-active)}
[data-vibeui-block="command-001"] [data-part="row"] span{font-size:0.75rem;color:var(--vibeui-command-001-muted)}
[data-vibeui-block="command-001"] [data-part="empty"]{padding:1.25rem 0.875rem;font-size:0.875rem;color:var(--vibeui-command-001-muted)}
/* Немодальный показ: панель остаётся внутри блока, а не уходит в верхний
   слой поверх страницы. Так её показывают на витрине и в документации. */
[data-vibeui-block="command-001"]:has(dialog:not(:modal)[open]){
display:block;position:relative;width:100%;min-height:22rem;
}
[data-vibeui-block="command-001"] dialog:not(:modal){position:absolute;max-width:100%;max-height:100%;z-index:1}
[data-vibeui-block="command-001"]:has(dialog:not(:modal)[open]) [data-part="open"]{display:none}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS: Command001Command[] = [
  { label: "Создать компонент", group: "Действия", keys: "Ctrl+N" },
  { label: "Собрать registry", group: "Действия" },
  { label: "Открыть каталог", group: "Переход", keys: "G C" },
  { label: "Открыть блоки", group: "Переход", keys: "G B" },
  { label: "Настройки проекта", group: "Переход" },
  { label: "Переключить тему", group: "Вид", keys: "Ctrl+Shift+L" },
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
 * Командная палитра в нативном <dialog>: фокус, Escape и фон от браузера.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Command001({
  commands = DEFAULT_COMMANDS,
  placeholder = "Команда или переход…",
  triggerLabel = "Поиск команды",
  emptyText = "Ничего не нашлось. Проверьте формулировку.",
  defaultOpen = false,
  background = "",
  accent,
  className,
  style,
  ...props
}: Command001Props) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!defaultOpen) {
      return
    }

    const active = document.activeElement

    // show() вместо showModal(): немодальная панель живёт внутри своего блока
    // и не уводит страницу в верхний слой. Витрине нужна именно такая.
    dialog.current?.show()

    // show() уводит фокус внутрь панели. Для немодального показа это лишнее:
    // страница не должна прыгать к панели просто потому, что та открыта.
    if (active instanceof HTMLElement && active !== document.body) {
      active.focus()
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
  }, [defaultOpen])

  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const listId = useId()
  const rowId = useId()

  const found = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const groups = found.reduce<Record<string, Command001Command[]>>(
    (acc, command) => {
      acc[command.group] = acc[command.group]
        ? [...acc[command.group], command]
        : [command]
      return acc
    },
    {},
  )
  // Стрелки идут по тому порядку, который видит глаз, а не по исходному массиву.
  const ordered = Object.values(groups).flat()
  const current = ordered[Math.min(active, ordered.length - 1)]

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (ordered.length === 0) return
      const step = event.key === "ArrowDown" ? 1 : -1
      setActive((index) => (index + step + ordered.length) % ordered.length)
      return
    }

    // Enter запускает подсвеченную строку: без него стрелки двигают подсветку,
    // которая ничем не заканчивается, — фокус остаётся в поле ввода.
    if (event.key === "Enter" && current) {
      event.preventDefault()
      dialog.current?.close()
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-command-001-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-command-001-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="command"
        data-vibeui-block="command-001"
        className={className}
        style={palette}
      >
        <button
          type="button"
          data-part="open"
          onClick={() => {
            setQuery("")
            setActive(0)
            dialog.current?.showModal()
          }}
        >
          {triggerLabel}
          <kbd>Ctrl+K</kbd>
        </button>
        {/* Клик по подложке закрывает панель: нативный <dialog> сам этого
            не делает, а модалка без выхода мышью — ловушка. */}
        <dialog
          ref={dialog}
          aria-label={triggerLabel}
          onClick={(event) => {
            if (event.target === dialog.current) {
              dialog.current?.close()
            }
          }}
        >
          <div onKeyDown={move}>
            <input
              data-part="search"
              type="search"
              role="combobox"
              aria-expanded={ordered.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                current ? `${rowId}-${ordered.indexOf(current)}` : undefined
              }
              value={query}
              placeholder={placeholder}
              aria-label={placeholder}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
            />
            {found.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              <ul
                id={listId}
                data-part="list"
                role="listbox"
                aria-label={triggerLabel}
              >
                {Object.entries(groups).map(([group, rows]) => (
                  <li key={group} role="presentation">
                    <p data-part="group">{group}</p>
                    <ul data-part="list" role="group" aria-label={group}>
                      {rows.map((command) => (
                        <li key={command.label} role="presentation">
                          <button
                            type="button"
                            id={`${rowId}-${ordered.indexOf(command)}`}
                            data-part="row"
                            role="option"
                            aria-selected={current?.label === command.label}
                            data-active={current?.label === command.label}
                            onClick={() => dialog.current?.close()}
                          >
                            {command.label}
                            {command.keys ? <span>{command.keys}</span> : null}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </dialog>
      </div>
    </>
  )
}
