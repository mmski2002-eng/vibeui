"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown007Props = Omit<ComponentProps<"div">, "children"> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  trigger?: string
  dangerLabel?: string
  items?: string[]
  /** Подпись слева от кнопки: над каким объектом меню. */
  caption?: string
  /** Имя опасной зоны для скринридера. */
  zoneLabel?: string
  /** Вопрос второго шага. */
  confirmQuestion?: string
  /** Подпись подтверждения. */
  confirmLabel?: string
  /** Подпись отмены. */
  cancelLabel?: string
  accent?: string
  /** Подложка панели и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: необратимое действие вынесено из общего списка в отдельную
// зону внизу — с собственной подложкой, отступом и подтверждением на месте.
// Красный текст рядом с «дублировать» ловит промах мышью; отдельная зона и
// второй шаг («точно удалить?») превращают промах в безобидное нажатие.
// Подтверждение живёт в том же меню: диалог поверх меню — ещё один слой.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-007"]){
--vibeui-dropdown-007-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-007-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-007-muted:color-mix(in oklab,var(--vibeui-dropdown-007-fg) 68%,transparent);
--vibeui-dropdown-007-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-007-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-dropdown-007-accent:light-dark(oklch(0.55 0.17 265),oklch(0.74 0.15 265));
--vibeui-dropdown-007-danger:light-dark(oklch(0.55 0.2 27),oklch(0.68 0.18 27));
--vibeui-dropdown-007-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-007"]{color-scheme:dark}
[data-vibeui-block="dropdown-007"]{
display:inline-flex;align-items:center;gap:0.75rem;
box-sizing:border-box;padding:0.5rem 0.5rem 0.5rem 0.875rem;
background:var(--vibeui-dropdown-007-bg);color:var(--vibeui-dropdown-007-fg);
border:1px solid var(--vibeui-dropdown-007-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-007-font);
}
[data-vibeui-block="dropdown-007"] [data-part="caption"]{font-size:0.8125rem;font-weight:600}
[data-vibeui-block="dropdown-007"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;justify-content:center;
width:2rem;height:2rem;
border:1px solid var(--vibeui-dropdown-007-border);border-radius:0.625rem;
background:var(--vibeui-dropdown-007-bg);color:inherit;
font:inherit;font-size:0.875rem;line-height:1;
anchor-name:--vibeui-dropdown-007-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-007"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-007-hover)}
[data-vibeui-block="dropdown-007"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-007-accent);outline-offset:2px}
[data-vibeui-block="dropdown-007"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:14rem;box-sizing:border-box;
background:var(--vibeui-dropdown-007-bg);color:var(--vibeui-dropdown-007-fg);
border:1px solid var(--vibeui-dropdown-007-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0 265 / 45%);
font-family:var(--vibeui-dropdown-007-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-007"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-007"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-007"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-007-anchor;
position-area:bottom span-left;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-007"] [data-part="item"]{
display:block;width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-007"] [data-part="item"]:hover{background:var(--vibeui-dropdown-007-hover)}
[data-vibeui-block="dropdown-007"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-007-accent);outline-offset:-2px}
/* Отдельная зона внизу: промах мышью не должен попадать в «удалить». */
[data-vibeui-block="dropdown-007"] [data-part="zone"]{
margin:0.5rem -0.3125rem -0.3125rem;padding:0.5rem;
border-top:1px solid var(--vibeui-dropdown-007-border);
border-radius:0 0 0.6875rem 0.6875rem;
background:color-mix(in oklab,var(--vibeui-dropdown-007-danger) 7%,transparent);
}
[data-vibeui-block="dropdown-007"] [data-part="danger"]{
display:block;width:100%;box-sizing:border-box;
appearance:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
border:1px solid color-mix(in oklab,var(--vibeui-dropdown-007-danger) 35%,transparent);
background:none;color:var(--vibeui-dropdown-007-danger);
font:inherit;font-size:0.8125rem;font-weight:600;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-007"] [data-part="danger"]:hover{background:color-mix(in oklab,var(--vibeui-dropdown-007-danger) 12%,transparent)}
[data-vibeui-block="dropdown-007"] [data-part="danger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-007-danger);outline-offset:2px}
[data-vibeui-block="dropdown-007"] [data-part="ask"]{
display:flex;flex-direction:column;gap:0.4375rem;
font-size:0.75rem;color:var(--vibeui-dropdown-007-fg);
}
[data-vibeui-block="dropdown-007"] [data-part="row"]{display:flex;gap:0.375rem}
[data-vibeui-block="dropdown-007"] [data-part="confirm"]{
flex:1;appearance:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0;border:0;border-radius:0.5rem;
background:var(--vibeui-dropdown-007-danger);color:oklch(0.99 0 0);
font:inherit;font-size:0.75rem;font-weight:650;
}
[data-vibeui-block="dropdown-007"] [data-part="cancel"]{
flex:1;appearance:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;
min-height:1.875rem;padding:0.25rem 0;border:1px solid var(--vibeui-dropdown-007-border);border-radius:0.5rem;
background:var(--vibeui-dropdown-007-bg);color:inherit;
font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="dropdown-007"] [data-part="confirm"]:focus-visible,
[data-vibeui-block="dropdown-007"] [data-part="cancel"]:focus-visible{outline:2px solid var(--vibeui-dropdown-007-accent);outline-offset:2px}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-007"]:has([data-open="true"]){flex-wrap:wrap}
[data-vibeui-block="dropdown-007"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;flex-basis:100%;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-007"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS = ["Открыть", "Переименовать", "Дублировать", "В архив"]

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
 * Меню, где необратимое действие вынесено в отдельную зону с подтверждением.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown007({
  open = false,
  trigger = "Ещё",
  dangerLabel = "Удалить проект",
  items = DEFAULT_ITEMS,
  caption = "Лендинг «Весна»",
  zoneLabel = "Необратимое действие",
  confirmQuestion = "Удалить без возможности вернуть?",
  confirmLabel = "Да, удалить",
  cancelLabel = "Отмена",
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown007Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const [asking, setAsking] = useState(false)

  const palette = {
    ...(accent ? { "--vibeui-dropdown-007-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-007-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-007" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-007"
        className={className}
        style={palette}
      >
        <span data-part="caption">{caption}</span>
        <button
          type="button"
          data-part="trigger"
          popoverTarget={`${id}-menu`}
          aria-haspopup="menu"
          aria-label={trigger}
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
          <span aria-hidden="true">•••</span>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={trigger}
          data-part="menu"
          onToggle={() => setAsking(false)}
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
          <div data-part="zone" role="group" aria-label={zoneLabel}>
            {asking ? (
              <div data-part="ask">
                <span id={`${id}-ask`}>{confirmQuestion}</span>
                <div data-part="row">
                  <button
                    type="button"
                    data-part="confirm"
                    aria-describedby={`${id}-ask`}
                    onClick={() => {
                      setAsking(false)
                      menu.current?.hidePopover()
                    }}
                  >
                    {confirmLabel}
                  </button>
                  <button
                    type="button"
                    data-part="cancel"
                    onClick={() => setAsking(false)}
                  >
                    {cancelLabel}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                role="menuitem"
                data-part="danger"
                onClick={() => setAsking(true)}
              >
                {dangerLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
