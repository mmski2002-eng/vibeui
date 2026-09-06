"use client"

import { useId, useRef } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown010Item = {
  label: string
  hint: string
  glyph: string
}

export type Dropdown010Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  menuWidth?: number
  items?: Dropdown010Item[]
  accent?: string
  /** Подложка панели и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: пункт из двух строк — название и пояснение под ним. Меню
// создания сущностей нельзя описать одним словом: «доска» и «таблица» звучат
// одинаково важно, пока не сказано, для чего каждая. Ширина меню задаётся
// переменной, потому что пояснение в две строки на 12rem превращается в кашу.
// Пояснение связано с пунктом через aria-describedby, а не просто лежит рядом.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-010"]){
--vibeui-dropdown-010-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-010-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-010-muted:color-mix(in oklab,var(--vibeui-dropdown-010-fg) 68%,transparent);
--vibeui-dropdown-010-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-010-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-dropdown-010-accent:light-dark(oklch(0.55 0.16 190),oklch(0.74 0.13 190));
--vibeui-dropdown-010-on-accent:light-dark(oklch(0.99 0 0),oklch(0.19 0.03 190));
--vibeui-dropdown-010-width:18rem;
--vibeui-dropdown-010-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-010"]{color-scheme:dark}
[data-vibeui-block="dropdown-010"]{
display:inline-flex;box-sizing:border-box;padding:0.4375rem;
background:var(--vibeui-dropdown-010-bg);color:var(--vibeui-dropdown-010-fg);
border:1px solid var(--vibeui-dropdown-010-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-010-font);
}
[data-vibeui-block="dropdown-010"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-dropdown-010-accent);color:var(--vibeui-dropdown-010-on-accent);
font:inherit;font-size:0.8125rem;font-weight:650;
anchor-name:--vibeui-dropdown-010-anchor;
transition:filter .16s ease;
}
[data-vibeui-block="dropdown-010"] [data-part="trigger"]:hover{filter:brightness(1.07)}
[data-vibeui-block="dropdown-010"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-010-accent);outline-offset:2px}
[data-vibeui-block="dropdown-010"] [data-part="plus"]{font-size:1rem;line-height:1;margin-top:-0.0625rem}
[data-vibeui-block="dropdown-010"] [data-part="menu"]{
position:fixed;padding:0.375rem;box-sizing:border-box;
width:var(--vibeui-dropdown-010-width);
background:var(--vibeui-dropdown-010-bg);color:var(--vibeui-dropdown-010-fg);
border:1px solid var(--vibeui-dropdown-010-border);border-radius:0.875rem;
box-shadow:0 20px 44px -24px oklch(0.2 0 265 / 50%);
font-family:var(--vibeui-dropdown-010-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-010"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-010"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-010"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-010-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Две строки в пункте: иконка занимает обе, поэтому сетка, а не флекс. */
[data-vibeui-block="dropdown-010"] [data-part="item"]{
display:grid;grid-template-columns:1.75rem 1fr;grid-template-rows:auto auto;
column-gap:0.625rem;row-gap:0.125rem;align-items:start;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.5rem;border-radius:0.625rem;
font:inherit;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-010"] [data-part="item"]:hover{background:var(--vibeui-dropdown-010-hover)}
[data-vibeui-block="dropdown-010"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-010-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-010"] [data-part="badge"]{
grid-row:1 / span 2;
display:flex;align-items:center;justify-content:center;
width:1.75rem;height:1.75rem;border-radius:0.5rem;
background:color-mix(in oklab,var(--vibeui-dropdown-010-accent) 14%,transparent);
font-size:0.875rem;line-height:1;
}
[data-vibeui-block="dropdown-010"] [data-part="label"]{font-size:0.8125rem;font-weight:650;line-height:1.25}
[data-vibeui-block="dropdown-010"] [data-part="hint"]{
font-size:0.75rem;line-height:1.35;color:var(--vibeui-dropdown-010-muted);
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-010"]:has([data-open="true"]){flex-direction:column;align-items:flex-start}
[data-vibeui-block="dropdown-010"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-010"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Dropdown010Item[] = [
  {
    label: "Документ",
    hint: "Текст с заголовками и картинками, как страница вики",
    glyph: "¶",
  },
  {
    label: "Таблица",
    hint: "Строки с полями: статус, срок, ответственный",
    glyph: "▦",
  },
  {
    label: "Доска",
    hint: "Карточки в колонках, которые тянут мышью",
    glyph: "▤",
  },
  {
    label: "Импорт",
    hint: "Забрать содержимое из Notion, CSV или Markdown",
    glyph: "↧",
  },
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
 * Меню с пояснением под каждым пунктом: название и строка описания.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown010({
  open = false,
  trigger = "Создать",
  menuWidth = 18,
  items = DEFAULT_ITEMS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown010Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)

  const palette = {
    "--vibeui-dropdown-010-width": `${menuWidth}rem`,
    ...(accent ? { "--vibeui-dropdown-010-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-010-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-010" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-010"
        className={className}
        style={palette}
      >
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
          <span data-part="plus" aria-hidden="true">
            +
          </span>
          {trigger}
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={trigger}
          data-part="menu"
          style={palette}
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
          {items.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              data-part="item"
              aria-describedby={`${id}-hint-${index}`}
              onClick={() => menu.current?.hidePopover()}
            >
              <span data-part="badge" aria-hidden="true">
                {item.glyph}
              </span>
              <span data-part="label">{item.label}</span>
              <span data-part="hint" id={`${id}-hint-${index}`}>
                {item.hint}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
