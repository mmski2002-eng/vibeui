"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown015Props = Omit<ComponentProps<"div">, "children"> & {
  trigger?: string
  side?: "right" | "left"
  submenuLabel?: string
  formats?: string[]
  /** Подпись над кнопкой: имя файла, который делят. */
  caption?: string
  /** Пункты первого уровня: ключи link и invite. */
  itemsText?: Record<string, string>
  /** Расширение рядом с форматом: ключ — название формата. */
  extensionText?: Record<string, string>
  accent?: string
  /** Подложка карточки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: пункт «Экспортировать как» раскрывает второй уровень
// с форматами файла. Как и в любом вложенном меню, второй popover=auto
// закрыл бы первый — второй уровень поэтому обычный абсолютный слой внутри
// первого popover. Стрелка вправо входит в подменю и ставит фокус на первый
// формат, стрелка влево выходит и возвращает фокус на родительский пункт.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте карточка светлее фона страницы, а её граница светлее карточки.
const STYLES = `
:where([data-vibeui-block="dropdown-015"]){
--vibeui-dropdown-015-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 220));
--vibeui-dropdown-015-fg:light-dark(oklch(0.24 0.014 220),oklch(0.94 0.006 220));
--vibeui-dropdown-015-muted:color-mix(in oklab,var(--vibeui-dropdown-015-fg) 68%,transparent);
--vibeui-dropdown-015-border:light-dark(oklch(0.9 0.006 220),oklch(0.37 0.012 220));
--vibeui-dropdown-015-hover:light-dark(oklch(0.96 0.004 220),oklch(0.32 0.014 220));
--vibeui-dropdown-015-accent:light-dark(oklch(0.56 0.17 220),oklch(0.76 0.13 220));
--vibeui-dropdown-015-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-015"]{color-scheme:dark}
[data-vibeui-block="dropdown-015"]{
position:relative;display:inline-flex;flex-direction:column;gap:0.4375rem;
box-sizing:border-box;padding:0.625rem 0.75rem;
background:var(--vibeui-dropdown-015-bg);color:var(--vibeui-dropdown-015-fg);
border:1px solid var(--vibeui-dropdown-015-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-015-font);
}
[data-vibeui-block="dropdown-015"] [data-part="caption"]{
font-size:0.75rem;color:var(--vibeui-dropdown-015-muted);
}
[data-vibeui-block="dropdown-015"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2.125rem;padding:0 0.875rem;
border:1px solid var(--vibeui-dropdown-015-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-015-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-015-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-015"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-015-hover)}
[data-vibeui-block="dropdown-015"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-015-accent);outline-offset:2px}
[data-vibeui-block="dropdown-015"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:12.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-015-bg);color:var(--vibeui-dropdown-015-fg);
border:1px solid var(--vibeui-dropdown-015-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 220 / 45%);
font-family:var(--vibeui-dropdown-015-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-015"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-015"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-015"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-015-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
@supports not (anchor-name: --a){
[data-vibeui-block="dropdown-015"] [data-part="menu"]{position:absolute;top:calc(100% + 0.375rem);left:0;inset:auto}
}
[data-vibeui-block="dropdown-015"] [data-part="item"]{
display:flex;align-items:center;gap:0.75rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-015"] [data-part="item"]:hover,
[data-vibeui-block="dropdown-015"] [data-part="item"][aria-expanded="true"]{background:var(--vibeui-dropdown-015-hover)}
[data-vibeui-block="dropdown-015"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-015-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-015"] [data-part="arrow"]{
margin-left:auto;width:0.3125rem;height:0.3125rem;flex:none;
border-top:1.5px solid var(--vibeui-dropdown-015-muted);
border-right:1.5px solid var(--vibeui-dropdown-015-muted);
transform:rotate(45deg);
}
[data-vibeui-block="dropdown-015"] [data-part="nest"]{position:relative}
/* Подменю живёт внутри popover обычным слоем: второй popover закрыл бы первый. */
[data-vibeui-block="dropdown-015"] [data-part="sub"]{
position:absolute;top:-0.3125rem;left:calc(100% + 0.25rem);z-index:1;
padding:0.3125rem;min-width:9.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-015-bg);
border:1px solid var(--vibeui-dropdown-015-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 220 / 45%);
}
[data-vibeui-block="dropdown-015"][data-side="left"] [data-part="sub"]{left:auto;right:calc(100% + 0.25rem)}
[data-vibeui-block="dropdown-015"] [data-part="ext"]{
margin-left:auto;flex:none;
font-size:0.6875rem;font-weight:700;letter-spacing:0.02em;
color:var(--vibeui-dropdown-015-muted);
}
[data-vibeui-block="dropdown-015"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-015-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-015"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FORMATS = ["PDF-документ", "PNG-изображение", "CSV-таблица"]

const EXTENSIONS: Record<string, string> = {
  "PDF-документ": ".pdf",
  "PNG-изображение": ".png",
  "CSV-таблица": ".csv",
}

const DEFAULT_ITEMS: Record<string, string> = {
  link: "Ссылка для просмотра",
  invite: "Пригласить соавтора",
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
 * Меню с подменю второго уровня: экспорт в один из форматов.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown015({
  trigger = "Поделиться",
  side = "right",
  submenuLabel = "Экспортировать как",
  formats = DEFAULT_FORMATS,
  caption = "Презентация Q3.key",
  itemsText = DEFAULT_ITEMS,
  extensionText = EXTENSIONS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown015Props) {
  const id = useId()
  const anchor = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const parent = useRef<HTMLButtonElement>(null)
  const sub = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [subOpen, setSubOpen] = useState(false)

  const close = () => {
    setSubOpen(false)
    menu.current?.hidePopover()
    anchor.current?.focus()
  }

  const enterSub = () => {
    setSubOpen(true)
    requestAnimationFrame(() =>
      sub.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const leaveSub = () => {
    setSubOpen(false)
    parent.current?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-015-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-015-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-015" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-015"
        data-side={side}
        className={className}
        style={palette}
      >
        <span data-part="caption">{caption}</span>
        <button
          ref={anchor}
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
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
          onToggle={(event) => {
            const isOpen = event.newState === "open"
            setMenuOpen(isOpen)
            if (!isOpen) {
              setSubOpen(false)
            }
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
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {itemsText.link ?? DEFAULT_ITEMS.link}
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {itemsText.invite ?? DEFAULT_ITEMS.invite}
          </button>
          <div data-part="rule" role="separator" />
          <div
            data-part="nest"
            onMouseEnter={() => setSubOpen(true)}
            onMouseLeave={() => setSubOpen(false)}
          >
            <button
              type="button"
              ref={parent}
              role="menuitem"
              data-part="item"
              aria-haspopup="menu"
              aria-expanded={subOpen}
              onClick={() => (subOpen ? setSubOpen(false) : enterSub())}
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
            {subOpen ? (
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
                {formats.map((format) => (
                  <button
                    key={format}
                    type="button"
                    role="menuitem"
                    data-part="item"
                    onClick={close}
                  >
                    {format}
                    <span data-part="ext">{extensionText[format] ?? ""}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
