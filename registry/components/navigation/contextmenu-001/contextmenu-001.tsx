"use client"

import { useRef, useState } from "react"
import type { ComponentPropsWithoutRef, CSSProperties, MouseEvent } from "react"

export type Contextmenu001Item = {
  label: string
  keys?: string
  danger?: boolean
}

export type Contextmenu001Props = Omit<
  ComponentPropsWithoutRef<"div">,
  "children"
> & {
  items?: Contextmenu001Item[]
  hint?: string
  accent?: string
}

// Идея компонента: меню по правому клику. Само меню — HTML popover, поэтому
// закрытие по Escape и клику мимо достаётся от браузера, а координаты курсора
// подставляются переменными: они известны только в момент события. Меню
// доступно и с клавиатуры: у области есть кнопка-дублёр, иначе правый клик
// остаётся единственным способом, а он не работает без мыши.
const STYLES = `
:where([data-vibeui-block="contextmenu-001"]){
--vibeui-contextmenu-001-bg:oklch(1 0 0);
--vibeui-contextmenu-001-fg:oklch(0.24 0.014 265);
--vibeui-contextmenu-001-muted:oklch(0.56 0.014 265);
--vibeui-contextmenu-001-border:oklch(0.9 0.006 265);
--vibeui-contextmenu-001-hover:oklch(0.55 0.02 265 / 9%);
--vibeui-contextmenu-001-accent:oklch(0.55 0.2 262);
--vibeui-contextmenu-001-danger:oklch(0.56 0.19 25);
--vibeui-contextmenu-001-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
--vibeui-contextmenu-001-x:50%;
--vibeui-contextmenu-001-y:50%;
}
[data-vibeui-block="contextmenu-001"]{
width:100%;max-width:22rem;box-sizing:border-box;
font-family:var(--vibeui-contextmenu-001-font);color:var(--vibeui-contextmenu-001-fg);
}
[data-vibeui-block="contextmenu-001"] [data-part="area"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;
min-height:8rem;padding:1rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-001-bg);
border:1px dashed var(--vibeui-contextmenu-001-border);border-radius:0.875rem;
font-size:0.8125rem;color:var(--vibeui-contextmenu-001-muted);text-align:center;
}
[data-vibeui-block="contextmenu-001"] [data-part="fallback"]{
appearance:none;cursor:pointer;
height:1.875rem;padding:0 0.75rem;border-radius:0.5rem;
border:1px solid var(--vibeui-contextmenu-001-border);
background:none;color:var(--vibeui-contextmenu-001-fg);font:inherit;font-size:0.75rem;
}
[data-vibeui-block="contextmenu-001"] [data-part="fallback"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-001-accent);outline-offset:2px}
/* Координаты курсора известны только в момент клика — отсюда переменные. */
[data-vibeui-block="contextmenu-001"] [data-part="menu"]{
position:fixed;margin:0;padding:0.25rem;
top:var(--vibeui-contextmenu-001-y);left:var(--vibeui-contextmenu-001-x);
min-width:11rem;box-sizing:border-box;
background:var(--vibeui-contextmenu-001-bg);color:var(--vibeui-contextmenu-001-fg);
border:1px solid var(--vibeui-contextmenu-001-border);border-radius:0.625rem;
box-shadow:0 16px 36px -18px oklch(0.2 0.03 265 / 45%);
font-family:var(--vibeui-contextmenu-001-font);
}
[data-vibeui-block="contextmenu-001"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
width:100%;min-height:1.875rem;padding:0 0.5rem;box-sizing:border-box;
appearance:none;border:0;background:none;cursor:pointer;border-radius:0.4375rem;
font:inherit;font-size:0.8125rem;color:inherit;text-align:left;
}
[data-vibeui-block="contextmenu-001"] [data-part="item"]:hover{background:var(--vibeui-contextmenu-001-hover)}
[data-vibeui-block="contextmenu-001"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-contextmenu-001-accent);outline-offset:-2px}
[data-vibeui-block="contextmenu-001"] [data-part="item"][data-danger="true"]{color:var(--vibeui-contextmenu-001-danger)}
[data-vibeui-block="contextmenu-001"] [data-part="keys"]{font-size:0.75rem;color:var(--vibeui-contextmenu-001-muted)}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="contextmenu-001"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Contextmenu001Item[] = [
  { label: "Открыть", keys: "↵" },
  { label: "Переименовать", keys: "F2" },
  { label: "Дублировать", keys: "⌘D" },
  { label: "Удалить", keys: "⌫", danger: true },
]

/**
 * Меню по правому клику на HTML popover, с кнопкой-дублёром для клавиатуры.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Contextmenu001({
  items = DEFAULT_ITEMS,
  hint = "Правый клик по области — или кнопка ниже",
  accent,
  className,
  style,
  ...props
}: Contextmenu001Props) {
  const menu = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState<{ x: string; y: string } | null>(null)

  const openAt = (x: number, y: number) => {
    setSpot({ x: `${Math.round(x)}px`, y: `${Math.round(y)}px` })
    menu.current?.showPopover()
  }

  const onContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    openAt(event.clientX, event.clientY)
  }

  const palette = {
    ...(accent ? { "--vibeui-contextmenu-001-accent": accent } : null),
    ...(spot
      ? {
          "--vibeui-contextmenu-001-x": spot.x,
          "--vibeui-contextmenu-001-y": spot.y,
        }
      : null),
    ...style,
  } as CSSProperties

  return (
    <>
      <style href="vibeui-contextmenu-001" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="contextmenu-001"
        className={className}
        style={palette}
      >
        <div data-part="area" onContextMenu={onContextMenu}>
          {hint}
          <button
            type="button"
            data-part="fallback"
            onClick={(event) => {
              const box = event.currentTarget.getBoundingClientRect()
              openAt(box.left, box.bottom + 6)
            }}
          >
            Действия
          </button>
        </div>
        <div data-part="menu" popover="auto" role="menu" ref={menu}>
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              data-part="item"
              data-danger={item.danger}
              role="menuitem"
              onClick={() => menu.current?.hidePopover()}
            >
              {item.label}
              {item.keys ? <span data-part="keys">{item.keys}</span> : null}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
