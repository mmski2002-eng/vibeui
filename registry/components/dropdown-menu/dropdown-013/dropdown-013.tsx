"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Dropdown013Props = Omit<ComponentProps<"div">, "children"> & {
  /** Фото. Без него на том же месте остаётся цветная подложка. */
  avatarImage?: string
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  name?: string
  email?: string
  role?: string
  /** Доступное имя кнопки. Плейсхолдер {name}. */
  triggerLabelTemplate?: string
  /** Доступное имя меню. */
  menuLabel?: string
  /** Подсказка у почты: ключи copy и copied. */
  copyText?: Record<string, string>
  /** Пункты меню: ключи settings и signOut. */
  itemsText?: Record<string, string>
  accent?: string
  /** Подложка кнопки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: меню профиля, где почта не просто написана в шапке, а
// нажимается — короткий путь скопировать адрес, не открывая настройки.
// Подтверждение живёт в самом пункте и объявляется вслух через aria-live,
// а не всплывающим тостом: тост потребовал бы второй слой поверх меню.
// Выход стоит последним и за чертой — это единственное необратимое действие.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте кнопка и меню светлее фона страницы, а их границы светлее их самих.
const STYLES = `
:where([data-vibeui-block="dropdown-013"]){
--vibeui-dropdown-013-bg:light-dark(oklch(1 0 0),oklch(0.25 0 255));
--vibeui-dropdown-013-fg:light-dark(oklch(0.24 0 255),oklch(0.94 0 255));
--vibeui-dropdown-013-muted:color-mix(in oklab,var(--vibeui-dropdown-013-fg) 68%,transparent);
--vibeui-dropdown-013-border:light-dark(oklch(0.9 0 255),oklch(0.37 0 255));
--vibeui-dropdown-013-hover:light-dark(oklch(0.96 0 255),oklch(0.32 0 255));
--vibeui-dropdown-013-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-dropdown-013-accent:light-dark(oklch(0.55 0.17 39.8),oklch(0.75 0.14 39.8));
--vibeui-dropdown-013-hue:255;
--vibeui-dropdown-013-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-013"]{color-scheme:dark}
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
position:relative;display:flex;align-items:center;justify-content:center;flex:none;
width:1.875rem;height:1.875rem;border-radius:9999px;
color:light-dark(oklch(0.38 0.09 var(--vibeui-dropdown-013-hue)),oklch(0.88 0.063 var(--vibeui-dropdown-013-hue)));
font-size:0.6875rem;font-weight:700;overflow:hidden;
}
/* Подложка — только когда фотографии нет: компонент обязан
   оставаться полноценным без единого внешнего файла. */
[data-vibeui-block="dropdown-013"] [data-part="face"][data-empty="true"]{background:light-dark(oklch(0.92 0.05 var(--vibeui-dropdown-013-hue)),oklch(0.34 0.065 var(--vibeui-dropdown-013-hue)));}
[data-vibeui-block="dropdown-013"] [data-part="face"] img{
position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:inherit;
}
[data-vibeui-block="dropdown-013"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:14.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-013-bg);color:var(--vibeui-dropdown-013-fg);
border:1px solid var(--vibeui-dropdown-013-border);border-radius:0.875rem;
box-shadow:0 18px 40px -22px oklch(0.2 0 255 / 55%);
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
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-013"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-013"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_COPY: Record<string, string> = {
  copy: "Копировать",
  copied: "Скопировано",
}

const DEFAULT_ITEMS: Record<string, string> = {
  settings: "Настройки аккаунта",
  signOut: "Выйти",
}

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
  open = false,
  name = "Марк Соколов",
  avatarImage = "",
  email = "mark@example.com",
  role = "Продуктовый дизайнер",
  triggerLabelTemplate = "Меню профиля: {name}",
  menuLabel = "Профиль",
  copyText = DEFAULT_COPY,
  itemsText = DEFAULT_ITEMS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown013Props) {
  const id = useId().replace(/:/g, "")
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
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
    ...(background
      ? {
          "--vibeui-dropdown-013-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-013" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
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
          aria-expanded={menuOpen}
          aria-label={triggerLabelTemplate.replace("{name}", name)}
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
          <span
            data-part="face"
            data-empty={avatarImage ? undefined : "true"}
            aria-hidden="true"
          >
            {avatarImage ? (
              <img src={avatarImage} alt="" loading="lazy" decoding="async" />
            ) : null}
            {initials(name)}
          </span>
          {name}
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={menuLabel}
          data-part="menu"
          onToggle={(event) => setMenuOpen(event.newState === "open")}
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
              {copied
                ? (copyText.copied ?? DEFAULT_COPY.copied)
                : (copyText.copy ?? DEFAULT_COPY.copy)}
            </span>
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {itemsText.settings ?? DEFAULT_ITEMS.settings}
          </button>
          <div data-part="exit">
            <button
              type="button"
              role="menuitem"
              data-part="item"
              onClick={close}
            >
              {itemsText.signOut ?? DEFAULT_ITEMS.signOut}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
