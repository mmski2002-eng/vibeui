"use client"

import { useId, useRef } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown002Section = {
  title: string
  items: string[]
}

export type Dropdown002Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  align?: "left" | "right"
  sections?: Dropdown002Section[]
  /** Подпись слева от кнопки: чем именно управляет это меню. */
  caption?: string
  accent?: string
  /** Подложка карточки и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: длинное меню, разложенное по разделам с видимыми
// заголовками. Пятнадцать пунктов подряд читаются как список ошибок, а
// заголовок группы отвечает на вопрос «где искать» до чтения самих пунктов.
// Открытие и слой держит HTML popover, положение — CSS anchor positioning,
// стрелки водят фокус по пунктам, заголовки при этом пропускаются.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-002"]){
--vibeui-dropdown-002-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-002-muted:color-mix(in oklab,var(--vibeui-dropdown-002-fg) 68%,transparent);
--vibeui-dropdown-002-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-002-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-dropdown-002-accent:light-dark(oklch(0.287 0 0),oklch(0.903 0 0));
--vibeui-dropdown-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-002"]{color-scheme:dark}
[data-vibeui-block="dropdown-002"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;max-width:22rem;box-sizing:border-box;padding:0.5rem 0.5rem 0.5rem 0.875rem;
background:var(--vibeui-dropdown-002-bg);color:var(--vibeui-dropdown-002-fg);
border:1px solid var(--vibeui-dropdown-002-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-002-font);
}
[data-vibeui-block="dropdown-002"] [data-part="caption"]{
font-size:0.8125rem;font-weight:600;letter-spacing:-0.01em;
}
[data-vibeui-block="dropdown-002"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.4375rem;
height:2rem;padding:0 0.75rem;
border:1px solid var(--vibeui-dropdown-002-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-002-bg);color:inherit;
font:inherit;font-size:0.8125rem;font-weight:600;
anchor-name:--vibeui-dropdown-002-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-002"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-002-hover)}
[data-vibeui-block="dropdown-002"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-002-accent);outline-offset:2px}
[data-vibeui-block="dropdown-002"] [data-part="caret"]{
width:0.375rem;height:0.375rem;
border-right:1.5px solid var(--vibeui-dropdown-002-muted);
border-bottom:1.5px solid var(--vibeui-dropdown-002-muted);
transform:rotate(45deg) translate(-0.0625rem,-0.0625rem);
}
[data-vibeui-block="dropdown-002"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:13rem;box-sizing:border-box;
background:var(--vibeui-dropdown-002-bg);color:var(--vibeui-dropdown-002-fg);
border:1px solid var(--vibeui-dropdown-002-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0 265 / 45%);
font-family:var(--vibeui-dropdown-002-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-002"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-002"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
/* Привязка к кнопке. Где якорей нет, меню открывается по центру экрана. */
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-002"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-002-anchor;
position-area:bottom span-left;
margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
[data-vibeui-block="dropdown-002"][data-align="left"] [data-part="menu"]{position-area:bottom span-right}
}
[data-vibeui-block="dropdown-002"] [data-part="title"]{
padding:0.4375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-002-muted);
}
[data-vibeui-block="dropdown-002"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;
background:var(--vibeui-dropdown-002-border);
}
[data-vibeui-block="dropdown-002"] [data-part="item"]{
display:block;width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-002"] [data-part="item"]:hover{background:var(--vibeui-dropdown-002-hover)}
[data-vibeui-block="dropdown-002"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-002-accent);outline-offset:-2px}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-002"]:has([data-open="true"]){flex-wrap:wrap}
[data-vibeui-block="dropdown-002"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;flex-basis:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_SECTIONS: Dropdown002Section[] = [
  { title: "Документ", items: ["Переименовать", "Дублировать", "Переместить"] },
  { title: "Доступ", items: ["Пригласить людей", "Ссылка для чтения"] },
  { title: "Экспорт", items: ["PDF", "Markdown", "HTML"] },
]

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

/**
 * Меню с разделами: видимые заголовки групп, разделители, навигация стрелками.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown002({
  open = false,
  trigger = "Действия",
  align = "right",
  sections = DEFAULT_SECTIONS,
  caption = "Годовой отчёт",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown002Props) {
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

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      stepFocus(menu.current, 1)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      stepFocus(menu.current, -1)
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-002"
        data-align={align}
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
              openAndFocus()
            }
          }}
        >
          {trigger}
          <span data-part="caret" aria-hidden="true" />
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={trigger}
          data-part="menu"
          onKeyDown={onMenuKeyDown}
        >
          {sections.map((section, index) => (
            <div
              key={section.title}
              role="group"
              aria-labelledby={`${id}-${index}`}
            >
              {index > 0 ? <div data-part="rule" role="separator" /> : null}
              <div id={`${id}-${index}`} data-part="title">
                {section.title}
              </div>
              {section.items.map((item) => (
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
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
