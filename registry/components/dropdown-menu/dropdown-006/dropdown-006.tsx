"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown006Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  trigger?: string
  side?: "right" | "left"
  submenuLabel?: string
  folders?: string[]
  /** Подпись над кнопкой: над каким объектом меню. */
  caption?: string
  /** Пункты до подменю. */
  items?: string[]
  /** Пункт после подменю. */
  archiveLabel?: string
  accent?: string
  /** Подложка панели и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: пункт с вложенным подменю. Подменю — не второй popover, а
// обычный абсолютно спозиционированный слой внутри первого: вложенные popover
// закрывают друг друга, и «переместить в папку» превращается в мигание.
// Подменю открывается наведением и стрелкой вправо, закрывается стрелкой
// влево с возвратом фокуса на родителя — без этого с клавиатуры из него не выйти.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-006"]){
--vibeui-dropdown-006-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 260));
--vibeui-dropdown-006-fg:light-dark(oklch(0.24 0.014 260),oklch(0.94 0.006 260));
--vibeui-dropdown-006-muted:light-dark(oklch(0.56 0.014 260),oklch(0.7 0.012 260));
--vibeui-dropdown-006-border:light-dark(oklch(0.9 0.006 260),oklch(0.37 0.012 260));
--vibeui-dropdown-006-hover:light-dark(oklch(0.96 0.004 260),oklch(0.32 0.014 260));
--vibeui-dropdown-006-accent:light-dark(oklch(0.55 0.19 300),oklch(0.74 0.16 300));
--vibeui-dropdown-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dropdown-006"]{
display:inline-flex;flex-direction:column;gap:0.4375rem;
box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-dropdown-006-bg);color:var(--vibeui-dropdown-006-fg);
border:1px solid var(--vibeui-dropdown-006-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-006-font);
}
[data-vibeui-block="dropdown-006"] [data-part="caption"]{
font-size:0.75rem;color:var(--vibeui-dropdown-006-muted);
}
[data-vibeui-block="dropdown-006"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.125rem;padding:0 0.875rem;
border:1px solid var(--vibeui-dropdown-006-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-006-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-006-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-006"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-006-hover)}
[data-vibeui-block="dropdown-006"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-006-accent);outline-offset:2px}
[data-vibeui-block="dropdown-006"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:13rem;box-sizing:border-box;
background:var(--vibeui-dropdown-006-bg);color:var(--vibeui-dropdown-006-fg);
border:1px solid var(--vibeui-dropdown-006-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 260 / 45%);
font-family:var(--vibeui-dropdown-006-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-006"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-006"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-006"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-006-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-006"] [data-part="item"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-006"] [data-part="item"]:hover,
[data-vibeui-block="dropdown-006"] [data-part="item"][aria-expanded="true"]{background:var(--vibeui-dropdown-006-hover)}
[data-vibeui-block="dropdown-006"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-006-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-006"] [data-part="arrow"]{
margin-left:auto;width:0.3125rem;height:0.3125rem;flex:none;
border-top:1.5px solid var(--vibeui-dropdown-006-muted);
border-right:1.5px solid var(--vibeui-dropdown-006-muted);
transform:rotate(45deg);
}
[data-vibeui-block="dropdown-006"] [data-part="nest"]{position:relative}
/* Подменю живёт внутри popover обычным слоем: второй popover закрыл бы первый. */
[data-vibeui-block="dropdown-006"] [data-part="sub"]{
position:absolute;top:-0.3125rem;left:calc(100% + 0.25rem);z-index:1;
padding:0.3125rem;min-width:10.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-006-bg);
border:1px solid var(--vibeui-dropdown-006-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 260 / 45%);
}
[data-vibeui-block="dropdown-006"][data-side="left"] [data-part="sub"]{left:auto;right:calc(100% + 0.25rem)}
[data-vibeui-block="dropdown-006"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-006-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FOLDERS = ["Входящие", "Проекты 2026", "Архив", "Черновики"]
const DEFAULT_ITEMS = ["Ответить", "Переслать"]

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

function stepFocus(scope: HTMLElement | null, delta: number) {
  if (!scope) {
    return
  }

  const items = Array.from(
    scope.querySelectorAll<HTMLElement>('[data-part="item"]'),
  ).filter((item) => item.offsetParent !== null)

  if (items.length === 0) {
    return
  }

  const from = items.indexOf(document.activeElement as HTMLElement)
  items[(from + delta + items.length) % items.length].focus()
}

/**
 * Меню с вложенным подменю: наведение, стрелка вправо внутрь, влево — назад.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown006({
  trigger = "Письмо",
  side = "right",
  submenuLabel = "Переместить в",
  folders = DEFAULT_FOLDERS,
  caption = "Отчёт за март.pdf",
  items = DEFAULT_ITEMS,
  archiveLabel = "В архив",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown006Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const parent = useRef<HTMLButtonElement>(null)
  const sub = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const enterSub = () => {
    setOpen(true)
    requestAnimationFrame(() =>
      sub.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const leaveSub = () => {
    setOpen(false)
    parent.current?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-006-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-006" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="dropdown-006"
        data-side={side}
        className={className}
        style={palette}
      >
        <span data-part="caption">{caption}</span>
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
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover="auto"
          role="menu"
          aria-label={trigger}
          data-part="menu"
          onToggle={() => setOpen(false)}
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
          {items.map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              data-part="item"
              onClick={() => menu.current?.hidePopover()}
            >
              {item}
            </button>
          ))}
          <div data-part="rule" role="separator" />
          <div
            data-part="nest"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              type="button"
              ref={parent}
              role="menuitem"
              data-part="item"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => (open ? setOpen(false) : enterSub())}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") {
                  event.preventDefault()
                  enterSub()
                }
              }}
            >
              {submenuLabel}
              <span data-part="arrow" aria-hidden="true" />
            </button>
            {open ? (
              <div
                ref={sub}
                data-part="sub"
                role="menu"
                aria-label={submenuLabel}
                onKeyDown={(event) => {
                  if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    leaveSub()
                  }
                }}
              >
                {folders.map((folder) => (
                  <button
                    key={folder}
                    type="button"
                    role="menuitem"
                    data-part="item"
                    onClick={() => {
                      setOpen(false)
                      menu.current?.hidePopover()
                    }}
                  >
                    {folder}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={() => menu.current?.hidePopover()}
          >
            {archiveLabel}
          </button>
        </div>
      </div>
    </>
  )
}
