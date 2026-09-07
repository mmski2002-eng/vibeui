"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Command015Command = {
  label: string
  /** Правая подпись строки: горячая клавиша или раздел. */
  hint?: string
}

export type Command015Props = Omit<ComponentProps<"div">, "children"> & {
  commands?: Command015Command[]
  /** Подпись кнопки, из которой распускается панель. */
  triggerLabel?: string
  placeholder?: string
  /** Ответ на пустой поиск: компонент несёт русский, проект подставляет свой. */
  emptyText?: string
  /** Раскрыть панель сразу: так её снимают для витрины. */
  defaultOpen?: boolean
  accent?: string
  /** Пусто — подложки нет, компонент ложится на фон страницы. */
  background?: string
}

// Идея компонента: палитра команд без модалки. Панель не накрывает страницу и
// не уходит в top layer, а распускается прямо под кнопкой и раздвигает поток —
// такую можно поставить в сайдбар, в карточку или в панель инструментов, где
// затемнение всей страницы ради трёх команд выглядит несоразмерно.
//
// Раскрытие держится на grid-template-rows: 0fr → 1fr. Это единственный способ
// анимировать высоту неизвестного содержимого без замера в JS, а пружина на
// нём даёт тот самый «распускающийся» перелёт.
const STYLES = `
:where([data-vibeui-block="command-015"]){
--vibeui-command-015-bg:transparent;
--vibeui-command-015-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-command-015-muted:color-mix(in oklab,var(--vibeui-command-015-fg) 62%,transparent);
--vibeui-command-015-border:light-dark(oklch(0 0 0 / 13%),oklch(1 0 0 / 14%));
--vibeui-command-015-card:light-dark(oklch(0.955 0 0),oklch(0.2178 0 0));
--vibeui-command-015-accent:light-dark(oklch(0.64 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-command-015-accent-text:light-dark(oklch(0.55 0.2144 39.8),oklch(0.6803 0.2144 39.8));
--vibeui-command-015-hover:color-mix(in oklab,var(--vibeui-command-015-fg) 8%,transparent);
--vibeui-command-015-ease:linear(0,0.138,0.389,0.621,0.792,0.901,0.963,0.994,1.006,1.009,1.008,1.006,1.003,1.002,1.001,1);
--vibeui-command-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="command-015"]{color-scheme:dark}
[data-vibeui-block="command-015"]{
display:flex;flex-direction:column;gap:0.375rem;
width:100%;max-width:22rem;box-sizing:border-box;
background:var(--vibeui-command-015-bg);color:var(--vibeui-command-015-fg);
font-family:var(--vibeui-command-015-font);
}
[data-vibeui-block="command-015"] *{box-sizing:border-box}
[data-vibeui-block="command-015"] [data-part="trigger"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
min-height:2.5rem;padding:0.375rem 0.625rem 0.375rem 0.75rem;
appearance:none;cursor:pointer;text-align:left;
border:1px solid var(--vibeui-command-015-border);border-radius:0.75rem;
background:var(--vibeui-command-015-card);color:var(--vibeui-command-015-fg);
font:inherit;font-size:0.8125rem;
transition:border-color .25s ease,transform .35s cubic-bezier(.22,1.2,.36,1);
transition:border-color .25s ease,transform .35s var(--vibeui-command-015-ease);
}
[data-vibeui-block="command-015"] [data-part="trigger"] svg{width:1rem;height:1rem;flex:none;color:var(--vibeui-command-015-accent-text)}
[data-vibeui-block="command-015"] [data-part="trigger"] kbd{
margin-left:auto;padding:0.0625rem 0.3125rem;
border:1px solid var(--vibeui-command-015-border);border-radius:0.3125rem;
color:var(--vibeui-command-015-muted);font:inherit;font-size:0.6875rem;
}
[data-vibeui-block="command-015"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-command-015-accent);outline-offset:2px}
/* Кнопка приподнимается на пару пикселей: раскрытая панель должна читаться
   как продолжение кнопки, а не как всплывшая рядом карточка. */
[data-vibeui-block="command-015"][data-open="true"] [data-part="trigger"]{
border-color:color-mix(in oklab,var(--vibeui-command-015-accent) 55%,var(--vibeui-command-015-border));
transform:translateY(-2px);
}
[data-vibeui-block="command-015"] [data-part="reveal"]{
display:grid;grid-template-rows:0fr;
transition:grid-template-rows .5s cubic-bezier(.22,1.2,.36,1);
transition:grid-template-rows .5s var(--vibeui-command-015-ease);
}
[data-vibeui-block="command-015"][data-open="true"] [data-part="reveal"]{grid-template-rows:1fr}
[data-vibeui-block="command-015"] [data-part="clip"]{overflow:hidden;min-height:0}
/* Скрытая панель убрана через visibility, а не через overflow: иначе поле
   ввода и строки остаются в порядке обхода табом при закрытом меню. */
[data-vibeui-block="command-015"] [data-part="panel"]{
display:flex;flex-direction:column;gap:0.25rem;padding:0.375rem;
border:1px solid var(--vibeui-command-015-border);border-radius:0.875rem;
background:var(--vibeui-command-015-card);
opacity:0;visibility:hidden;transform:scale(0.97);transform-origin:top center;
transition:opacity .24s ease,transform .5s cubic-bezier(.22,1.2,.36,1),visibility 0s linear .5s;
transition:opacity .24s ease,transform .5s var(--vibeui-command-015-ease),visibility 0s linear .5s;
}
[data-vibeui-block="command-015"][data-open="true"] [data-part="panel"]{
opacity:1;visibility:visible;transform:scale(1);
transition:opacity .24s ease,transform .5s cubic-bezier(.22,1.2,.36,1),visibility 0s;
transition:opacity .24s ease,transform .5s var(--vibeui-command-015-ease),visibility 0s;
}
[data-vibeui-block="command-015"] [data-part="search"]{
width:100%;height:2rem;padding:0 0.5rem;margin-bottom:0.125rem;
appearance:none;background:none;color:inherit;font:inherit;font-size:0.8125rem;
border:0;border-bottom:1px solid var(--vibeui-command-015-border);outline:none;
}
[data-vibeui-block="command-015"] [data-part="search"]:focus-visible{border-bottom-color:var(--vibeui-command-015-accent)}
[data-vibeui-block="command-015"] [data-part="list"]{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:0.125rem}
/* Стаггер строк: каждая едет вверх со своей задержкой, поэтому список
   читается как разворачивающийся, а не как разом подставленный. */
[data-vibeui-block="command-015"] [data-part="row"]{
display:flex;align-items:center;gap:0.5rem;width:100%;
min-height:1.875rem;padding:0 0.5rem;
appearance:none;border:0;border-radius:0.5rem;cursor:pointer;
background:none;color:var(--vibeui-command-015-muted);
font:inherit;font-size:0.8125rem;text-align:left;
opacity:0;transform:translateY(-0.4375rem);
transition:opacity .25s ease,transform .4s cubic-bezier(.22,1.2,.36,1),background-color .2s ease,color .2s ease;
transition:opacity .25s ease,transform .4s var(--vibeui-command-015-ease),background-color .2s ease,color .2s ease;
}
[data-vibeui-block="command-015"] [data-part="row"] svg{width:0.9375rem;height:0.9375rem;flex:none;color:var(--vibeui-command-015-accent-text)}
[data-vibeui-block="command-015"] [data-part="row"] span{margin-left:auto;font-size:0.6875rem;color:var(--vibeui-command-015-muted)}
[data-vibeui-block="command-015"] [data-part="row"]:hover,
[data-vibeui-block="command-015"] [data-part="row"][data-active="true"]{
background:var(--vibeui-command-015-hover);color:var(--vibeui-command-015-fg);
}
[data-vibeui-block="command-015"] [data-part="row"]:focus-visible{outline:2px solid var(--vibeui-command-015-accent);outline-offset:-2px}
[data-vibeui-block="command-015"][data-open="true"] [data-part="row"]{
opacity:1;transform:translateY(0);
transition-delay:calc(var(--vibeui-command-015-index) * 55ms);
}
[data-vibeui-block="command-015"] [data-part="empty"]{margin:0;padding:0.75rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-command-015-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="command-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COMMANDS: Command015Command[] = [
  { label: "Поделиться видом", hint: "S" },
  { label: "Дублировать холст", hint: "D" },
  { label: "Скопировать ссылку", hint: "L" },
]

/** Иконки строк по порядку: стрелка, ромб, молния, точка. */
const ROW_ICONS = [
  "M7 17 17 7m0 0H9m8 0v8",
  "m12 4 8 8-8 8-8-8 8-8Z",
  "M13 3 5 14h6l-2 7 8-11h-6l2-7Z",
  "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z",
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
 * Палитра команд, распускающаяся из кнопки: поиск, стаггер строк, стрелки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Command015({
  commands = DEFAULT_COMMANDS,
  triggerLabel = "Открыть действия",
  placeholder = "Найти команду…",
  emptyText = "Ничего не нашлось. Проверьте формулировку.",
  defaultOpen = false,
  accent,
  background = "",
  className,
  style,
  ...props
}: Command015Props) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const search = useRef<HTMLInputElement>(null)
  // Фокус переносится в поле только после клика по кнопке. Открытая по
  // defaultOpen панель не должна утаскивать фокус со страницы при монтировании.
  const focusOnOpen = useRef(false)
  const panelId = useId()
  const listId = useId()
  const rowId = useId()

  useEffect(() => {
    if (!open) {
      return
    }

    if (focusOnOpen.current) {
      focusOnOpen.current = false
      search.current?.focus()
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("pointerdown", onPointerDown)

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [open])

  const found = commands.filter((command) =>
    command.label.toLowerCase().includes(query.trim().toLowerCase()),
  )
  const current = found[Math.min(active, found.length - 1)]

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }

  const move = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()

      if (found.length === 0) {
        return
      }

      const step = event.key === "ArrowDown" ? 1 : -1

      setActive((index) => (index + step + found.length) % found.length)
      return
    }

    // Enter запускает подсвеченную строку: иначе стрелки двигают подсветку,
    // которая ничем не заканчивается, — фокус остаётся в поле ввода.
    if (event.key === "Enter" && current) {
      event.preventDefault()
      close()
    }
  }

  const palette = {
    ...(accent
      ? {
          "--vibeui-command-015-accent": accent,
          "--vibeui-command-015-accent-text": accent,
        }
      : null),
    ...(background
      ? {
          "--vibeui-command-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-command-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        ref={root}
        data-slot="command"
        data-vibeui-block="command-015"
        data-open={open}
        className={className}
        style={palette}
      >
        <button
          type="button"
          ref={trigger}
          data-part="trigger"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setQuery("")
            setActive(0)
            focusOnOpen.current = !open
            setOpen((previous) => !previous)
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z" />
          </svg>
          {triggerLabel}
          <kbd>K</kbd>
        </button>
        <div data-part="reveal">
          <div data-part="clip">
            <div id={panelId} data-part="panel" onKeyDown={move}>
              <input
                ref={search}
                data-part="search"
                type="text"
                role="combobox"
                aria-expanded={open}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={
                  current ? `${rowId}-${found.indexOf(current)}` : undefined
                }
                aria-label={placeholder}
                placeholder={placeholder}
                value={query}
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
                  {found.map((command, index) => (
                    <li key={command.label} role="presentation">
                      <button
                        type="button"
                        id={`${rowId}-${index}`}
                        data-part="row"
                        role="option"
                        aria-selected={current?.label === command.label}
                        data-active={current?.label === command.label}
                        tabIndex={open ? 0 : -1}
                        onClick={close}
                        style={
                          {
                            "--vibeui-command-015-index": String(index),
                          } as CSSProperties
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d={ROW_ICONS[index % ROW_ICONS.length]} />
                        </svg>
                        {command.label}
                        {command.hint ? <span>{command.hint}</span> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
