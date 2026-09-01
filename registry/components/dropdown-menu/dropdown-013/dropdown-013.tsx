"use client"

import { useId, useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties } from "react"

export type Dropdown013Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  name?: string
  email?: string
  role?: string
  accent?: string
}

// Идея компонента: меню профиля, где почта не просто написана в шапке, а
// нажимается — короткий путь скопировать адрес, не открывая настройки.
// Подтверждение живёт в самом пункте и объявляется вслух через aria-live,
// а не всплывающим тостом: тост потребовал бы второй слой поверх меню.
// Выход стоит последним и за чертой — это единственное необратимое действие.
const STYLES = `
:where([data-vibeui-block="dropdown-013"]){
--vibeui-dropdown-013-bg:oklch(1 0 0);
--vibeui-dropdown-013-fg:oklch(0.24 0.014 255);
--vibeui-dropdown-013-muted:oklch(0.56 0.014 255);
--vibeui-dropdown-013-border:oklch(0.9 0.006 255);
--vibeui-dropdown-013-hover:oklch(0.96 0.004 255);
--vibeui-dropdown-013-danger:oklch(0.56 0.19 25);
--vibeui-dropdown-013-accent:oklch(0.55 0.17 255);
--vibeui-dropdown-013-hue:255;
--vibeui-dropdown-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="dropdown-013"]{
position:relative;display:inline-block;
font-family:var(--vibeui-dropdown-013-font);color:var(--vibeui-dropdown-013-fg);
}
[data-vibeui-block="dropdown-013"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.5rem;padding:0 0.75rem 0 0.375rem;
border:1px solid var(--vibeui-dropdown-013-border);border-radius:9999px;
background:var(--vibeui-dropdown-013-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-013-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-013"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-013-hover)}
[data-vibeui-block="dropdown-013"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-013-accent);outline-offset:2px}
[data-vibeui-block="dropdown-013"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.875rem;height:1.875rem;border-radius:9999px;
background:oklch(0.92 0.05 var(--vibeui-dropdown-013-hue));
color:oklch(0.38 0.09 var(--vibeui-dropdown-013-hue));
font-size:0.6875rem;font-weight:700;
}
[data-vibeui-block="dropdown-013"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:14.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-013-bg);color:var(--vibeui-dropdown-013-fg);
border:1px solid var(--vibeui-dropdown-013-border);border-radius:0.875rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.02 255 / 55%);
font-family:var(--vibeui-dropdown-013-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-013"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-013"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-013"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-013-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
@supports not (anchor-name: --a){
[data-vibeui-block="dropdown-013"] [data-part="menu"]{position:absolute;top:calc(100% + 0.375rem);right:0;inset:auto}
}
[data-vibeui-block="dropdown-013"] [data-part="head"]{
display:flex;flex-direction:column;gap:0.0625rem;
padding:0.5rem 0.5rem 0.625rem;margin-bottom:0.3125rem;
border-bottom:1px solid var(--vibeui-dropdown-013-border);
}
[data-vibeui-block="dropdown-013"] [data-part="name"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="dropdown-013"] [data-part="role"]{font-size:0.75rem;color:var(--vibeui-dropdown-013-muted)}
[data-vibeui-block="dropdown-013"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-013"] [data-part="item"]:hover{background:var(--vibeui-dropdown-013-hover)}
[data-vibeui-block="dropdown-013"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-013-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-013"] [data-part="hint"]{font-size:0.6875rem;color:var(--vibeui-dropdown-013-muted)}
[data-vibeui-block="dropdown-013"] [data-part="item"][data-copied="true"] [data-part="hint"]{color:var(--vibeui-dropdown-013-accent);font-weight:650}
[data-vibeui-block="dropdown-013"] [data-part="exit"]{
margin-top:0.3125rem;padding-top:0.3125rem;border-top:1px solid var(--vibeui-dropdown-013-border);
}
[data-vibeui-block="dropdown-013"] [data-part="exit"] [data-part="item"]{color:var(--vibeui-dropdown-013-danger)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-013"] *{animation:none!important;transition:none!important}}
`

function hue(name: string) {
  let hash = 2166136261

  for (const symbol of name) {
    hash ^= symbol.codePointAt(0)!
    hash = Math.imul(hash, 16777619)
  }

  return ((hash >>> 0) % 12) * 30
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
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
 * Меню профиля: почта копируется по нажатию, выход отделён чертой.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown013({
  name = "Марк Соколов",
  email = "mark@example.com",
  role = "Продуктовый дизайнер",
  accent,
  className,
  style,
  ...props
}: Dropdown013Props) {
  const id = useId().replace(/:/g, "")
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const close = () => {
    menu.current?.hidePopover()
    trigger.current?.focus()
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Буфер обмена недоступен (нет разрешения, не HTTPS): молча не мешаем.
    }
  }

  const palette = {
    "--vibeui-dropdown-013-hue": hue(name),
    ...(accent ? { "--vibeui-dropdown-013-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="dropdown-013"
        className={className}
        style={palette}
      >
        <button
          ref={trigger}
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={`Меню профиля: ${name}`}
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
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          {name}
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover="auto"
          role="menu"
          aria-label="Профиль"
          data-part="menu"
          onToggle={(event) => setOpen(event.newState === "open")}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault()
              stepFocus(menu.current, 1)
            } else if (event.key === "ArrowUp") {
              event.preventDefault()
              stepFocus(menu.current, -1)
            }
          }}
        >
          <div data-part="head">
            <span data-part="name">{name}</span>
            <span data-part="role">{role}</span>
          </div>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            data-copied={copied}
            onClick={copyEmail}
          >
            {email}
            <span data-part="hint" aria-live="polite">
              {copied ? "Скопировано" : "Копировать"}
            </span>
          </button>
          <button type="button" role="menuitem" data-part="item" onClick={close}>
            Настройки аккаунта
          </button>
          <div data-part="exit">
            <button
              type="button"
              role="menuitem"
              data-part="item"
              onClick={close}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
