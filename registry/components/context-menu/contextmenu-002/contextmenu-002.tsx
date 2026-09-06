"use client"

import { useRef, useState } from "react"
import type {
  ComponentProps,
  CSSProperties,
  MouseEvent,
  PointerEvent,
} from "react"

export type Contextmenu002Action = {
  label: string
  keys?: string
}

export type Contextmenu002Props = Omit<
  ComponentProps<"section">,
  "children" | "title"
> & {
  /**
   * Показать меню развёрнутым в потоке страницы: витрина, скриншот, отладка.
   * В этом режиме popover не используется, поэтому Esc и клик мимо не работают.
   */
  open?: boolean
  title?: string
  files?: string[]
  /** Подсказка в шапке: компонент несёт русскую, проект подставляет свою. */
  hint?: string
  actions?: Contextmenu002Action[]
  deleteLabel?: string
  /** Имя меню для скринридера, когда цель ещё не выбрана. */
  menuLabel?: string
  /** Имя кнопки «•••» и открытого меню; {file} — имя файла. */
  moreLabel?: string
  /** Строка отчёта; {action} — действие, {file} — имя файла. */
  doneText?: string
  /** Пусто — подложки нет, компонент лежит прямо на фоне страницы. */
  background?: string
  accent?: string
}

// Идея компонента: контекстное меню файла в списке. Правый клик открывает его
// у курсора, но у каждой плитки есть кнопка «•••» и долгое нажатие: на
// телефоне правой кнопки нет, а меню — единственный способ переименовать файл.
// Плитка, к которой относится меню, подсвечивается: без этого при пяти
// одинаковых плитках непонятно, что именно удаляется.
const STYLES = `
:where([data-vibeui-block="contextmenu-002"]){
--vibeui-contextmenu-002-bg:transparent;
--vibeui-contextmenu-002-surface:light-dark(oklch(1 0 0),oklch(0.24 0 265));
--vibeui-contextmenu-002-fg:light-dark(oklch(0.24 0 265),oklch(0.94 0 265));
--vibeui-contextmenu-002-muted:color-mix(in oklab,var(--vibeui-contextmenu-002-fg) 68%,transparent);
--vibeui-contextmenu-002-border:light-dark(oklch(0.9 0 265),oklch(0.37 0 265));
--vibeui-contextmenu-002-hover:light-dark(oklch(0.96 0 265),oklch(0.31 0 265));
--vibeui-contextmenu-002-accent:light-dark(oklch(0.55 0.18 39.8),oklch(0.75 0.14 39.8));
--vibeui-contextmenu-002-danger:light-dark(oklch(0.56 0.19 25),oklch(0.73 0.16 25));
--vibeui-contextmenu-002-shadow:light-dark(oklch(0.2 0 265 / 50%),oklch(0 0 0 / 72%));
--vibeui-contextmenu-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-002-x:50%;
--vibeui-contextmenu-002-y:50%;
}
/* Тёмная тема классом: light-dark() смотрит только на color-scheme, а
   next-themes и shadcn ставят класс .dark и его не объявляют. */
:where(.dark,[data-theme="dark"]) [data-vibeui-block="contextmenu-002"]{color-scheme:dark}
[data-vibeui-block="contextmenu-002"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:23rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-contextmenu-002-bg);color:var(--vibeui-contextmenu-002-fg);
border:1px solid var(--vibeui-contextmenu-002-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-002-font);
}
[data-vibeui-block="contextmenu-002"] [data-part="head"]{
display:flex;align-items:baseline;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="contextmenu-002"] [data-part="title"]{font-size:0.875rem;font-weight:650;margin:0}
[data-vibeui-block="contextmenu-002"] [data-part="hint"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-002-muted)}
[data-vibeui-block="contextmenu-002"] [data-part="grid"]{
display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.5rem;margin:0;padding:0;list-style:none;
}
[data-vibeui-block="contextmenu-002"] [data-part="tile"]{
display:flex;align-items:center;gap:0.5rem;
padding:0.5rem 0.4375rem 0.5rem 0.625rem;box-sizing:border-box;
border:1px solid var(--vibeui-contextmenu-002-border);border-radius:0.75rem;
font-size:0.75rem;touch-action:manipulation;
transition:background-color .14s ease,border-color .14s ease;
}
[data-vibeui-block="contextmenu-002"] [data-part="tile"][data-active="true"]{
border-color:var(--vibeui-contextmenu-002-accent);
background:color-mix(in oklab,var(--vibeui-contextmenu-002-accent) 8%,transparent);
}
[data-vibeui-block="contextmenu-002"] [data-part="sheet"]{
display:flex;align-items:center;justify-content:center;flex:none;
width:1.5rem;height:1.75rem;border-radius:0.25rem;
background:color-mix(in oklab,var(--vibeui-contextmenu-002-accent) 14%,transparent);
color:var(--vibeui-contextmenu-002-accent);font-size:0.5625rem;font-weight:700;
}
[data-vibeui-block="contextmenu-002"] [data-part="name"]{
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-002"] [data-part="more"]{
appearance:none;cursor:pointer;margin-left:auto;flex:none;
width:1.5rem;height:1.5rem;padding:0;
border:0;border-radius:0.4375rem;background:none;color:var(--vibeui-contextmenu-002-muted);
font:inherit;font-size:0.75rem;line-height:1;
}
[data-vibeui-block="contextmenu-002"] [data-part="more"]:hover{background:var(--vibeui-contextmenu-002-hover)}
[data-vibeui-block="contextmenu-002"] [data-part="more"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-002-accent);outline-offset:1px}
[data-vibeui-block="contextmenu-002"] [data-part="log"]{
margin:0;font-size:0.6875rem;color:var(--vibeui-contextmenu-002-muted);min-height:1rem;
}
/* Координаты курсора известны только в момент события — отсюда переменные. */
[data-vibeui-block="contextmenu-002"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-002-y);left:var(--vibeui-contextmenu-002-x);
min-width:12rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-002-surface);color:var(--vibeui-contextmenu-002-fg);
border:1px solid var(--vibeui-contextmenu-002-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px var(--vibeui-contextmenu-002-shadow);
font-family:var(--vibeui-contextmenu-002-font);
}
[data-vibeui-block="contextmenu-002"] [data-part="target"]{
padding:0.375rem 0.5rem 0.3125rem;margin-bottom:0.25rem;
border-bottom:1px solid var(--vibeui-contextmenu-002-border);
font-size:0.6875rem;font-weight:650;color:var(--vibeui-contextmenu-002-muted);
overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
}
[data-vibeui-block="contextmenu-002"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.25rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-002"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-002-hover)}
[data-vibeui-block="contextmenu-002"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-002-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-002"] [data-part="item"][data-danger="true"]{color:var(--vibeui-contextmenu-002-danger)}
[data-vibeui-block="contextmenu-002"] [data-part="keys"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-002-muted)}
[data-vibeui-block="contextmenu-002"] [data-part="rule"]{
height:1px;margin:0.3125rem 0.25rem;background:var(--vibeui-contextmenu-002-border);
}
/* Развёрнутый режим: меню стоит в потоке под областью, а не в верхнем слое. */
[data-vibeui-block="contextmenu-002"] [data-part="menu"][data-open="true"]{
position:static;margin-block-start:0.5rem;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILES = [
  "Отчёт за март.pdf",
  "Смета.xlsx",
  "Логотип.svg",
  "Договор.docx",
]

const DEFAULT_ACTIONS: Contextmenu002Action[] = [
  { label: "Открыть", keys: "↵" },
  { label: "Переименовать", keys: "F2" },
  { label: "Скачать", keys: "Ctrl+S" },
]

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
 * Контекстное меню файла: правый клик, кнопка «•••» и долгое нажатие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu002({
  open = false,
  title = "Документы",
  files = DEFAULT_FILES,
  hint = "правый клик · «•••» · долгое нажатие",
  actions = DEFAULT_ACTIONS,
  deleteLabel = "Удалить",
  menuLabel = "Действия",
  moreLabel = "Действия: {file}",
  doneText = "{action}: {file}",
  background = "",
  accent,
  className,
  style,
  ...props
}: Contextmenu002Props) {
  const menu = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)
  const [target, setTarget] = useState<string | null>(null)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)
  const [done, setDone] = useState("")

  const openAt = (x: number, y: number, file: string) => {
    setTarget(file)
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const onContextMenu = (event: MouseEvent<HTMLElement>, file: string) => {
    event.preventDefault()
    openAt(event.clientX, event.clientY, file)
  }

  // Долгое нажатие — единственный жест «правого клика» на телефоне.
  const onPointerDown = (event: PointerEvent<HTMLElement>, file: string) => {
    if (event.pointerType !== "touch") {
      return
    }

    const { clientX, clientY } = event
    timer.current = window.setTimeout(() => openAt(clientX, clientY, file), 500)
  }

  const cancelPress = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  const run = (action: string) => {
    setDone(
      doneText.replace("{action}", action).replace("{file}", target ?? ""),
    )
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-002-accent": accent } : null),
    ...(background
      ? {
          "--vibeui-contextmenu-002-bg": background,
          colorScheme: schemeForBackground(background),
        }
      : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-002-x": spot.x,
          "--vibeui-contextmenu-002-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-002" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-slot="context-menu"
        data-vibeui-block="contextmenu-002"
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="hint">{hint}</span>
        </div>
        <ul data-part="grid">
          {files.map((file) => (
            <li
              key={file}
              data-part="tile"
              data-active={target === file || undefined}
              onContextMenu={(event) => onContextMenu(event, file)}
              onPointerDown={(event) => onPointerDown(event, file)}
              onPointerUp={cancelPress}
              onPointerLeave={cancelPress}
            >
              <span data-part="sheet" aria-hidden="true">
                {file.split(".").pop()?.slice(0, 3).toUpperCase()}
              </span>
              <span data-part="name">{file}</span>
              <button
                type="button"
                data-part="more"
                aria-haspopup="menu"
                aria-label={moreLabel.replace("{file}", file)}
                onClick={(event) => {
                  const box = event.currentTarget.getBoundingClientRect()
                  openAt(box.left, box.bottom + 4, file)
                }}
              >
                •••
              </button>
            </li>
          ))}
        </ul>
        <p data-part="log" role="status">
          {done}
        </p>
        <div
          ref={menu}
          data-part="menu"
          popover={open ? undefined : "auto"}
          data-open={open || undefined}
          role="menu"
          aria-label={target ? moreLabel.replace("{file}", target) : menuLabel}
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
          onToggle={() => {
            if (!menu.current?.matches(":popover-open")) {
              setTarget(null)
            }
          }}
        >
          <div data-part="target">{target}</div>
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              data-part="item"
              onClick={() => run(action.label)}
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
            onClick={() => run(deleteLabel)}
          >
            {deleteLabel}
            <span data-part="keys">Backspace</span>
          </button>
        </div>
      </section>
    </>
  )
}
