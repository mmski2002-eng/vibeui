"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown004Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  trigger?: string
  mark?: "check" | "dot"
  columns?: string[]
  initial?: string[]
  accent?: string
}

// Идея компонента: меню-переключатели. Отличие от обычного списка команд в
// том, что нажатие не закрывает меню: колонки таблицы включают пачкой, и
// захлопывающийся список заставил бы открыть его пять раз. Состояние видно
// дважды — галочкой в строке и счётчиком в кнопке, потому что после закрытия
// меню счётчик остаётся единственным следом выбора.
const STYLES = `
:where([data-vibeui-block="dropdown-004"]){
--vibeui-dropdown-004-bg:oklch(1 0 0);
--vibeui-dropdown-004-fg:oklch(0.24 0.014 250);
--vibeui-dropdown-004-muted:oklch(0.56 0.014 250);
--vibeui-dropdown-004-border:oklch(0.9 0.006 250);
--vibeui-dropdown-004-hover:oklch(0.96 0.004 250);
--vibeui-dropdown-004-accent:oklch(0.58 0.15 200);
--vibeui-dropdown-004-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dropdown-004"]{
display:inline-flex;flex-direction:column;gap:0.375rem;
box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-dropdown-004-bg);color:var(--vibeui-dropdown-004-fg);
border:1px solid var(--vibeui-dropdown-004-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-004-font);
}
[data-vibeui-block="dropdown-004"] [data-part="caption"]{
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-004-muted);
}
[data-vibeui-block="dropdown-004"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.125rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dropdown-004-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-004-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-004-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-004"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-004-hover)}
[data-vibeui-block="dropdown-004"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-004-accent);outline-offset:2px}
[data-vibeui-block="dropdown-004"] [data-part="count"]{
display:inline-flex;align-items:center;justify-content:center;
min-width:1.25rem;height:1.25rem;padding:0 0.3125rem;box-sizing:border-box;
border-radius:9999px;font-size:0.6875rem;font-weight:700;
background:color-mix(in oklab,var(--vibeui-dropdown-004-accent) 16%,transparent);
color:var(--vibeui-dropdown-004-accent);
}
[data-vibeui-block="dropdown-004"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:13.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-004-bg);color:var(--vibeui-dropdown-004-fg);
border:1px solid var(--vibeui-dropdown-004-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 250 / 45%);
font-family:var(--vibeui-dropdown-004-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-004"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-004"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-004"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-004-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-004"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-004"] [data-part="item"]:hover{background:var(--vibeui-dropdown-004-hover)}
[data-vibeui-block="dropdown-004"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-004-accent);outline-offset:-2px}
/* Отметка занимает место всегда: иначе строки прыгают при переключении. */
[data-vibeui-block="dropdown-004"] [data-part="box"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.0625rem;height:1.0625rem;box-sizing:border-box;
border:1.5px solid var(--vibeui-dropdown-004-border);border-radius:0.3125rem;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="dropdown-004"] [data-part="item"][aria-checked="true"] [data-part="box"]{
background:var(--vibeui-dropdown-004-accent);border-color:var(--vibeui-dropdown-004-accent);
}
[data-vibeui-block="dropdown-004"] [data-part="box"] svg{width:0.75rem;height:0.75rem;opacity:0}
[data-vibeui-block="dropdown-004"] [data-part="item"][aria-checked="true"] [data-part="box"] svg{opacity:1;color:oklch(1 0 0)}
[data-vibeui-block="dropdown-004"][data-mark="dot"] [data-part="box"]{border-radius:9999px}
[data-vibeui-block="dropdown-004"][data-mark="dot"] [data-part="box"] svg{display:none}
[data-vibeui-block="dropdown-004"][data-mark="dot"] [data-part="item"][aria-checked="true"] [data-part="box"]{
box-shadow:inset 0 0 0 3px var(--vibeui-dropdown-004-bg);
}
[data-vibeui-block="dropdown-004"] [data-part="foot"]{
display:flex;justify-content:space-between;align-items:center;gap:0.75rem;
margin-top:0.3125rem;padding:0.4375rem 0.5rem 0.1875rem;
border-top:1px solid var(--vibeui-dropdown-004-border);
font-size:0.75rem;color:var(--vibeui-dropdown-004-muted);
}
[data-vibeui-block="dropdown-004"] [data-part="reset"]{
appearance:none;border:0;background:none;cursor:pointer;padding:0;
font:inherit;font-size:0.75rem;font-weight:600;color:var(--vibeui-dropdown-004-accent);
}
[data-vibeui-block="dropdown-004"] [data-part="reset"]:focus-visible{outline:2px solid var(--vibeui-dropdown-004-accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-004"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COLUMNS = ["Статус", "Автор", "Обновлён", "Приоритет", "Метки"]
const DEFAULT_INITIAL = ["Статус", "Обновлён"]

function stepFocus(menu: HTMLElement | null, delta: number) {
  if (!menu) {
    return
  }

  const items = Array.from(
    menu.querySelectorAll<HTMLElement>('[data-part="item"]'),
  )

  if (items.length === 0) {
    return
  }

  const from = items.indexOf(document.activeElement as HTMLElement)
  items[(from + delta + items.length) % items.length].focus()
}

/**
 * Меню-переключатели: меню не закрывается при нажатии, счётчик живёт в кнопке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown004({
  trigger = "Колонки",
  mark = "check",
  columns = DEFAULT_COLUMNS,
  initial = DEFAULT_INITIAL,
  accent,
  className,
  style,
  ...props
}: Dropdown004Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState<string[]>(initial)

  const toggle = (column: string) =>
    setOn((current) =>
      current.includes(column)
        ? current.filter((entry) => entry !== column)
        : [...current, column],
    )

  const palette = {
    ...(accent ? { "--vibeui-dropdown-004-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-004" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="dropdown-004"
        data-mark={mark}
        className={className}
        style={palette}
      >
        <span data-part="caption">Таблица задач</span>
        <button
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              const node = menu.current

              if (node) {
                if (!node.matches(":popover-open")) {
                  node.showPopover()
                }

                requestAnimationFrame(() =>
                  node
                    .querySelector<HTMLElement>('[data-part="item"]')
                    ?.focus(),
                )
              }
            }
          }}
        >
          {trigger}
          <span data-part="count">{on.length}</span>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover="auto"
          role="menu"
          aria-label={trigger}
          data-part="menu"
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
          {columns.map((column) => (
            <button
              key={column}
              type="button"
              role="menuitemcheckbox"
              aria-checked={on.includes(column)}
              data-part="item"
              onClick={() => toggle(column)}
            >
              <span data-part="box" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {column}
            </button>
          ))}
          <div data-part="foot">
            <span>
              Показано {on.length} из {columns.length}
            </span>
            <button
              type="button"
              data-part="reset"
              onClick={() => setOn(initial)}
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
