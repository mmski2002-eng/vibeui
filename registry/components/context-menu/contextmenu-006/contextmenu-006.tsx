"use client"

import { useRef, useState } from "react"
import type { ComponentProps, CSSProperties, MouseEvent } from "react"

export type Contextmenu006Row = {
  name: string
  status: string
  sum: string
}

export type Contextmenu006Action = {
  label: string
  keys?: string
}

export type Contextmenu006Props = Omit<
  ComponentProps<"section">,
  "children"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  caption?: string
  /** Хвост подписи с подсказкой о вызове меню. */
  captionHint?: string
  rows?: Contextmenu006Row[]
  /** Заголовки колонок: компонент несёт русские, проект подставляет свои. */
  columnText?: Record<"name" | "status" | "sum", string>
  actions?: Contextmenu006Action[]
  deleteLabel?: string
  /** Имя открытого меню; {row} — имя строки. */
  menuLabel?: string
  /** Имя меню, когда строка ещё не выбрана. */
  menuTitle?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: контекстное меню строки таблицы. Строка получает tabindex и
// подсветку, пока меню открыто: в таблице из двадцати строк «удалить» без
// видимой цели — это рулетка. Клавиша вызова меню и Shift+F10 приходят тем же
// событием contextmenu, но без координат курсора, поэтому при нулевых
// координатах меню встаёт по краю самой строки, а не в углу экрана.
const STYLES = `
:where([data-vibeui-block="contextmenu-006"]){
--vibeui-contextmenu-006-bg:transparent;
--vibeui-contextmenu-006-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contextmenu-006-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-contextmenu-006-muted:color-mix(in oklab,var(--vibeui-contextmenu-006-fg) 68%,transparent);
--vibeui-contextmenu-006-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-contextmenu-006-hover:light-dark(oklch(0.97 0 265),oklch(0.31 0 265));
--vibeui-contextmenu-006-accent:light-dark(oklch(0.55 0.18 250),oklch(0.75 0.14 250));
--vibeui-contextmenu-006-danger:light-dark(oklch(0.56 0.19 25),oklch(0.73 0.16 25));
--vibeui-contextmenu-006-shadow:light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-006-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-006-x:50%;
--vibeui-contextmenu-006-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contextmenu-006"]{color-scheme:dark}
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
background:var(--vibeui-contextmenu-006-surface);color:var(--vibeui-contextmenu-006-fg);
border:1px solid var(--vibeui-contextmenu-006-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-006-shadow);
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
/* Развёрнутый режим: меню стоит в потоке под таблицей, а не в верхнем слое. */
[data-vibeui-block="contextmenu-006"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-006"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ROWS: Contextmenu006Row[] = [
  { name: "ООО «Полдень»", status: "Оплачен", sum: "84 000 ₽" },
  { name: "Ирина Ковалёва", status: "Ждёт оплаты", sum: "12 500 ₽" },
  { name: "Студия «Круг»", status: "Черновик", sum: "31 200 ₽" },
]

const DEFAULT_ACTIONS: Contextmenu006Action[] = [
  { label: "Открыть карточку", keys: "↵" },
  { label: "Скопировать ссылку", keys: "Ctrl+L" },
  { label: "Дублировать строку", keys: "Ctrl+D" },
]

const DEFAULT_COLUMN_TEXT: Record<"name" | "status" | "sum", string> = {
  name: "Клиент",
  status: "Статус",
  sum: "Сумма",
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
 * Контекстное меню строки таблицы: подсветка цели и вызов с клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu006({
  open = false,
  caption = "Счета за март",
  captionHint = "правый клик по строке или Shift+F10",
  rows = DEFAULT_ROWS,
  columnText = DEFAULT_COLUMN_TEXT,
  actions = DEFAULT_ACTIONS,
  deleteLabel = "Удалить строку",
  menuLabel = "Строка: {row}",
  menuTitle = "Строка",
  background = "",
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
    ...(background
      ? {
          "--vibeui-contextmenu-006-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
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
        data-slot="context-menu"
        data-vibeui-block="contextmenu-006"
        aria-label={caption}
        className={className}
        style={palette}
      >
        <table>
          <caption>
            {caption} · {captionHint}
          </caption>
          <thead>
            <tr>
              <th scope="col">{columnText.name}</th>
              <th scope="col">{columnText.status}</th>
              <th scope="col">{columnText.sum}</th>
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
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={target ? menuLabel.replace("{row}", target) : menuTitle}
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
          {actions.map((action) => (
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
            {deleteLabel}
            <span data-part="keys">Backspace</span>
          </button>
        </div>
      </section>
    </>
  )
}
