"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown005Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  trigger?: string
  value?: string
  themes?: string[]
  onChange?: (value: string) => void
  accent?: string
}

// Идея компонента: внутри меню живёт радиогруппа — выбор одного из
// взаимоисключающих вариантов, а не список команд. Поэтому у пунктов роль
// menuitemradio, обёртка помечена group, и меню закрывается сразу после
// выбора: второй вариант выбирать уже нечего. Каждая тема несёт крошечный
// образец из двух полос — словами «светлая» и «системная» не различаются.
const STYLES = `
:where([data-vibeui-block="dropdown-005"]){
--vibeui-dropdown-005-bg:oklch(1 0 0);
--vibeui-dropdown-005-fg:oklch(0.24 0.014 285);
--vibeui-dropdown-005-muted:oklch(0.56 0.014 285);
--vibeui-dropdown-005-border:oklch(0.9 0.006 285);
--vibeui-dropdown-005-hover:oklch(0.96 0.004 285);
--vibeui-dropdown-005-accent:oklch(0.6 0.16 155);
--vibeui-dropdown-005-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dropdown-005"]{
display:inline-flex;align-items:center;gap:0.75rem;
box-sizing:border-box;padding:0.5rem 0.5rem 0.5rem 0.875rem;
background:var(--vibeui-dropdown-005-bg);color:var(--vibeui-dropdown-005-fg);
border:1px solid var(--vibeui-dropdown-005-border);border-radius:9999px;
font-family:var(--vibeui-dropdown-005-font);
}
[data-vibeui-block="dropdown-005"] [data-part="caption"]{
font-size:0.8125rem;color:var(--vibeui-dropdown-005-muted);
}
[data-vibeui-block="dropdown-005"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dropdown-005-border);border-radius:9999px;
background:var(--vibeui-dropdown-005-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-005-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-005"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-005-hover)}
[data-vibeui-block="dropdown-005"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-005-accent);outline-offset:2px}
[data-vibeui-block="dropdown-005"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:13rem;box-sizing:border-box;
background:var(--vibeui-dropdown-005-bg);color:var(--vibeui-dropdown-005-fg);
border:1px solid var(--vibeui-dropdown-005-border);border-radius:0.875rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 285 / 45%);
font-family:var(--vibeui-dropdown-005-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-005"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-005"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-005"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-005-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-005"] [data-part="title"]{
padding:0.4375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-005-muted);
}
[data-vibeui-block="dropdown-005"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.375rem 0.5rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-005"] [data-part="item"]:hover{background:var(--vibeui-dropdown-005-hover)}
[data-vibeui-block="dropdown-005"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-005-accent);outline-offset:-2px}
/* Образец темы: две полосы вместо слов — «светлая» и «системная» на слух одинаковы. */
[data-vibeui-block="dropdown-005"] [data-part="swatch"]{
display:flex;flex:none;overflow:hidden;
width:1.75rem;height:1.25rem;
border:1px solid var(--vibeui-dropdown-005-border);border-radius:0.375rem;
}
[data-vibeui-block="dropdown-005"] [data-part="swatch"] span{flex:1}
[data-vibeui-block="dropdown-005"] [data-part="swatch"] span:first-child{background:oklch(0.97 0.003 285)}
[data-vibeui-block="dropdown-005"] [data-part="swatch"] span:last-child{background:oklch(0.3 0.02 285)}
[data-vibeui-block="dropdown-005"] [data-part="item"][data-theme="0"] [data-part="swatch"] span:last-child{background:oklch(0.97 0.003 285)}
[data-vibeui-block="dropdown-005"] [data-part="item"][data-theme="1"] [data-part="swatch"] span:first-child{background:oklch(0.3 0.02 285)}
[data-vibeui-block="dropdown-005"] [data-part="tick"]{
margin-left:auto;width:1rem;height:1rem;flex:none;
color:var(--vibeui-dropdown-005-accent);opacity:0;
}
[data-vibeui-block="dropdown-005"] [data-part="item"][aria-checked="true"]{font-weight:600}
[data-vibeui-block="dropdown-005"] [data-part="item"][aria-checked="true"] [data-part="tick"]{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-005"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_THEMES = ["Светлая", "Тёмная", "Как в системе"]

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
 * Меню с радиогруппой внутри: один выбранный вариант, образцы вместо слов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown005({
  trigger = "Оформление",
  value = "Как в системе",
  themes = DEFAULT_THEMES,
  onChange,
  accent,
  className,
  style,
  ...props
}: Dropdown005Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState(value)

  const choose = (theme: string) => {
    setPicked(theme)
    onChange?.(theme)
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-005-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-005" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="dropdown-005"
        className={className}
        style={palette}
      >
        <span data-part="caption">Внешний вид</span>
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
                    .querySelector<HTMLElement>('[aria-checked="true"]')
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
          <div data-part="title" id={`${id}-title`}>
            Тема
          </div>
          <div role="group" aria-labelledby={`${id}-title`}>
            {themes.map((theme, index) => (
              <button
                key={theme}
                type="button"
                role="menuitemradio"
                aria-checked={picked === theme}
                data-part="item"
                data-theme={index}
                onClick={() => choose(theme)}
              >
                <span data-part="swatch" aria-hidden="true">
                  <span />
                  <span />
                </span>
                {theme}
                <svg
                  data-part="tick"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
