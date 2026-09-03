"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown017Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  value?: string
  fields?: string[]
  recommended?: string
  onChange?: (value: string) => void
  /** Заголовок меню и доступное имя списка. */
  menuLabel?: string
  /** Доступное имя кнопки. Плейсхолдер {value}. */
  triggerLabelTemplate?: string
  /** Подпись бейджа у рекомендованного поля. */
  recommendedText?: string
  accent?: string
  /** Подложка плашки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: радиогруппа сортировки по одному полю — без второй группы
// с направлением, как в Sort Menu: список читается быстрее, если он решает
// один вопрос, а не два сразу. Кнопка-триггер — маленькая иконка, а не
// текстовая подпись: компонент рассчитан на панель инструментов, где рядом
// уже стоит название таблицы. Рекомендованное поле помечено бейджем.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте плашка светлее фона страницы, а её граница светлее плашки.
const STYLES = `
:where([data-vibeui-block="dropdown-017"]){
--vibeui-dropdown-017-bg:light-dark(oklch(1 0 0),oklch(0.25 0.012 235));
--vibeui-dropdown-017-fg:light-dark(oklch(0.24 0.014 235),oklch(0.94 0.006 235));
--vibeui-dropdown-017-muted:color-mix(in oklab,var(--vibeui-dropdown-017-fg) 68%,transparent);
--vibeui-dropdown-017-border:light-dark(oklch(0.9 0.006 235),oklch(0.37 0.012 235));
--vibeui-dropdown-017-hover:light-dark(oklch(0.96 0.004 235),oklch(0.32 0.014 235));
--vibeui-dropdown-017-accent:light-dark(oklch(0.56 0.17 235),oklch(0.76 0.13 235));
--vibeui-dropdown-017-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-017"]{color-scheme:dark}
[data-vibeui-block="dropdown-017"]{
position:relative;display:inline-flex;align-items:center;gap:0.625rem;
box-sizing:border-box;padding:0.5rem 0.875rem 0.5rem 0.625rem;
background:var(--vibeui-dropdown-017-bg);color:var(--vibeui-dropdown-017-fg);
border:1px solid var(--vibeui-dropdown-017-border);border-radius:9999px;
font-family:var(--vibeui-dropdown-017-font);
}
[data-vibeui-block="dropdown-017"] [data-part="value"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="dropdown-017"] [data-part="trigger"]{
appearance:none;cursor:pointer;flex:none;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;
border:1px solid var(--vibeui-dropdown-017-border);border-radius:9999px;
background:var(--vibeui-dropdown-017-bg);color:var(--vibeui-dropdown-017-muted);
anchor-name:--vibeui-dropdown-017-anchor;
transition:background-color .16s ease,color .16s ease;
}
[data-vibeui-block="dropdown-017"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-017-hover);color:var(--vibeui-dropdown-017-fg)}
[data-vibeui-block="dropdown-017"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-017-accent);outline-offset:2px}
[data-vibeui-block="dropdown-017"] [data-part="trigger"] svg{width:1rem;height:1rem}
[data-vibeui-block="dropdown-017"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:12.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-017-bg);color:var(--vibeui-dropdown-017-fg);
border:1px solid var(--vibeui-dropdown-017-border);border-radius:0.875rem;
box-shadow:0 18px 40px -22px oklch(0.2 0.03 235 / 45%);
font-family:var(--vibeui-dropdown-017-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-017"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-017"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-017"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-017-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
@supports not (anchor-name: --a){
[data-vibeui-block="dropdown-017"] [data-part="menu"]{position:absolute;top:calc(100% + 0.375rem);right:0;inset:auto}
}
[data-vibeui-block="dropdown-017"] [data-part="title"]{
padding:0.4375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-017-muted);
}
[data-vibeui-block="dropdown-017"] [data-part="item"]{
display:flex;align-items:center;gap:0.625rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.625rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-017"] [data-part="item"]:hover{background:var(--vibeui-dropdown-017-hover)}
[data-vibeui-block="dropdown-017"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-017-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-017"] [data-part="item"][aria-checked="true"]{font-weight:650}
[data-vibeui-block="dropdown-017"] [data-part="badge"]{
margin-left:auto;flex:none;
padding:0.0625rem 0.375rem;border-radius:9999px;
background:color-mix(in oklab,var(--vibeui-dropdown-017-accent) 14%,transparent);
color:var(--vibeui-dropdown-017-accent);
font-size:0.625rem;font-weight:700;
}
[data-vibeui-block="dropdown-017"] [data-part="tick"]{
margin-left:auto;width:1rem;height:1rem;flex:none;
color:var(--vibeui-dropdown-017-accent);opacity:0;
}
[data-vibeui-block="dropdown-017"] [data-part="item"][aria-checked="true"] [data-part="tick"]{opacity:1}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-017"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS = ["Дата создания", "Название", "Приоритет", "Исполнитель"]

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
 * Радиогруппа сортировки по одному полю, за иконкой-триггером.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown017({
  value = "Дата создания",
  fields = DEFAULT_FIELDS,
  recommended = "Дата создания",
  onChange,
  menuLabel = "Сортировать по",
  triggerLabelTemplate = "Порядок сортировки: {value}",
  recommendedText = "Рекомендуем",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown017Props) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState(value)
  const [open, setOpen] = useState(false)

  const choose = (field: string) => {
    setPicked(field)
    onChange?.(field)
    menu.current?.hidePopover()
    trigger.current?.focus()
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-017-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-017-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-017" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-017"
        className={className}
        style={palette}
      >
        <span data-part="value">{picked}</span>
        <button
          ref={trigger}
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={triggerLabelTemplate.replace("{value}", picked)}
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
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 5v14M7 5l-3 3M7 5l3 3M17 19V5M17 19l-3-3M17 19l3-3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover="auto"
          role="menu"
          aria-label={menuLabel}
          data-part="menu"
          onToggle={(event) => setOpen(event.newState === "open")}
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
            {menuLabel}
          </div>
          <div role="group" aria-labelledby={`${id}-title`}>
            {fields.map((field) => (
              <button
                key={field}
                type="button"
                role="menuitemradio"
                aria-checked={picked === field}
                data-part="item"
                onClick={() => choose(field)}
              >
                {field}
                {picked === field ? (
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
                ) : field === recommended ? (
                  <span data-part="badge">{recommendedText}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
