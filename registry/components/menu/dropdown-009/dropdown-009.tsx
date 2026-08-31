"use client"

import { useId, useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent,
} from "react"

export type Dropdown009Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "onChange"
> & {
  label?: string
  value?: string
  fields?: string[]
  onChange?: (state: { field: string; desc: boolean }) => void
  accent?: string
}

// Идея компонента: кнопка сортировки, которая сама показывает выбранное поле и
// направление. Закрытое меню — единственное место, где виден текущий порядок
// списка; кнопка с одним словом «Сортировка» заставляет открывать меню, чтобы
// вспомнить, что в нём выбрано. Направление вынесено отдельной парой пунктов:
// «сначала новые» и «сначала старые» — это одно поле, а не два.
const STYLES = `
:where([data-vibeui-block="dropdown-009"]){
--vibeui-dropdown-009-bg:oklch(1 0 0);
--vibeui-dropdown-009-fg:oklch(0.24 0.014 265);
--vibeui-dropdown-009-muted:oklch(0.56 0.014 265);
--vibeui-dropdown-009-border:oklch(0.9 0.006 265);
--vibeui-dropdown-009-hover:oklch(0.96 0.004 265);
--vibeui-dropdown-009-accent:oklch(0.58 0.17 40);
--vibeui-dropdown-009-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
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
box-shadow:0 18px 40px -22px oklch(0.2 0.03 265 / 45%);
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
@media (prefers-reduced-motion:reduce){[data-vibeui-block="dropdown-009"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FIELDS = ["Дата изменения", "Название", "Размер", "Автор"]

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
  label = "Сортировка",
  value = "Дата изменения",
  fields = DEFAULT_FIELDS,
  onChange,
  accent,
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
  }

  const palette = {
    ...(accent ? { "--vibeui-dropdown-009-accent": accent } : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-dropdown-009" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
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
          <span data-part="key">{desc ? "по убыванию" : "по возрастанию"}</span>
        </button>
        <div
          id={`${id}-menu`}
          ref={menu}
          popover="auto"
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
            Поле
          </div>
          <div role="group" aria-labelledby={`${id}-fields`}>
            {fields.map((entry) => (
              <button
                key={entry}
                type="button"
                role="menuitemradio"
                aria-checked={field === entry}
                data-part="item"
                onClick={() => {
                  apply({ field: entry })
                  menu.current?.hidePopover()
                }}
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
            Порядок
          </div>
          <div role="group" aria-labelledby={`${id}-dir`}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={!desc}
              data-part="item"
              onClick={() => apply({ desc: false })}
            >
              По возрастанию
            </button>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={desc}
              data-part="item"
              onClick={() => apply({ desc: true })}
            >
              По убыванию
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
