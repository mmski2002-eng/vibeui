"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown011Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  placeholder?: string
  options?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: широкая кнопка-поле, у которой меню повторяет её ширину, а
// сверху стоит поиск. Список из тридцати проектов пролистывают дольше, чем
// набирают три буквы; поиск включается сам, потому что фокус после открытия
// уходит в поле. Ширину меню задаёт anchor-size(width) — она обязана совпасть
// с кнопкой, иначе выпадающий список выглядит чужим элементом.
const STYLES = `
:where([data-vibeui-block="dropdown-011"]){
--vibeui-dropdown-011-bg:oklch(1 0 0);
--vibeui-dropdown-011-fg:oklch(0.24 0.014 265);
--vibeui-dropdown-011-muted:oklch(0.56 0.014 265);
--vibeui-dropdown-011-border:oklch(0.9 0.006 265);
--vibeui-dropdown-011-hover:oklch(0.96 0.004 265);
--vibeui-dropdown-011-accent:oklch(0.55 0.19 265);
--vibeui-dropdown-011-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
box-shadow:0 20px 44px -24px oklch(0.2 0.03 265 / 50%);
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
  label = "Проект",
  placeholder = "Поиск по названию",
  options = DEFAULT_OPTIONS,
  onChange,
  accent,
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
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-011" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
          popover="auto"
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
              <p data-part="empty">Ничего не найдено</p>
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
