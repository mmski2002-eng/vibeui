"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties } from "react"

export type Dropdown014Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  row?: string
  meta?: string
  /** Доступное имя кнопки и меню. Плейсхолдер {row}. */
  actionsLabelTemplate?: string
  /** Пункты меню: ключи open, rename, duplicate, download, remove. */
  itemsText?: Record<string, string>
  accent?: string
  /** Подложка строки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: контекстное меню одной строки таблицы. Кнопка «⋯» стоит
// в самой строке, поэтому доступное имя собирается из содержимого строки —
// иначе десять одинаковых кнопок «Действия» неразличимы для скринридера.
// Опасный пункт не прячется в отдельную зону, как в Danger Zone: здесь
// достаточно линии и цвета текста внизу списка, без второго шага подтверждения.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте строка светлее фона страницы, а её граница светлее строки.
const STYLES = `
:where([data-vibeui-block="dropdown-014"]){
--vibeui-dropdown-014-bg:light-dark(oklch(1 0 0),oklch(0.25 0 240));
--vibeui-dropdown-014-fg:light-dark(oklch(0.24 0 240),oklch(0.94 0 240));
--vibeui-dropdown-014-muted:color-mix(in oklab,var(--vibeui-dropdown-014-fg) 68%,transparent);
--vibeui-dropdown-014-border:light-dark(oklch(0.9 0 240),oklch(0.37 0 240));
--vibeui-dropdown-014-hover:light-dark(oklch(0.96 0 240),oklch(0.32 0 240));
--vibeui-dropdown-014-danger:light-dark(oklch(0.56 0.19 25),oklch(0.72 0.16 25));
--vibeui-dropdown-014-accent:light-dark(oklch(0.287 0 0),oklch(0.905 0 0));
--vibeui-dropdown-014-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-014"]{color-scheme:dark}
[data-vibeui-block="dropdown-014"]{
position:relative;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.625rem 0.625rem 0.625rem 0.875rem;
background:var(--vibeui-dropdown-014-bg);color:var(--vibeui-dropdown-014-fg);
border:1px solid var(--vibeui-dropdown-014-border);border-radius:0.75rem;
font-family:var(--vibeui-dropdown-014-font);
}
[data-vibeui-block="dropdown-014"] [data-part="cell"]{
display:flex;flex-direction:column;gap:0.0625rem;min-width:0;
}
[data-vibeui-block="dropdown-014"] [data-part="row"]{
font-size:0.8125rem;font-weight:600;
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="dropdown-014"] [data-part="meta"]{font-size:0.75rem;color:var(--vibeui-dropdown-014-muted)}
[data-vibeui-block="dropdown-014"] [data-part="trigger"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;
border:1px solid var(--vibeui-dropdown-014-border);border-radius:0.5rem;
background:var(--vibeui-dropdown-014-bg);color:var(--vibeui-dropdown-014-muted);
anchor-name:--vibeui-dropdown-014-anchor;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="dropdown-014"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-014-hover);color:var(--vibeui-dropdown-014-fg)}
[data-vibeui-block="dropdown-014"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-014-accent);outline-offset:2px}
[data-vibeui-block="dropdown-014"] [data-part="dots"]{display:flex;gap:0.1875rem}
[data-vibeui-block="dropdown-014"] [data-part="dots"] span{
width:0.1875rem;height:0.1875rem;border-radius:9999px;background:currentColor;
}
[data-vibeui-block="dropdown-014"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:12.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-014-bg);color:var(--vibeui-dropdown-014-fg);
border:1px solid var(--vibeui-dropdown-014-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0 240 / 45%);
font-family:var(--vibeui-dropdown-014-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-014"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-014"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-014"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-014-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
@supports not (anchor-name: --a){
[data-vibeui-block="dropdown-014"] [data-part="menu"]{position:absolute;top:calc(100% + 0.375rem);right:0;inset:auto}
}
[data-vibeui-block="dropdown-014"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-014"] [data-part="item"]:hover{background:var(--vibeui-dropdown-014-hover)}
[data-vibeui-block="dropdown-014"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-014-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-014"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-014-border);
}
/* Опасный пункт красится текстом и стоит за линией внизу — без второй зоны. */
[data-vibeui-block="dropdown-014"] [data-part="item"][data-danger="true"]{color:var(--vibeui-dropdown-014-danger)}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-014"]:has([data-open="true"]){flex-wrap:wrap}
[data-vibeui-block="dropdown-014"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;flex-basis:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-014"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Record<string, string> = {
  open: "Открыть",
  rename: "Переименовать",
  duplicate: "Дублировать",
  download: "Скачать",
  remove: "Удалить строку",
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
 * Меню действий над строкой таблицы: опасный пункт стоит внизу за линией.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown014({
  open = false,
  row = "Отчёт по продажам.xlsx",
  meta = "Изменён вчера в 14:02",
  actionsLabelTemplate = "Действия со строкой: {row}",
  itemsText = DEFAULT_ITEMS,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown014Props) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => {
    menu.current?.hidePopover()
    trigger.current?.focus()
  }

  const actionsLabel = actionsLabelTemplate.replace("{row}", row)
  const item = (key: string) => itemsText[key] ?? DEFAULT_ITEMS[key]

  const palette = {
    ...(accent ? { "--vibeui-dropdown-014-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-014-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-014" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-014"
        className={className}
        style={palette}
      >
        <div data-part="cell">
          <span data-part="row">{row}</span>
          <span data-part="meta">{meta}</span>
        </div>
        <button
          ref={trigger}
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label={actionsLabel}
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
          <span data-part="dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={actionsLabel}
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
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {item("open")}
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {item("rename")}
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {item("duplicate")}
          </button>
          <button
            type="button"
            role="menuitem"
            data-part="item"
            onClick={close}
          >
            {item("download")}
          </button>
          <div data-part="rule" role="separator" />
          <button
            type="button"
            role="menuitem"
            data-part="item"
            data-danger="true"
            onClick={close}
          >
            {item("remove")}
          </button>
        </div>
      </div>
    </>
  )
}
