"use client"

import { useState } from "react"
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from "react"

export type Menu002Item = {
  label: string
  hint?: string
  danger?: boolean
}

export type Menu002Props = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  items?: Menu002Item[]
  hint?: string
  accent?: string
}

// Идея компонента: контекстное меню по правой кнопке. Оно появляется там, где
// нажали, поэтому координаты считаются от события — их не даст ни popover, ни
// якорное позиционирование. Закрывается выбором, Escape и уходом курсора. На
// телефоне правой кнопки нет, поэтому те же действия обязаны быть где-то ещё.
const STYLES = `
:where([data-vibeui-block="menu-002"]){
--vibeui-menu-002-bg:oklch(1 0 0);
--vibeui-menu-002-fg:oklch(0.24 0.014 265);
--vibeui-menu-002-muted:oklch(0.56 0.014 265);
--vibeui-menu-002-border:oklch(0.9 0.006 265);
--vibeui-menu-002-hover:oklch(0.96 0.004 265);
--vibeui-menu-002-danger:oklch(0.56 0.19 25);
--vibeui-menu-002-accent:oklch(0.55 0.17 265);
--vibeui-menu-002-font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
[data-vibeui-block="menu-002"]{
width:100%;max-width:20rem;box-sizing:border-box;
font-family:var(--vibeui-menu-002-font);color:var(--vibeui-menu-002-fg);
}
/* Область, на которой работает правая кнопка: она обязана быть очевидной. */
[data-vibeui-block="menu-002"] [data-part="zone"]{
display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.375rem;
min-height:7rem;padding:1rem;box-sizing:border-box;text-align:center;
border:1.5px dashed var(--vibeui-menu-002-border);border-radius:0.875rem;
background:var(--vibeui-menu-002-bg);
}
[data-vibeui-block="menu-002"] [data-part="zone-title"]{font-size:0.875rem;font-weight:650}
[data-vibeui-block="menu-002"] [data-part="zone-hint"]{font-size:0.75rem;color:var(--vibeui-menu-002-muted)}
[data-vibeui-block="menu-002"] [data-part="menu"]{
position:fixed;margin:0;padding:0.3125rem;min-width:12rem;
border:1px solid var(--vibeui-menu-002-border);border-radius:0.75rem;
background:var(--vibeui-menu-002-bg);color:inherit;
box-shadow:0 18px 40px -22px oklch(0.2 0.02 265 / 55%);
}
[data-vibeui-block="menu-002"] [data-part="item"]{
display:flex;align-items:center;justify-content:space-between;gap:0.75rem;
width:100%;min-height:2rem;padding:0 0.5rem;
appearance:none;border:0;border-radius:0.5rem;background:transparent;color:inherit;
font:inherit;font-size:0.8125rem;text-align:left;cursor:pointer;
}
[data-vibeui-block="menu-002"] [data-part="item"]:hover{background:var(--vibeui-menu-002-hover)}
[data-vibeui-block="menu-002"] [data-part="item"]:focus-visible{outline:2px solid var(--vibeui-menu-002-accent);outline-offset:-2px}
[data-vibeui-block="menu-002"] [data-part="item"][data-danger="true"]{color:var(--vibeui-menu-002-danger)}
[data-vibeui-block="menu-002"] kbd{
padding:0.0625rem 0.3125rem;border-radius:0.25rem;
border:1px solid var(--vibeui-menu-002-border);
font-family:inherit;font-size:0.6875rem;color:var(--vibeui-menu-002-muted);
}
[data-vibeui-block="menu-002"] [data-part="picked"]{
margin-top:0.5rem;font-size:0.75rem;color:var(--vibeui-menu-002-muted);text-align:center;
}
@media (prefers-reduced-motion:reduce){[data-vibeui-block="menu-002"] *{animation:none!important;transition:none!important}}
`

const DEFAULT_ITEMS: Menu002Item[] = [
  { label: "Открыть", hint: "Enter" },
  { label: "Переименовать", hint: "F2" },
  { label: "Копировать путь" },
  { label: "Удалить", hint: "⌫", danger: true },
]

/**
 * Контекстное меню по правой кнопке: координаты от события, закрытие по
 * выбору, Escape и уходу курсора.
 * Один файл, ноль зависимостей, собственная палитра.
 */
export function Menu002({
  items = DEFAULT_ITEMS,
  hint = "Нажмите правой кнопкой по области",
  accent,
  className,
  style,
  ...props
}: Menu002Props) {
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null)
  const [picked, setPicked] = useState<string | null>(null)

  const palette = {
    ...(accent ? { "--vibeui-menu-002-accent": accent } : null),
    ...style,
  } as CSSProperties

  const open = (event: ReactMouseEvent) => {
    event.preventDefault()
    setPoint({ x: event.clientX, y: event.clientY })
  }

  return (
    <>
      <style href="vibeui-menu-002" precedence="medium">
        {STYLES}
      </style>
      <div
        {...props}
        data-vibeui-block="menu-002"
        className={className}
        style={palette}
      >
        <div data-part="zone" onContextMenu={open}>
          <span data-part="zone-title">Файл «Каталог.fig»</span>
          <span data-part="zone-hint">{hint}</span>
        </div>
        {point ? (
          <div
            data-part="menu"
            role="menu"
            aria-label="Действия с файлом"
            style={{ left: point.x, top: point.y }}
            onMouseLeave={() => setPoint(null)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setPoint(null)
            }}
          >
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                data-part="item"
                data-danger={item.danger}
                onClick={() => {
                  setPicked(item.label)
                  setPoint(null)
                }}
              >
                {item.label}
                {item.hint ? <kbd>{item.hint}</kbd> : null}
              </button>
            ))}
          </div>
        ) : null}
        <p data-part="picked" role="status">
          {picked ? `Выбрано: ${picked}` : "Действие не выбрано"}
        </p>
      </div>
    </>
  )
}
