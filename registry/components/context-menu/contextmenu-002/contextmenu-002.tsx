"use client"

import { useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEvent,
  PointerEvent,
} from "react"

export type Contextmenu002Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children" | "title"
> & {
  title?: string
  files?: string[]
  accent?: string
}

// Идея компонента: контекстное меню файла в списке. Правый клик открывает его
// у курсора, но у каждой плитки есть кнопка «•••» и долгое нажатие: на
// телефоне правой кнопки нет, а меню — единственный способ переименовать файл.
// Плитка, к которой относится меню, подсвечивается: без этого при пяти
// одинаковых плитках непонятно, что именно удаляется.
const STYLES = `
:where([data-vibeui-block="contextmenu-002"]){
--vibeui-contextmenu-002-bg:oklch(1 0 0);
--vibeui-contextmenu-002-fg:oklch(0.24 0.014 265);
--vibeui-contextmenu-002-muted:oklch(0.55 0.014 265);
--vibeui-contextmenu-002-border:oklch(0.9 0.006 265);
--vibeui-contextmenu-002-hover:oklch(0.96 0.004 265);
--vibeui-contextmenu-002-accent:oklch(0.55 0.18 258);
--vibeui-contextmenu-002-danger:oklch(0.56 0.19 25);
--vibeui-contextmenu-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-002-x:50%;
--vibeui-contextmenu-002-y:50%;
}
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
background:var(--vibeui-contextmenu-002-bg);color:var(--vibeui-contextmenu-002-fg);
border:1px solid var(--vibeui-contextmenu-002-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px oklch(0.2 0.03 265 / 50%);
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
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_FILES = [
  "Отчёт за март.pdf",
  "Смета.xlsx",
  "Логотип.svg",
  "Договор.docx",
]

const ACTIONS = [
  { label: "Открыть", keys: "↵" },
  { label: "Переименовать", keys: "F2" },
  { label: "Скачать", keys: "⌘S" },
]

/**
 * Контекстное меню файла: правый клик, кнопка «•••» и долгое нажатие.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu002({
  title = "Документы",
  files = DEFAULT_FILES,
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
    setDone(`${action}: ${target}`)
    menu.current?.hidePopover()
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-002-accent": accent } : null),
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
        data-vibeui-block="contextmenu-002"
        aria-label={title}
        className={className}
        style={palette}
      >
        <div data-part="head">
          <h3 data-part="title">{title}</h3>
          <span data-part="hint">правый клик · «•••» · долгое нажатие</span>
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
                aria-label={`Действия: ${file}`}
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
          popover="auto"
          role="menu"
          aria-label={target ? `Действия: ${target}` : "Действия"}
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
          {ACTIONS.map((action) => (
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
            onClick={() => run("Удалить")}
          >
            Удалить
            <span data-part="keys">⌫</span>
          </button>
        </div>
      </section>
    </>
  )
}
