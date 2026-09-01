"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent } from "react"

export type Contextmenu006Row = {
  name: string
  status: string
  sum: string
}

export type Contextmenu006Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  caption?: string
  rows?: Contextmenu006Row[]
  accent?: string
}

// Идея компонента: контекстное меню строки таблицы. Строка получает tabindex и
// подсветку, пока меню открыто: в таблице из двадцати строк «удалить» без
// видимой цели — это рулетка. Клавиша вызова меню и Shift+F10 приходят тем же
// событием contextmenu, но без координат курсора, поэтому при нулевых
// координатах меню встаёт по краю самой строки, а не в углу экрана.
const STYLES = `
:where([data-vibeui-block="contextmenu-006"]){
--vibeui-contextmenu-006-bg:oklch(1 0 0);
--vibeui-contextmenu-006-fg:oklch(0.24 0.014 265);
--vibeui-contextmenu-006-muted:oklch(0.55 0.014 265);
--vibeui-contextmenu-006-border:oklch(0.9 0.006 265);
--vibeui-contextmenu-006-hover:oklch(0.97 0.003 265);
--vibeui-contextmenu-006-accent:oklch(0.55 0.18 250);
--vibeui-contextmenu-006-danger:oklch(0.56 0.19 25);
--vibeui-contextmenu-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-006-x:50%;
--vibeui-contextmenu-006-y:50%;
}
[data-vibeui-block="contextmenu-006"]{
display:block;width:100%;max-width:26rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-006-bg);color:var(--vibeui-contextmenu-006-fg);
border:1px solid var(--vibeui-contextmenu-006-border);border-radius:0.875rem;
font-family:var(--vibeui-contextmenu-006-font);overflow:hidden;
}
[data-vibeui-block="contextmenu-006"] table{width:100%;border-collapse:collapse;font-size:0.8125rem}
[data-vibeui-block="contextmenu-006"] caption{
padding:0.625rem 0.875rem;text-align:left;
font-size:0.75rem;color:var(--vibeui-contextmenu-006-muted);
border-bottom:1px solid var(--vibeui-contextmenu-006-border);
}
[data-vibeui-block="contextmenu-006"] th{
padding:0.5rem 0.875rem;text-align:left;font-size:0.6875rem;font-weight:650;
letter-spacing:0.04em;text-transform:uppercase;color:var(--vibeui-contextmenu-006-muted);
border-bottom:1px solid var(--vibeui-contextmenu-006-border);
}
[data-vibeui-block="contextmenu-006"] td{
padding:0.5rem 0.875rem;border-bottom:1px solid var(--vibeui-contextmenu-006-border);
}
[data-vibeui-block="contextmenu-006"] tbody tr:last-child td{border-bottom:0}
[data-vibeui-block="contextmenu-006"] tbody tr{touch-action:manipulation;transition:background-color .14s ease}
[data-vibeui-block="contextmenu-006"] tbody tr:hover{background:var(--vibeui-contextmenu-006-hover)}
[data-vibeui-block="contextmenu-006"] tbody tr:focus-visible{outline:2px solid var(--vibeui-contextmenu-006-accent);outline-offset:-2px}
/* Пока меню открыто, видно, к какой строке оно относится. */
[data-vibeui-block="contextmenu-006"] tbody tr[aria-selected="true"]{
background:color-mix(in oklab,var(--vibeui-contextmenu-006-accent) 10%,transparent);
}
[data-vibeui-block="contextmenu-006"] [data-part="tag"]{
display:inline-block;padding:0.0625rem 0.4375rem;border-radius:9999px;
background:var(--vibeui-contextmenu-006-hover);
border:1px solid var(--vibeui-contextmenu-006-border);
font-size:0.6875rem;color:var(--vibeui-contextmenu-006-muted);
}
[data-vibeui-block="contextmenu-006"] [data-part="sum"]{text-align:right;font-variant-numeric:tabular-nums}
[data-vibeui-block="contextmenu-006"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-006-y);left:var(--vibeui-contextmenu-006-x);
min-width:13rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-006-bg);color:var(--vibeui-contextmenu-006-fg);
border:1px solid var(--vibeui-contextmenu-006-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px oklch(0.2 0.03 265 / 50%);
font-family:var(--vibeui-contextmenu-006-font);
}
[data-vibeui-block="contextmenu-006"] [data-part="head"]{
padding:0.375rem 0.5rem 0.3125rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-006-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-contextmenu-006-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-006"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.25rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-006"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-006-hover)}
[data-vibeui-block="contextmenu-006"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-006-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-006"] [data-part="item"][data-danger="true"]{color:var(--vibeui-contextmenu-006-danger)}
[data-vibeui-block="contextmenu-006"] [data-part="keys"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-006-muted)}
[data-vibeui-block="contextmenu-006"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-contextmenu-006-border);
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Contextmenu006Row[] = [
  { name: "ООО «Полдень»", status: "Оплачен", sum: "84 000 ₽" },
  { name: "Ирина Ковалёва", status: "Ждёт оплаты", sum: "12 500 ₽" },
  { name: "Студия «Круг»", status: "Черновик", sum: "31 200 ₽" },
]

const ACTIONS = [
  { label: "Открыть карточку", keys: "↵" },
  { label: "Скопировать ссылку", keys: "⌘L" },
  { label: "Дублировать строку", keys: "⌘D" },
]

/**
 * Контекстное меню строки таблицы: подсветка цели и вызов с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu006({
  caption = "Счета за март",
  rows = DEFAULT_ROWS,
  accent,
  className,
  style,
  ...props
}: Contextmenu006Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [target, setTarget] = useState<string | null>(null)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)

  const openAt = (x: number, y: number, name: string) => {
    setTarget(name)
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  // Клавиша меню и Shift+F10 приходят тем же событием, но без координат.
  const onContextMenu = (
    event: MouseEvent<HTMLTableRowElement>,
    name: string,
  ) => {
    event.preventDefault()

    if (event.clientX === 0 && event.clientY === 0) {
      const box = event.currentTarget.getBoundingClientRect()
      openAt(box.left + 16, box.bottom, name)
      return
    }

    openAt(event.clientX, event.clientY, name)
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-006-accent": accent } : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-006-x": spot.x,
          "--vibeui-contextmenu-006-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-006" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="contextmenu-006"
        aria-label={caption}
        className={className}
        style={palette}
      >
        <table>
          <caption>{caption} · правый клик по строке или Shift+F10</caption>
          <thead>
            <tr>
              <th scope="col">Клиент</th>
              <th scope="col">Статус</th>
              <th scope="col">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.name}
                tabIndex={0}
                aria-selected={target === row.name}
                onContextMenu={(event) => onContextMenu(event, row.name)}
              >
                <td>{row.name}</td>
                <td>
                  <span data-part="tag">{row.status}</span>
                </td>
                <td data-part="sum">{row.sum}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          ref={menu}
          data-part="menu"
          popover="auto"
          role="menu"
          aria-label={target ? `Строка: ${target}` : "Строка"}
          onToggle={() => {
            if (!menu.current?.matches(":popover-open")) {
              setTarget(null)
            }
          }}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
              return
            }

            event.preventDefault()
            const items = Array.from(
              menu.current?.querySelectorAll<HTMLElement>(
                '[data-part="item"]',
              ) ?? [],
            )

            if (items.length === 0) {
              return
            }

            const delta = event.key === "ArrowDown" ? 1 : -1
            const from = items.indexOf(document.activeElement as HTMLElement)
            items[(from + delta + items.length) % items.length].focus()
          }}
        >
          <div data-part="head">{target}</div>
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              data-part="item"
              onClick={() => menu.current?.hidePopover()}
            >
              {action.label}
              <span data-part="keys">{action.keys}</span>
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
            Удалить строку
            <span data-part="keys">⌫</span>
          </button>
        </div>
      </section>
    </>
  )
}
