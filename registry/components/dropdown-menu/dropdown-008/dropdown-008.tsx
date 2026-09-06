"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown008Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  name?: string
  email?: string
  plan?: string
  workspaces?: string[]
  /** Имя слоя для скринридера; {name} подставляется. */
  menuLabel?: string
  /** Заголовок радиогруппы пространств. */
  spacesLabel?: string
  /** Пункты между разделителями. */
  items?: string[]
  /** Подпись последнего, необратимого действия. */
  exitLabel?: string
  accent?: string
  /** Подложка панели и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: меню профиля, у которого шапка отвечает на вопрос «под кем
// я вошёл», а середина — «в каком пространстве я работаю». Оба ответа нужны до
// нажатия «выйти», а в узкой кнопке шапки для них нет места. Пространства —
// радиогруппа с отметкой: их выбирают, а не выполняют. Выход отделён чертой и
// стоит последним: это единственное необратимое действие списка.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-008"]){
--vibeui-dropdown-008-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-008-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-008-muted:color-mix(in oklab,var(--vibeui-dropdown-008-fg) 68%,transparent);
--vibeui-dropdown-008-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-008-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-dropdown-008-accent:light-dark(oklch(0.55 0.18 258),oklch(0.72 0.15 258));
--vibeui-dropdown-008-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-dropdown-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-008"]{color-scheme:dark}
[data-vibeui-block="dropdown-008"]{
display:inline-flex;box-sizing:border-box;padding:0.375rem;
background:var(--vibeui-dropdown-008-bg);
border:1px solid var(--vibeui-dropdown-008-border);border-radius:9999px;
font-family:var(--vibeui-dropdown-008-font);color:var(--vibeui-dropdown-008-fg);
}
[data-vibeui-block="dropdown-008"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2.25rem;padding:0 0.75rem 0 0.25rem;
border:0;border-radius:9999px;background:none;color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-008-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-008"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-008-hover)}
[data-vibeui-block="dropdown-008"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-008-accent);outline-offset:2px}
[data-vibeui-block="dropdown-008"] [data-part="face"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.75rem;height:1.75rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dropdown-008-accent) 18%,var(--vibeui-dropdown-008-bg));
color:var(--vibeui-dropdown-008-accent);
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
}
[data-vibeui-block="dropdown-008"] [data-part="menu"]{
position:fixed;padding:0.3125rem;width:16rem;box-sizing:border-box;
background:var(--vibeui-dropdown-008-bg);color:var(--vibeui-dropdown-008-fg);
border:1px solid var(--vibeui-dropdown-008-border);border-radius:0.875rem;
box-shadow:0 20px 44px -24px oklch(0.2 0 265 / 50%);
font-family:var(--vibeui-dropdown-008-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-008"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-008"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-008"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-008-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
/* Шапка не кликается: это справка, а не пункт меню. */
[data-vibeui-block="dropdown-008"] [data-part="head"]{
display:flex;align-items:center;gap:0.625rem;
padding:0.5rem;margin-bottom:0.25rem;
border-radius:0.625rem;
background:color-mix(in oklab,var(--vibeui-dropdown-008-accent) 6%,transparent);
}
[data-vibeui-block="dropdown-008"] [data-part="head"] [data-part="face"]{width:2.25rem;height:2.25rem;font-size:0.8125rem}
[data-vibeui-block="dropdown-008"] [data-part="who"]{display:flex;flex-direction:column;min-width:0;gap:0.0625rem}
[data-vibeui-block="dropdown-008"] [data-part="name"]{font-size:0.8125rem;font-weight:650;line-height:1.2}
[data-vibeui-block="dropdown-008"] [data-part="mail"]{
font-size:0.6875rem;color:var(--vibeui-dropdown-008-muted);line-height:1.3;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="dropdown-008"] [data-part="plan"]{
margin-left:auto;flex:none;padding:0.125rem 0.4375rem;border-radius:9999px;
background:var(--vibeui-dropdown-008-accent);color:oklch(0.99 0 0);
font-size:0.625rem;font-weight:700;letter-spacing:0.03em;text-transform:uppercase;
}
[data-vibeui-block="dropdown-008"] [data-part="title"]{
padding:0.4375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-008-muted);
}
[data-vibeui-block="dropdown-008"] [data-part="item"]{
display:flex;align-items:center;gap:0.5rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-008"] [data-part="item"]:hover{background:var(--vibeui-dropdown-008-hover)}
[data-vibeui-block="dropdown-008"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-008-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-008"] [data-part="item"][data-danger="true"]{color:var(--vibeui-dropdown-008-danger)}
[data-vibeui-block="dropdown-008"] [data-part="chip"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.25rem;height:1.25rem;border-radius:0.375rem;
background:var(--vibeui-dropdown-008-hover);
font-size:0.625rem;font-weight:700;color:var(--vibeui-dropdown-008-muted);
}
[data-vibeui-block="dropdown-008"] [data-part="tick"]{
margin-left:auto;width:0.9375rem;height:0.9375rem;flex:none;
color:var(--vibeui-dropdown-008-accent);opacity:0;
}
[data-vibeui-block="dropdown-008"] [data-part="item"][aria-checked="true"] [data-part="tick"]{opacity:1}
[data-vibeui-block="dropdown-008"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-008-border);
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-008"]:has([data-open="true"]){flex-direction:column;align-items:flex-end}
[data-vibeui-block="dropdown-008"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_WORKSPACES = ["Личное", "Студия «Полдень»", "Клиент: Аврора"]
const DEFAULT_ITEMS = ["Настройки аккаунта", "Счета и оплата"]

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

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
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
 * Меню профиля с шапкой пользователя и переключением рабочих пространств.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown008({
  open = false,
  name = "Вера Логинова",
  email = "vera@poldenstudio.ru",
  plan = "Pro",
  workspaces = DEFAULT_WORKSPACES,
  menuLabel = "Профиль: {name}",
  spacesLabel = "Пространства",
  items = DEFAULT_ITEMS,
  exitLabel = "Выйти",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown008Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const [space, setSpace] = useState(workspaces[0])

  const palette = {
    ...(accent ? { "--vibeui-dropdown-008-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-008-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-008" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-008"
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
          <span data-part="face" aria-hidden="true">
            {initials(name)}
          </span>
          {name.split(" ")[0]}
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={menuLabel.replace("{name}", name)}
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
          <div data-part="head">
            <span data-part="face" aria-hidden="true">
              {initials(name)}
            </span>
            <span data-part="who">
              <span data-part="name">{name}</span>
              <span data-part="mail">{email}</span>
            </span>
            <span data-part="plan">{plan}</span>
          </div>
          <div data-part="title" id={`${id}-spaces`}>
            {spacesLabel}
          </div>
          <div role="group" aria-labelledby={`${id}-spaces`}>
            {workspaces.map((workspace) => (
              <button
                key={workspace}
                type="button"
                role="menuitemradio"
                aria-checked={space === workspace}
                data-part="item"
                onClick={() => {
                  setSpace(workspace)
                  menu.current?.hidePopover()
                }}
              >
                <span data-part="chip" aria-hidden="true">
                  {workspace[0]}
                </span>
                {workspace}
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
            ))}
          </div>
          <div data-part="rule" role="separator" />
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
          <button
            type="button"
            role="menuitem"
            data-part="item"
            data-danger="true"
            onClick={() => menu.current?.hidePopover()}
          >
            {exitLabel}
          </button>
        </div>
      </div>
    </>
  )
}
