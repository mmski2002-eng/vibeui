"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown011Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  label?: string
  placeholder?: string
  options?: string[]
  onChange?: (value: string) => void
  /** Строка на месте пустой выборки. */
  emptyText?: string
  accent?: string
  /** Подложка поля и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: широкая кнопка-поле, у которой меню повторяет её ширину, а
// сверху стоит поиск. Список из тридцати проектов пролистывают дольше, чем
// набирают три буквы; поиск включается сам, потому что фокус после открытия
// уходит в поле. Ширину меню задаёт anchor-size(width) — она обязана совпасть
// с кнопкой, иначе выпадающий список выглядит чужим элементом.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте поле светлее фона страницы, а его граница светлее поля.
const STYLES = `
:where([data-vibeui-block="dropdown-011"]){
--vibeui-dropdown-011-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-011-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-011-muted:color-mix(in oklab,var(--vibeui-dropdown-011-fg) 68%,transparent);
--vibeui-dropdown-011-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-011-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-dropdown-011-accent:light-dark(oklch(0.55 0.19 265),oklch(0.75 0.15 265));
--vibeui-dropdown-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-011"]{color-scheme:dark}
[data-vibeui-block="dropdown-011"]{
display:flex;flex-direction:column;gap:0.3125rem;
width:100%;max-width:20rem;box-sizing:border-box;padding:0.75rem;
background:var(--vibeui-dropdown-011-bg);
border:1px solid var(--vibeui-dropdown-011-border);border-radius:1rem;
font-family:var(--vibeui-dropdown-011-font);color:var(--vibeui-dropdown-011-fg);
}
[data-vibeui-block="dropdown-011"] [data-part="label"]{
font-size:0.75rem;font-weight:600;color:var(--vibeui-dropdown-011-muted);
}
[data-vibeui-block="dropdown-011"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:flex;align-items:center;justify-content:space-between;gap:0.5rem;
width:100%;height:2.5rem;padding:0 0.75rem;box-sizing:border-box;
border:1px solid var(--vibeui-dropdown-011-border);border-radius:0.75rem;
background:var(--vibeui-dropdown-011-bg);color:var(--vibeui-dropdown-011-fg);
font:inherit;font-size:0.875rem;text-align:left;
anchor-name:--vibeui-dropdown-011-anchor;
transition:border-color .16s ease;
}
[data-vibeui-block="dropdown-011"] [data-part="trigger"]:hover{border-color:var(--vibeui-dropdown-011-muted)}
[data-vibeui-block="dropdown-011"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-011-accent);outline-offset:2px}
[data-vibeui-block="dropdown-011"] [data-part="caret"]{
width:0.375rem;height:0.375rem;flex:none;
border-right:1.5px solid var(--vibeui-dropdown-011-muted);
border-bottom:1.5px solid var(--vibeui-dropdown-011-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-block="dropdown-011"] [data-part="menu"]{
position:fixed;padding:0.375rem;min-width:16rem;box-sizing:border-box;
background:var(--vibeui-dropdown-011-bg);color:var(--vibeui-dropdown-011-fg);
border:1px solid var(--vibeui-dropdown-011-border);border-radius:0.75rem;
box-shadow:0 20px 44px -24px oklch(0.2 0 265 / 50%);
font-family:var(--vibeui-dropdown-011-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-011"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-011"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
/* Ширина меню равна ширине кнопки: список уже кнопки выглядит чужим. */
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-011"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-011-anchor;
position-area:bottom span-right;margin:0.3125rem 0 0;
width:anchor-size(width);min-width:0;
position-try-fallbacks:flip-block;
}
}
[data-vibeui-block="dropdown-011"] [data-part="search"]{
width:100%;height:2rem;padding:0 0.5625rem;box-sizing:border-box;margin-bottom:0.3125rem;
border:1px solid var(--vibeui-dropdown-011-border);border-radius:0.5rem;
background:var(--vibeui-dropdown-011-bg);color:inherit;font:inherit;font-size:0.8125rem;
}
[data-vibeui-block="dropdown-011"] [data-part="search"]:focus-visible{outline:2px solid var(--vibeui-dropdown-011-accent);outline-offset:-1px}
[data-vibeui-block="dropdown-011"] [data-part="list"]{max-height:11rem;overflow:auto}
[data-vibeui-block="dropdown-011"] [data-part="item"]{
display:flex;align-items:center;gap:0.5rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-011"] [data-part="item"]:hover{background:var(--vibeui-dropdown-011-hover)}
[data-vibeui-block="dropdown-011"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-011-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-011"] [data-part="item"][aria-checked="true"]{font-weight:650}
[data-vibeui-block="dropdown-011"] [data-part="tick"]{
margin-left:auto;width:0.9375rem;height:0.9375rem;flex:none;
color:var(--vibeui-dropdown-011-accent);opacity:0;
}
[data-vibeui-block="dropdown-011"] [data-part="item"][aria-checked="true"] [data-part="tick"]{opacity:1}
[data-vibeui-block="dropdown-011"] [data-part="empty"]{
padding:0.75rem 0.5rem;font-size:0.8125rem;color:var(--vibeui-dropdown-011-muted);text-align:center;
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-011"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-011"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_OPTIONS = [
  "Витрина компонентов",
  "Внутренний портал",
  "Мобильное приложение",
  "Сайт конференции",
  "Дизайн-система",
  "Документация API",
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

function stepFocus(list: HTMLElement | null, delta: number) {
  if (!list) {
    return
  }

  const items = Array.from(
    list.querySelectorAll<HTMLElement>('[data-part="item"]'),
  )

  if (items.length === 0) {
    return
  }

  const from = items.indexOf(document.activeElement as HTMLElement)
  items[(from + delta + items.length) % items.length].focus()
}

/**
 * Широкая кнопка-поле с поиском внутри меню: ширина списка равна ширине кнопки.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown011({
  open = false,
  label = "Проект",
  placeholder = "Поиск по названию",
  options = DEFAULT_OPTIONS,
  onChange,
  emptyText = "Ничего не найдено",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown011Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [picked, setPicked] = useState(options[0])

  const shown = options.filter((option) =>
    option.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const palette = {
    ...(accent ? { "--vibeui-dropdown-011-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-011-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-011"
        className={className}
        style={palette}
      >
        <span data-part="label" id={`${id}-label`}>
          {label}
        </span>
        <button
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-labelledby={`${id}-label ${id}-value`}
        >
          <span id={`${id}-value`}>{picked}</span>
          <span data-part="caret" aria-hidden="true" />
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={label}
          data-part="menu"
          onToggle={() => {
            setQuery("")
            requestAnimationFrame(() => {
              if (menu.current?.matches(":popover-open")) {
                search.current?.focus()
              }
            })
          }}
          onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              stepFocus(menu.current, 1)
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              stepFocus(menu.current, -1)
            }
          }}
        >
          <input
            ref={search}
            data-part="search"
            type="search"
            value={query}
            placeholder={placeholder}
            aria-label={placeholder}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div data-part="list">
            {shown.length === 0 ? (
              <p data-part="empty">{emptyText}</p>
            ) : (
              shown.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={picked === option}
                  data-part="item"
                  onClick={() => {
                    setPicked(option)
                    onChange?.(option)
                    menu.current?.hidePopover()
                  }}
                >
                  {option}
                  <svg
                    data-part="tick"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
