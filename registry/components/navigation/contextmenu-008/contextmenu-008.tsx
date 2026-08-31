"use client"

import { useRef, useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEvent,
  PointerEvent,
} from "react"

export type Contextmenu008Item = {
  label: string
  keys: string
}

export type Contextmenu008Props = Omit<
  ComponentPropsWithoutRef<"section">,
  "children"
> & {
  hint?: string
  items?: Contextmenu008Item[]
  accent?: string
}

// Идея компонента: контекстное меню, которое само себя объясняет. Правый клик
// не виден на экране, поэтому у области стоит пульсирующая подсказка — и
// пропадает после первого удачного вызова, чтобы не мозолить глаза. Сочетания
// клавиш в пунктах написаны тегом kbd: меню здесь ещё и шпаргалка, из которой
// пользователь однажды уходит на клавиатуру. Долгое нажатие открывает то же меню.
const STYLES = `
:where([data-vibeui-block="contextmenu-008"]){
--vibeui-contextmenu-008-bg:oklch(1 0 0);
--vibeui-contextmenu-008-fg:oklch(0.24 0.014 265);
--vibeui-contextmenu-008-muted:oklch(0.55 0.014 265);
--vibeui-contextmenu-008-border:oklch(0.9 0.006 265);
--vibeui-contextmenu-008-hover:oklch(0.96 0.004 265);
--vibeui-contextmenu-008-accent:oklch(0.55 0.19 320);
--vibeui-contextmenu-008-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-008-mono:ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace;
--vibeui-contextmenu-008-x:50%;
--vibeui-contextmenu-008-y:50%;
}
[data-vibeui-block="contextmenu-008"]{
display:flex;flex-direction:column;gap:0.625rem;
width:100%;max-width:21rem;box-sizing:border-box;padding:0.875rem;
background:var(--vibeui-contextmenu-008-bg);color:var(--vibeui-contextmenu-008-fg);
border:1px solid var(--vibeui-contextmenu-008-border);border-radius:1rem;
font-family:var(--vibeui-contextmenu-008-font);
}
[data-vibeui-block="contextmenu-008"] [data-part="area"]{
position:relative;
display:flex;align-items:center;justify-content:center;
min-height:7.5rem;padding:1rem;box-sizing:border-box;
border:1.5px dashed var(--vibeui-contextmenu-008-border);border-radius:0.875rem;
background:
repeating-linear-gradient(45deg,color-mix(in oklab,var(--vibeui-contextmenu-008-accent) 5%,transparent) 0 6px,transparent 6px 12px);
font-size:0.75rem;color:var(--vibeui-contextmenu-008-muted);text-align:center;
touch-action:manipulation;
}
/* Подсказка пульсирует, пока меню ни разу не открыли: правый клик не виден. */
[data-vibeui-block="contextmenu-008"] [data-part="badge"]{
display:inline-flex;align-items:center;gap:0.375rem;
padding:0.3125rem 0.625rem;border-radius:9999px;
background:var(--vibeui-contextmenu-008-bg);
border:1px solid var(--vibeui-contextmenu-008-border);
box-shadow:0 8px 20px -12px oklch(0.2 0.03 265 / 60%);
font-size:0.75rem;font-weight:600;color:var(--vibeui-contextmenu-008-fg);
animation:vibeui-contextmenu-008-pulse 2.4s ease-in-out infinite;
}
[data-vibeui-block="contextmenu-008"][data-used="true"] [data-part="badge"]{animation:none;opacity:.55}
[data-vibeui-block="contextmenu-008"] [data-part="cursor"]{
width:0.875rem;height:0.875rem;color:var(--vibeui-contextmenu-008-accent);
}
@keyframes vibeui-contextmenu-008-pulse{
0%,100%{transform:translateY(0);box-shadow:0 8px 20px -12px oklch(0.2 0.03 265 / 60%)}
50%{transform:translateY(-0.1875rem);box-shadow:0 14px 26px -14px oklch(0.2 0.03 265 / 70%)}
}
[data-vibeui-block="contextmenu-008"] [data-part="row"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
}
[data-vibeui-block="contextmenu-008"] [data-part="note"]{font-size:0.6875rem;color:var(--vibeui-contextmenu-008-muted)}
[data-vibeui-block="contextmenu-008"] [data-part="fallback"]{
appearance:none;cursor:pointer;flex:none;
height:1.875rem;padding:0 0.75rem;
border:1px solid var(--vibeui-contextmenu-008-border);border-radius:0.5rem;
background:var(--vibeui-contextmenu-008-bg);color:inherit;font:inherit;font-size:0.75rem;font-weight:600;
}
[data-vibeui-block="contextmenu-008"] [data-part="fallback"]:hover{background:var(--vibeui-contextmenu-008-hover)}
[data-vibeui-block="contextmenu-008"] [data-part="fallback"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-008-accent);outline-offset:2px}
[data-vibeui-block="contextmenu-008"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;
top:var(--vibeui-contextmenu-008-y);left:var(--vibeui-contextmenu-008-x);
min-width:13rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-008-bg);color:var(--vibeui-contextmenu-008-fg);
border:1px solid var(--vibeui-contextmenu-008-border);border-radius:0.75rem;
box-shadow:0 18px 40px -20px oklch(0.2 0.03 265 / 50%);
font-family:var(--vibeui-contextmenu-008-font);
}
[data-vibeui-block="contextmenu-008"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.25rem;
width:100%;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;
padding:0.4375rem 0.5rem;border-radius:0.5rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
transition:background-color .14s ease;
}
[data-vibeui-block="contextmenu-008"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-008-hover)}
[data-vibeui-block="contextmenu-008"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-008-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-008"] [data-part="keys"]{
display:inline-flex;gap:0.1875rem;
}
[data-vibeui-block="contextmenu-008"] [data-part="keys"] kbd{
min-width:1.125rem;padding:0.0625rem 0.3125rem;box-sizing:border-box;
border:1px solid var(--vibeui-contextmenu-008-border);border-bottom-width:2px;border-radius:0.3125rem;
background:var(--vibeui-contextmenu-008-hover);
font-family:var(--vibeui-contextmenu-008-mono);font-size:0.625rem;
color:var(--vibeui-contextmenu-008-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-008"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Contextmenu008Item[] = [
  { label: "Вставить сюда", keys: "⌘ V" },
  { label: "Выделить всё", keys: "⌘ A" },
  { label: "Отменить", keys: "⌘ Z" },
  { label: "Вернуть", keys: "⇧ ⌘ Z" },
]

/**
 * Контекстное меню с сочетаниями клавиш и подсказкой о правом клике.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu008({
  hint = "Правый клик по холсту",
  items = DEFAULT_ITEMS,
  accent,
  className,
  style,
  ...props
}: Contextmenu008Props) {
  const menu = useRef<HTMLDivElement>(null)
  const timer = useRef<number | null>(null)
  const [used, setUsed] = useState(false)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)

  const openAt = (x: number, y: number) => {
    setUsed(true)
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
    requestAnimationFrame(() =>
      menu.current?.querySelector<HTMLElement>('[data-part="item"]')?.focus(),
    )
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") {
      return
    }

    const { clientX, clientY } = event
    timer.current = window.setTimeout(() => openAt(clientX, clientY), 500)
  }

  const cancelPress = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current)
      timer.current = null
    }
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-008-accent": accent } : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-008-x": spot.x,
          "--vibeui-contextmenu-008-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-008" precedence="medium">
        {STYLES}
      </style>
      <section
        {...props}
        data-vibeui-block="contextmenu-008"
        data-used={used || undefined}
        aria-label="Холст с контекстным меню"
        className={className}
        style={palette}
      >
        <div
          data-part="area"
          onContextMenu={(event: MouseEvent<HTMLDivElement>) => {
            event.preventDefault()
            openAt(event.clientX, event.clientY)
          }}
          onPointerDown={onPointerDown}
          onPointerUp={cancelPress}
          onPointerLeave={cancelPress}
        >
          <span data-part="badge">
            <svg
              data-part="cursor"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 3l14 8-6 1.5L10 19 5 3z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            {hint}
          </span>
        </div>
        <div data-part="row">
          <span data-part="note">на телефоне — долгое нажатие</span>
          <button
            type="button"
            data-part="fallback"
            aria-haspopup="menu"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left, box.bottom + 6)
            }}
          >
            Открыть меню
          </button>
        </div>
        <div
          ref={menu}
          data-part="menu"
          popover="auto"
          role="menu"
          aria-label="Правка"
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
              return
            }

            event.preventDefault()
            const list = Array.from(
              menu.current?.querySelectorAll<HTMLElement>(
                '[data-part="item"]',
              ) ?? [],
            )

            if (list.length === 0) {
              return
            }

            const delta = event.key === "ArrowDown" ? 1 : -1
            const from = list.indexOf(document.activeElement as HTMLElement)
            list[(from + delta + list.length) % list.length].focus()
          }}
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              data-part="item"
              onClick={() => menu.current?.hidePopover()}
            >
              {item.label}
              <span data-part="keys" aria-hidden="true">
                {item.keys.split(" ").map((key) => (
                  <kbd key={key}>{key}</kbd>
                ))}
              </span>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
