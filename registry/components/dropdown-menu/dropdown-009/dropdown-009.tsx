"use client"

import { useId, useRef, useState } from "react"
import type { ComponentProps, CSSProperties, KeyboardEvent } from "react"

export type Dropdown009Props = Omit<
  ComponentProps<"div">,
  "children" | "onChange"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  label?: string
  value?: string
  fields?: string[]
  onChange?: (state: { field: string; desc: boolean }) => void
  /** Заголовок радиогруппы полей. */
  fieldsLabel?: string
  /** Заголовок радиогруппы направления. */
  orderLabel?: string
  /** Направление в кнопке: ключи asc и desc. */
  directionText?: Record<string, string>
  /** Направление пунктами меню: ключи asc и desc. */
  orderText?: Record<string, string>
  accent?: string
  /** Подложка панели и меню. Пусто — собственный фон по теме окружения. */
  background?: string
}

// Идея компонента: кнопка сортировки, которая сама показывает выбранное поле и
// направление. Закрытое меню — единственное место, где виден текущий порядок
// списка; кнопка с одним словом «Сортировка» заставляет открывать меню, чтобы
// вспомнить, что в нём выбрано. Направление вынесено отдельной парой пунктов:
// «сначала новые» и «сначала старые» — это одно поле, а не два.
//
// Тема берётся из color-scheme окружения через light-dark(): в тёмном
// контексте панель светлее фона страницы, а её граница светлее панели.
const STYLES = `
:where([data-vibeui-block="dropdown-009"]){
--vibeui-dropdown-009-bg:light-dark(oklch(1 0 0),oklch(0.25 0 265));
--vibeui-dropdown-009-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-dropdown-009-muted:color-mix(in oklab,var(--vibeui-dropdown-009-fg) 68%,transparent);
--vibeui-dropdown-009-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-dropdown-009-hover:light-dark(oklch(0.96 0 265),oklch(0.32 0 265));
--vibeui-dropdown-009-accent:light-dark(oklch(0.295 0 0),oklch(0.906 0 0));
--vibeui-dropdown-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="dropdown-009"]{color-scheme:dark}
[data-vibeui-block="dropdown-009"]{
display:inline-flex;box-sizing:border-box;padding:0.375rem;
background:var(--vibeui-dropdown-009-bg);color:var(--vibeui-dropdown-009-fg);
border:1px solid var(--vibeui-dropdown-009-border);border-radius:0.875rem;
font-family:var(--vibeui-dropdown-009-font);
}
[data-vibeui-block="dropdown-009"] [data-part="trigger"]{
appearance:none;cursor:pointer;
display:inline-flex;align-items:center;gap:0.5rem;
height:2rem;padding:0 0.625rem;
border:0;border-radius:0.625rem;background:none;color:inherit;
font:inherit;font-size:0.8125rem;
anchor-name:--vibeui-dropdown-009-anchor;
transition:background-color .16s ease;
}
[data-vibeui-block="dropdown-009"] [data-part="trigger"]:hover{background:var(--vibeui-dropdown-009-hover)}
[data-vibeui-block="dropdown-009"] [data-part="trigger"]:focus-visible{outline:2px solid var(--vibeui-dropdown-009-accent);outline-offset:2px}
[data-vibeui-block="dropdown-009"] [data-part="key"]{color:var(--vibeui-dropdown-009-muted)}
/* Выбранное значение живёт в кнопке: закрытое меню больше нигде не видно. */
[data-vibeui-block="dropdown-009"] [data-part="value"]{font-weight:650}
[data-vibeui-block="dropdown-009"] [data-part="dir"]{
display:inline-flex;width:0.875rem;height:0.875rem;flex:none;
color:var(--vibeui-dropdown-009-accent);
transition:transform .16s ease;
}
[data-vibeui-block="dropdown-009"][data-desc="true"] [data-part="dir"]{transform:rotate(180deg)}
[data-vibeui-block="dropdown-009"] [data-part="menu"]{
position:fixed;padding:0.3125rem;min-width:13.5rem;box-sizing:border-box;
background:var(--vibeui-dropdown-009-bg);color:var(--vibeui-dropdown-009-fg);
border:1px solid var(--vibeui-dropdown-009-border);border-radius:0.75rem;
box-shadow:0 18px 40px -22px oklch(0.2 0 265 / 45%);
font-family:var(--vibeui-dropdown-009-font);
opacity:0;transform:translateY(-0.25rem);
transition:opacity .14s ease,transform .14s ease,display .14s allow-discrete,overlay .14s allow-discrete;
}
[data-vibeui-block="dropdown-009"] [data-part="menu"]:popover-open{opacity:1;transform:none}
@starting-style{[data-vibeui-block="dropdown-009"] [data-part="menu"]:popover-open{opacity:0;transform:translateY(-0.25rem)}}
@supports (anchor-name: --a){
[data-vibeui-block="dropdown-009"] [data-part="menu"]{
position-anchor:--vibeui-dropdown-009-anchor;
position-area:bottom span-right;margin:0.375rem 0 0;
position-try-fallbacks:flip-block,flip-inline;
}
}
[data-vibeui-block="dropdown-009"] [data-part="title"]{
padding:0.4375rem 0.5rem 0.25rem;
font-size:0.6875rem;font-weight:650;letter-spacing:0.06em;text-transform:uppercase;
color:var(--vibeui-dropdown-009-muted);
}
[data-vibeui-block="dropdown-009"] [data-part="item"]{
display:flex;align-items:center;gap:0.5rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="dropdown-009"] [data-part="item"]:hover{background:var(--vibeui-dropdown-009-hover)}
[data-vibeui-block="dropdown-009"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-dropdown-009-accent);outline-offset:-2px}
[data-vibeui-block="dropdown-009"] [data-part="item"][aria-checked="true"]{
background:color-mix(in oklab,var(--vibeui-dropdown-009-accent) 10%,transparent);font-weight:600;
}
[data-vibeui-block="dropdown-009"] [data-part="tick"]{
margin-left:auto;width:0.9375rem;height:0.9375rem;flex:none;
color:var(--vibeui-dropdown-009-accent);opacity:0;
}
[data-vibeui-block="dropdown-009"] [data-part="item"][aria-checked="true"] [data-part="tick"]{opacity:1}
[data-vibeui-block="dropdown-009"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-dropdown-009-border);
}
/* Развёрнутый режим: меню стоит в потоке под кнопкой, а не в верхнем слое. */
[data-vibeui-block="dropdown-009"]:has([data-open="true"]){flex-direction:column;align-items:flex-start}
[data-vibeui-block="dropdown-009"] [data-part="menu"][data-open="true"]{
position:static;opacity:1;transform:none;margin-top:0.375rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS = ["Дата изменения", "Название", "Размер", "Автор"]
const DEFAULT_DIRECTION = { asc: "по возрастанию", desc: "по убыванию" }
const DEFAULT_ORDER = { asc: "По возрастанию", desc: "По убыванию" }

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
 * Меню сортировки: выбранное поле и направление показаны прямо в кнопке.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Dropdown009({
  open = false,
  label = "Сортировка",
  value = "Дата изменения",
  fields = DEFAULT_FIELDS,
  onChange,
  fieldsLabel = "Поле",
  orderLabel = "Порядок",
  directionText = DEFAULT_DIRECTION,
  orderText = DEFAULT_ORDER,
  accent,
  background = "",
  className,
  style,
  ...props
}: Dropdown009Props) {
  const id = useId()
  const menu = useRef<HTMLDivElement>(null)
  const [field, setField] = useState(value)
  const [desc, setDesc] = useState(true)

  const apply = (next: { field?: string; desc?: boolean }) => {
    const state = { field: next.field ?? field, desc: next.desc ?? desc }
    setField(state.field)
    setDesc(state.desc)
    onChange?.(state)

    // Направление применяется так же, как поле: список за спиной уже
    // перестроился, и держать меню открытым не за чем.
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-009-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-dropdown-009-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-slot="dropdown-menu"
        data-vibeui-block="dropdown-009"
        data-desc={desc}
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
                    .querySelector<HTMLElement>('[aria-checked="true"]')
                    ?.focus(),
                )
              }
            }
          }}
        >
          <span data-part="key">{label}:</span>
          <span data-part="value">{field}</span>
          <svg
            data-part="dir"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 20V4M12 4l-6 6M12 4l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span data-part="key">
            {desc
              ? (directionText.desc ?? DEFAULT_DIRECTION.desc)
              : (directionText.asc ?? DEFAULT_DIRECTION.asc)}
          </span>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={label}
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
          <div data-part="title" id={`${id}-fields`}>
            {fieldsLabel}
          </div>
          <div role="group" aria-labelledby={`${id}-fields`}>
            {fields.map((entry) => (
              <button
                key={entry}
                type="button"
                role="menuitemradio"
                aria-checked={field === entry}
                data-part="item"
                onClick={() => apply({ field: entry })}
              >
                {entry}
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
          <div data-part="title" id={`${id}-dir`}>
            {orderLabel}
          </div>
          <div role="group" aria-labelledby={`${id}-dir`}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={!desc}
              data-part="item"
              onClick={() => apply({ desc: false })}
            >
              {orderText.asc ?? DEFAULT_ORDER.asc}
            </button>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={desc}
              data-part="item"
              onClick={() => apply({ desc: true })}
            >
              {orderText.desc ?? DEFAULT_ORDER.desc}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
