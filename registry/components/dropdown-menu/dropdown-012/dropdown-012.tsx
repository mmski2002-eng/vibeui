"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown012Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  actionLabel?: string
  rows?: string[]
  accent?: string
}

// Идея компонента: меню массовых действий над таблицей. Оно живёт в шапке
// выделения и знает, сколько строк выбрано: «удалить» без числа — это ловушка.
// Пока не выбрано ничего, кнопка выключена, а не спрятана: исчезающий элемент
// сдвигает шапку и заставляет искать его заново. Пункт «переименовать» помечен
// aria-disabled, потому что имя есть у одной строки, а не у трёх сразу.
const STYLES = `
:where([data-vibeui-block="dropdown-012"]){
--vibeui-dropdown-012-bg:oklch(1 0 0);
--vibeui-dropdown-012-fg:oklch(0.24 0.014 265);
--vibeui-dropdown-012-muted:oklch(0.56 0.014 265);
--vibeui-dropdown-012-border:oklch(0.9 0.006 265);
--vibeui-dropdown-012-hover:oklch(0.96 0.004 265);
--vibeui-dropdown-012-accent:oklch(0.55 0.18 265);
--vibeui-dropdown-012-danger:oklch(0.56 0.19 25);
--vibeui-dropdown-012-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dropdown-012"]{
display:block;width:100%;max-width:24rem;box-sizing:border-box;
background:var(--vibeui-dropdown-012-bg);color:var(--vibeui-dropdown-012-fg);
border:1px solid var(--vibeui-dropdown-012-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-012-font);overflow:hidden;
}
[data-vibeui-block="dropdown-012"] [data-part="bar"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
padding:0.5rem 0.5rem 0.5rem 0.875rem;
border-bottom:1px solid var(--vibeui-dropdown-012-border);
background:color-mix(in oklab,var(--vibeui-dropdown-012-accent) 6%,transparent);
}
[data-vibeui-block="dropdown-012"] [data-part="count"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="dropdown-012"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dropdown-012-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-012-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-012-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-012"] [data-part="trigger"]:hover:not(:disabled){background:var(--vibeui-dropdown-012-hover)}
[data-vibeui-block="dropdown-012"] [data-part="trigger"]:disabled{cursor:not-allowed;opacity:.5}
[data-vibeui-block="dropdown-012"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-012-accent);outline-offset:2px}
[data-vibeui-block="dropdown-012"] [data-part="caret"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-dropdown-012-muted);
border-bottom:1.5px solid var(--vibeui-dropdown-012-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-block="dropdown-012"] [data-part="row"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem 0.875rem;font-size:0.8125rem;
border-bottom:1px solid var(--vibeui-dropdown-012-border);
}
[data-vibeui-block="dropdown-012"] [data-part="row"]:last-child{border-bottom:0}
[data-vibeui-block="dropdown-012"] [data-part="row"] input{
accent-color:var(--vibeui-dropdown-012-accent);width:0.9375rem;height:0.9375rem;margin:0;
}
[data-vibeui-block="dropdown-012"] [data-part="row"]:has(input:checked){background:color-mix(in oklab,var(--vibeui-dropdown-012-accent) 5%,transparent)}
[data-vibeui-block="dropdown-012"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:14rem;box-sizing:border-box;
background:var(--vibeui-dropdown-012-bg);color:var(--vibeui-dropdown-012-fg);
border:1px solid var(--vibeui-dropdown-012-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 265 / 45%);
font-family:var(--vibeui-dropdown-012-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-012"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-012"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-012"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-012-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-012"] [data-part="head"]{
padding:0.375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.05em;text-transform:uppercase;
color:var(--vibeui-dropdown-012-muted);
}
[data-vibeui-block="dropdown-012"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-012"] [data-part="item"]:hover{background:var(--vibeui-dropdown-012-hover)}
[data-vibeui-block="dropdown-012"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-012-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-012"] [data-part="item"][aria-disabled="true"]{color:var(--vibeui-dropdown-012-muted);cursor:not-allowed}
[data-vibeui-block="dropdown-012"] [data-part="item"][aria-disabled="true"]:hover{background:none}
[data-vibeui-block="dropdown-012"] [data-part="item"][data-danger="true"]{color:var(--vibeui-dropdown-012-danger)}
[data-vibeui-block="dropdown-012"] [data-part="note"]{font-size:0.6875rem;color:var(--vibeui-dropdown-012-muted)}
[data-vibeui-block="dropdown-012"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-012-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-012"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS = [
  "Собрать отчёт по неделе",
  "Обновить прайс на сайте",
  "Проверить формы оплаты",
]

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
 * Меню массовых действий над таблицей: считает выделение и гасит неприменимое.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown012({
  title = "Задачи спринта",
  actionLabel = "Действия",
  rows = DEFAULT_ROWS,
  accent,
  className,
  style,
  ...props
}: Dropdown012Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<string[]>([rows[0]])

  const toggle = (row: string) =>
    setPicked((current) =>
      current.includes(row)
        ? current.filter((entry) => entry !== row)
        : [...current, row],
    )

  const palette = {
    ...(accent ? { "--vibeui-dropdown-012-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-012" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="dropdown-012"
        aria-label={title}
        className={className}
        style={palette}
      >
        <header data-part="bar">
          <span data-part="count" role="status">
            {picked.length > 0 ? `Выбрано: ${picked.length}` : title}
          </span>
          <button
            type="button"
            data-part="trigger"
            popoverTarget={`${id}-menu`}
            aria-haspopup="menu"
            disabled={picked.length === 0}
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
            {actionLabel}
            <span data-part="caret" aria-hidden="true" />
          </button>
        </header>
        {rows.map((row) => (
          <label key={row} data-part="row">
            <input
              type="checkbox"
              checked={picked.includes(row)}
              onChange={() => toggle(row)}
            />
            {row}
          </label>
        ))}
        <div
          id={`${id}-menu`}
          ref={menu}
          popover="auto"
          role="menu"
          aria-label={`${actionLabel}: выбрано ${picked.length}`}
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
          <div data-part="head">К {picked.length} строкам</div>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={() => menu.current?.hidePopover()}
          >
            Назначить исполнителя
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={() => menu.current?.hidePopover()}
          >
            Поставить срок
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            aria-disabled={picked.length !== 1}
            onClick={(event) => {
              if (picked.length !== 1) {
                event.preventDefault()
                return
              }

              menu.current?.hidePopover()
            }}
          >
            Переименовать
            {picked.length !== 1 ? (
              <span data-part="note">только одна строка</span>
            ) : null}
          </button>
          <div data-part="rule" role="separator" />
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={() => menu.current?.hidePopover()}
          >
            В архив
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            data-danger="true"
            onClick={() => {
              setPicked([])
              menu.current?.hidePopover()
            }}
          >
            Удалить
            <span data-part="note">{picked.length} шт.</span>
          </button>
        </div>
      </section>
    </>
  )
}
