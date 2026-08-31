"use client"

import { useId, useRef } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown003Item = {
  label: string
  keys: string
  icon: "pencil" | "copy" | "share" | "archive" | "trash"
  danger?: boolean
}

export type Dropdown003Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  trigger?: string
  keysLabel?: string
  items?: Dropdown003Item[]
  accent?: string
}

// Идея компонента: меню, из которого пользователь уходит к клавиатуре. Слева
// иконка — она держит строку узнаваемой при беглом взгляде, справа сочетание
// клавиш моноширинным начертанием: их читают колонкой, и пропорциональный
// шрифт эту колонку разваливает. Иконки нарисованы инлайновым SVG, потому что
// пакет иконок сделал бы компонент зависимым.
const STYLES = `
:where([data-vibeui-block="dropdown-003"]){
--vibeui-dropdown-003-bg:oklch(1 0 0);
--vibeui-dropdown-003-fg:oklch(0.25 0.015 275);
--vibeui-dropdown-003-muted:oklch(0.56 0.014 275);
--vibeui-dropdown-003-border:oklch(0.9 0.006 275);
--vibeui-dropdown-003-hover:oklch(0.96 0.005 275);
--vibeui-dropdown-003-accent:oklch(0.55 0.18 285);
--vibeui-dropdown-003-danger:oklch(0.56 0.19 25);
--vibeui-dropdown-003-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-dropdown-003-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
}
[data-vibeui-block="dropdown-003"]{
display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.4375rem;
background:var(--vibeui-dropdown-003-bg);color:var(--vibeui-dropdown-003-fg);
border:1px solid var(--vibeui-dropdown-003-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-003-font);
}
[data-vibeui-block="dropdown-003"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.125rem;padding:0 0.875rem;
border:0;border-radius:0.625rem;
background:var(--vibeui-dropdown-003-accent);color:oklch(0.99 0 0);
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-003-anchor;
transition:filter .16s ease;
}
[data-vibeui-block="dropdown-003"] [data-part="trigger"]:hover{filter:brightness(1.08)}
[data-vibeui-block="dropdown-003"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-003-accent);outline-offset:2px}
[data-vibeui-block="dropdown-003"] [data-part="hint"]{
padding-right:0.375rem;font-size:0.75rem;color:var(--vibeui-dropdown-003-muted);
}
[data-vibeui-block="dropdown-003"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:15rem;box-sizing:border-box;
background:var(--vibeui-dropdown-003-bg);color:var(--vibeui-dropdown-003-fg);
border:1px solid var(--vibeui-dropdown-003-border);border-radius:0.75rem;
box-shadow:0 20px 44px -24px oklch(0.2 0.03 275 / 50%);
font-family:var(--vibeui-dropdown-003-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-003"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-003"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-003"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-003-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-003"] [data-part="item"]{
display:grid;grid-template-columns:1rem 1fr auto;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-003"] [data-part="item"]:hover{background:var(--vibeui-dropdown-003-hover)}
[data-vibeui-block="dropdown-003"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-003-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-003"] [data-part="item"][data-danger="true"]{color:var(--vibeui-dropdown-003-danger)}
[data-vibeui-block="dropdown-003"] [data-part="item"] svg{width:1rem;height:1rem;display:block;opacity:.75}
/* Сочетания читают колонкой, поэтому моноширинный шрифт и одна ширина. */
[data-vibeui-block="dropdown-003"] [data-part="keys"]{
font-family:var(--vibeui-dropdown-003-mono);font-size:0.6875rem;
color:var(--vibeui-dropdown-003-muted);letter-spacing:0.02em;
}
[data-vibeui-block="dropdown-003"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-003-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-003"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Dropdown003Item[] = [
  { label: "Переименовать", keys: "F2", icon: "pencil" },
  { label: "Дублировать", keys: "⌘D", icon: "copy" },
  { label: "Поделиться", keys: "⇧⌘S", icon: "share" },
  { label: "В архив", keys: "⌘E", icon: "archive" },
  { label: "Удалить", keys: "⌘⌫", icon: "trash", danger: true },
]

const PATHS: Record<Dropdown003Item["icon"], string> = {
  pencil: "M4 16l-1 5 5-1L20 7.5 17.5 5 4 16z",
  copy: "M9 9h11v11H9zM4 4h11v3M4 4v11h3",
  share: "M12 4v11M12 4l-4 4M12 4l4 4M5 15v5h14v-5",
  archive: "M3 5h18v4H3zM5 9v11h14V9M10 13h4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v7M14 11v7",
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
 * Меню с иконками слева и сочетаниями клавиш справа, на HTML popover.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown003({
  trigger = "Правка",
  keysLabel = "⌘K",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
  ...props
}: Dropdown003Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)

  const openAndFocus = () => {
    const node = menu.current

    if (!node) {
      return
    }

    if (!node.matches(":popover-open")) {
      node.showPopover()
    }

    requestAnimationFrame(() =>
      node.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-003-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-003" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="dropdown-003"
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
              openAndFocus()
            }
          }}
        >
          {trigger}
        </button>
        <span data-part="hint">{keysLabel}</span>
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
          {items.map((item) => (
            <div key={item.label}>
              {item.danger ? <div data-part="rule" role="separator" /> : null}
              <button
                type="button"
                role="menuitem"
                data-part="item"
                data-danger={item.danger || undefined}
                onClick={() => menu.current?.hidePopover()}
              >
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d={PATHS[item.icon]}
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item.label}</span>
                <kbd data-part="keys">{item.keys}</kbd>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
